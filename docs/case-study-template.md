# Case Study Template

How to add or update a case study on the Hotshoes website. Copy the content block,
drop the images in, done — no component code needs to change.

Sections 3–7 cover image handling, which is where all the real time goes. Read
those before touching Magnific or spending credits.

---

## 1. Where things live

| What | Where |
|---|---|
| Case study content | `app/data/content.js` → the `cases` array |
| Images | `public/assets/cases/` |
| Page layout (shared by all cases) | `app/case-study/[caseId]/CaseStudyView.js` |
| Source material | Google Drive → *EPIC Case Study Library* → category folder |

Each case study folder in Drive contains a write-up doc (Challenge / Experience /
Impact) and an `Images` subfolder. Some also have `video-links.txt`.

---

## 2. The content block

Add a new object to the end of the `cases` array in `app/data/content.js`:

```js
{
  n: '08',                                    // next number in sequence, zero-padded
  client: 'Client Name',
  title: 'Campaign Name',
  category: 'Brand Activation',               // must match a value in caseCategories
  photo: '/assets/cases/slug-cover.webp',     // cover — see section 3

  challenge:  '...',                          // straight from the Drive write-up
  experience: '...',
  impact:     '...',

  metrics: [                                  // exactly 3
    { value: '25K', label: 'Total Engagements',      icon: 'globe' },
    { value: '25',  label: 'Days of Activation',     icon: 'calendar' },
    { value: '3',   label: 'Venue Types Nationwide', icon: 'screen' },
  ],

  photos: [                                   // gallery — 5 is typical, any number works
    '/assets/cases/slug-01.webp',
    '/assets/cases/slug-02.webp',
    '/assets/cases/slug-03.webp',
    '/assets/cases/slug-04.webp',
    '/assets/cases/slug-05.webp',
  ],

  // Optional — only if there's a campaign video
  youtubeId: 'abc123',
  heroVideo: true,
},
```

### Field notes

- **`n`** drives the URL (`/case-study/08`) and the prev/next navigation, which
  wraps automatically. Take the next number.
- **`category`** must match a value in `caseCategories` or the homepage work
  filter won't pick it up.
- **`metrics`** — always three. Valid icons: `globe`, `calendar`, `screen`. Keep
  `value` short (`25K`, `12+`, `4.37M`); the label carries the detail.
- **`photos`** — the carousel handles any count. Five is typical; three (7-Eleven)
  and seven (Purina) both render fine.
- **`heroVideo: true` changes where the cover appears.** With a video hero the
  case study page plays the YouTube video, and `photo` is used **only on the
  homepage work card**. Don't spend time perfecting a cover for the page hero on
  a video-hero case — you won't see it there.

---

## 3. Choosing photos

**Check the filenames first.** Teams sometimes name the intended cover literally
`Cover` or `cover photo`. It's one metadata call and it saves picking the wrong
shot by eye:

```bash
# via the Drive MCP
get_file_metadata(fileId) → .title
```

Everything else is usually a generic deck extract like
`CLIENT PE Deck_28713_... - Slide 15 - Photo 01.jpg`. A file with a real name is
almost always deliberate.

What works in a gallery shot:

- **Clear branding** — logos, brand walls, product standees visible
- **The activation itself** — the build, the space, the scale
- **Happy people with the product** — this is the one that sells the work

Avoid: empty builds with no people, crowds shot from behind, faces cut off or out
of focus, near-duplicates of a shot you already picked.

**Cover image.** Landscape with strong branding, ideally with people. Doesn't have
to be one of the gallery photos. See section 5 for portrait covers.

---

## 4. Check the source before you process anything

Two checks, both cheap, both save real time and credits.

**Resolution.** Pull at a large size and look at what comes back — the Drive
thumbnail endpoint returns the native size if it's smaller than requested:

```bash
curl -sL "https://drive.google.com/thumbnail?id=FILE_ID&sz=w2400" -o photo.jpg
```

| Native size | What it needs |
|---|---|
| ≥ 2000px long edge | **No upscale.** Already above what the hero and carousel need. |
| 1200–2000px | Optional. Only worth it for a cover. |
| < 1000px | Upscale — usually a slide extract from a deck. |

Five of six Purina images were already 2048px and needed nothing. Upscaling them
would have added grain for no gain. Nescafé's were 1280px and did benefit.

**Exposure.** Look at the image before choosing grade settings. Professionally
shot material (Purina) is already well exposed and a heavy grade will crush it.
Flat, hazy phone or drone footage (Nescafé, 7-Eleven) takes a much stronger lift.
There is no single recipe — see section 6.

---

## 5. Covers

The hero is `min(78vh, 720px)` at full width with `object-fit: cover`, so it's
roughly **2:1 to 2.7:1** — wider than 16:9. The browser centre-crops top and
bottom, and a dark gradient covers the lower third where the title sits.

**Landscape covers** — export around 16:9. The browser handles the rest.

**Portrait covers need a baked-in crop.** A 3:4 or 9:16 image dropped straight in
will be centre-cropped by the browser into that wide band, which slices through
whatever matters. Instead: upscale, then crop the band yourself, positioned on the
subject. The Purina cover was a 640×960 portrait of a cat — upscaled 4× to
2560×3840, then cropped to 16:9 at 20% down so the cat's face anchors the frame.

**Watermarks and logo bugs — crop, don't inpaint.** The 7-Eleven drone cover had a
7-CAFé watermark in the top-left. Cropping the top 360px removed it completely,
lost only sky and canopy, and tightened the composition so the crowd read denser.
Generative removal would have had to reconstruct a roofline running under the
logo. Cropping is lossless and can't go wrong.

---

## 6. Processing

All of this is deterministic PIL — nothing invented, nothing to audit.

```python
from PIL import Image, ImageOps, ImageEnhance, ImageFilter, ImageDraw

def grade(im, cutoff, sat, con, us_r, us_p):
    g = ImageOps.autocontrast(im, cutoff=cutoff)   # per-channel = white balance + contrast
    g = ImageEnhance.Color(g).enhance(sat)
    g = ImageEnhance.Contrast(g).enhance(con)
    return g.filter(ImageFilter.UnsharpMask(radius=us_r, percent=us_p, threshold=3))
```

Pick settings by source, not by habit:

| Source | cutoff | sat | con | unsharp |
|---|---|---|---|---|
| Flat / hazy (phone, drone still) | 0.4–0.5 | 1.16–1.18 | 1.07 | 1.3 / 65 |
| Mid | 0.3 | 1.12 | 1.05 | 1.1 / 50 |
| Professionally shot, well exposed | 0.2 | 1.08 | 1.03 | 1.1 / 45 |

**Vignette** — light on gallery images (0.88 brightness), stronger on covers (0.80).

**Depth of field** — covers only. Skip it on gallery images; at ~585px wide in the
carousel it reads as mush. When you do use it, make the sharp zone **wide enough to
span the whole brand row** — a tight ellipse centred on the subject will blur the
logos either side, which defeats the point.

### Export

| | Size | Quality |
|---|---|---|
| Cover | 1920px wide | 82 |
| Gallery | 1400px long edge | 82 |

Naming: `<slug>-cover.webp`, `<slug>-01.webp` …

---

## 7. Straightening

Only worth it on covers, and only when you can **measure** it. Find a feature that
is genuinely straight in the real world, sample it across the frame, and fit a line:

```python
# sample the strongest edge of a long horizontal feature at many x positions,
# least-squares fit, reject outliers, repeat
# accept the result only if mean residual < ~2px
```

The Nescafé cover measured **+1.28°** off a 28-point fit of the van's orange band
(1.4px mean residual), and **+0.08°** after correcting — i.e. level.

Three things that will bite you:

- **PIL's positive angle is counter-clockwise.** A feature sloping down-to-the-right
  needs `rotate(+angle)`, not `-angle`. Getting this backwards made the Nescafé
  cover *worse* (+1.28° → +2.61°) and it was only caught by re-measuring.
- **Always re-measure after rotating.** Don't trust the operation.
- **If you can't get a clean fit, don't rotate.** Curved features (the 7-Eleven van
  roof) and handheld portraits with no architectural reference give garbage fits.
  Two attempts on the Nescafé gallery both failed, so those were left alone —
  correctly. An unmeasured rotation is worse than a small tilt.

After rotating, inset-crop ~40px to remove the empty corners.

---

## 8. Magnific

Connected as an MCP server. Load tools via ToolSearch.

**Use `images_upscale` with `mode: 'ultra-photo'`** — zero creativity, most
faithful, preserves composition exactly. Use `precisionPreset: 'portraits'` for
people shots. For genuinely small sources needing 4×, `ultra-sublime` is tuned for
it. Roughly 90 credits at 2×, 270 at 4×.

**Do not use generative tools on client documentation.** Tested and rejected:

- **Nano Banana / `images_generate`** — re-rendered faces into different people,
  turned "Snap & Redeem" into "Snop it Roou" in large legible type, and garbled a
  safety sign. Photographically impressive, unusable.
- **`images_change_camera`** — worse. Deleted one of three people, moved another
  outside the van, removed both bottle standees, mangled the "Start the Yay!"
  lockup, and returned *lower* resolution than the input. It has no prompt
  parameter, so there's no way to instruct it to preserve anything.

The rule: these pages document real work for real clients, with real identifiable
people and client brand marks in frame. Enhancement that preserves what happened —
colour, exposure, sharpening, upscaling, straightening, cropping — is fine.
Anything that invents content is not. That includes adding people to make a crowd
look bigger: the case study's claim is about turnout, and the photo is the evidence
for it.

If a shot looks thin, crop tighter or pick a genuinely busier frame.

**Billing note:** the account's unlimited plan does **not** apply over MCP
(`unlimitedAppliesHere: false`). Everything through this connection bills credits.
Check `simulate_cost` before large batches.

---

## 9. Verifying a deploy

Vercel preview URLs sit behind auth, and **an expired share cookie returns a ~484KB
login page with HTTP 200**. A status-code or file-size check will pass on it. This
produced two false "it's live" reports before it was caught.

Verify content, not status:

```bash
# fresh share link via the Vercel MCP: get_access_to_vercel_url
curl -sL -c /tmp/vc -o /dev/null "$URL?_vercel_share=TOKEN"
curl -sL -b /tmp/vc -o /tmp/page.html "$URL"
grep -o '<title>[^<]*' /tmp/page.html          # real page, not "Login – Vercel"
```

For images, compare MD5 against the local build:

```bash
curl -sL -b /tmp/vc -o /tmp/img.webp "$BASE/assets/cases/slug-cover.webp"
python3 -c "
import hashlib
a=hashlib.md5(open('/tmp/img.webp','rb').read()).hexdigest()
b=hashlib.md5(open('public/assets/cases/slug-cover.webp','rb').read()).hexdigest()
print('matches:', a==b)"
```

---

## 10. Checklist

1. Read the write-up doc from the Drive folder
2. **Check filenames** for a `Cover` file before selecting by eye
3. **Check source resolution** — skip the upscale if it's already ≥2000px
4. Pick the gallery photos: branding / activation / happy people
5. Upscale only what needs it (section 8)
6. Grade to suit the source (section 6); straighten only if measurable (section 7)
7. Export WebP into `public/assets/cases/`
8. Add or update the content block
9. Check locally at `/case-study/<n>` — hero, 3 metrics, carousel, copy, prev/next
10. Confirm the card appears in the homepage work section
11. Push to a `uat/<name>` branch, verify by content and MD5 (section 9)
12. Merge to `main` to go live, and verify production the same way

Never push straight to `main` — `main` is the production site. UAT branches get
their own Vercel preview URL for sign-off first.
