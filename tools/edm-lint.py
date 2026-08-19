#!/usr/bin/env python3
"""Lint an EDM/newsletter HTML body for email-client rendering hazards.

Usage:
  python3 tools/edm-lint.py body.html [template.html]
  python3 tools/edm-lint.py --campaign 10          # pull body+template from Listmonk over SSH

Exit code 1 if any ERROR is found (warnings don't fail).

Born from the August 2026 newsletter incident: line-height:0.95 on a 44px
headline rendered fine in Gmail but clipped the text in Outlook-family
clients, discovered mid-send by a recipient.
"""
import json
import re
import subprocess
import sys

SSH = ["ssh", "-i", "/Users/andy/.ssh/command_center_ed25519", "root@72.62.244.83"]
API = 'curl -s -m 30 -H "Authorization: token $(cut -d= -f2 /opt/listmonk/.api | head -1):$(cut -d= -f2 /opt/listmonk/.api | tail -1)"'

errors, warnings = [], []


def err(msg):
    errors.append(msg)


def warn(msg):
    warnings.append(msg)


def fetch_campaign(cid):
    def api(path):
        creds = 'H="Authorization: token $(sed -n 1p /opt/listmonk/.api | cut -d= -f2):$(sed -n 2p /opt/listmonk/.api | cut -d= -f2)"'
        out = subprocess.run(
            SSH + [f'{creds}; curl -s -m 30 -H "$H" http://localhost:9000{path}'],
            capture_output=True, text=True, check=True,
        ).stdout
        return json.loads(out)["data"]

    c = api(f"/api/campaigns/{cid}")
    t = api(f"/api/templates/{c['template_id']}") if c.get("template_id") else {"body": ""}
    return c["body"], t["body"]


def styled_elements(html):
    """Yield (tag, style_dict, text_start) for every element with a style attr."""
    for m in re.finditer(r"<(\w+)[^>]*style=\"([^\"]*)\"", html):
        style = {}
        for part in m.group(2).split(";"):
            if ":" in part:
                k, v = part.split(":", 1)
                style[k.strip().lower()] = v.strip()
        yield m.group(1).lower(), style, m.start()


def px(v):
    m = re.match(r"(-?[\d.]+)px", v or "")
    return float(m.group(1)) if m else None


def lint(body, template):
    full = template.replace("{{ template \"content\" . }}", body) if template else body

    # 1. Line-height clipping on display type (the Aug 2026 bug)
    for tag, style, pos in styled_elements(body):
        lh, fs = style.get("line-height", ""), px(style.get("font-size", ""))
        if not lh:
            continue
        try:
            lh_val = float(lh) if "px" not in lh else float(lh.replace("px", "")) / (fs or 16)
        except ValueError:
            continue
        hidden = style.get("display") == "none"
        if lh_val < 1.05 and (fs or 0) >= 20 and not hidden:
            err(f"<{tag}> at offset {pos}: line-height {lh} on {fs:g}px type — "
                f"Outlook-family clients clip line boxes below ~1.05. Use >= 1.1.")

    # 2. Click tracking: every real link must be TrackLink-wrapped
    for m in re.finditer(r'<a\s[^>]*href="([^"]+)"', body):
        href = m.group(1)
        if href.startswith(("mailto:", "tel:", "{{")):
            continue
        err(f"Untracked link: {href} — wrap as {{{{ TrackLink \"{href}\" . }}}} or clicks won't be counted.")

    # 3. Open tracking pixel
    if "TrackView" not in full:
        err("No {{ TrackView }} in template or body — opens will not be tracked.")

    # 4. Unsubscribe
    if "UnsubscribeURL" not in full:
        warn("No visible {{ UnsubscribeURL }} link — only the List-Unsubscribe header. "
             "Add a footer unsubscribe link for compliance.")

    # 5. Preheader
    if not re.search(r"display:\s*none[^>]*>\s*\S", body[:2000]):
        warn("No hidden preheader text found at top of body.")

    # 6. Images: https + alt
    for m in re.finditer(r"<img\s[^>]*", body):
        tag = m.group(0)
        src = re.search(r'src="([^"]+)"', tag)
        if src and src.group(1).startswith("http://"):
            err(f"Insecure image URL: {src.group(1)}")
        if 'alt="' not in tag:
            warn(f"Image without alt text: {(src.group(1) if src else tag)[:80]}")

    # 7. Fragile CSS in email clients
    for prop, note in [("position:", "position is ignored by most clients"),
                       ("flex", "flexbox unsupported in Outlook"),
                       ("grid", "grid unsupported in Outlook")]:
        if re.search(rf"style=\"[^\"]*{prop}", body):
            warn(f"'{prop}' found in inline styles — {note}.")

    # 8. Negative letter-spacing beyond -1px on large type
    for tag, style, pos in styled_elements(body):
        ls, fs = px(style.get("letter-spacing", "")), px(style.get("font-size", ""))
        if ls is not None and ls < -1 and (fs or 0) >= 20:
            warn(f"<{tag}> at offset {pos}: letter-spacing {ls:g}px on {fs:g}px type — "
                 f"can cause glyph overlap in Outlook; keep >= -1px.")


def main():
    if sys.argv[1:2] == ["--campaign"]:
        body, template = fetch_campaign(int(sys.argv[2]))
    else:
        body = open(sys.argv[1]).read()
        template = open(sys.argv[2]).read() if len(sys.argv) > 2 else ""
    lint(body, template)
    for w in warnings:
        print(f"WARN  {w}")
    for e in errors:
        print(f"ERROR {e}")
    print(f"\n{len(errors)} error(s), {len(warnings)} warning(s)")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
