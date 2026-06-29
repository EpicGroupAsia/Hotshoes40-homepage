# Hotshoes Asia Homepage — Deployment Handoff

> Last updated: 2026-06-29  
> Prepared for: transfer from personal GitHub (`Andyoba`) to EPIC GitHub organisation, and production deployment on either Vercel or the EPIC Hostinger VPS.

---

## 1. Current Repository

| Item | Value |
|---|---|
| Current remote | `https://github.com/Andyoba/Hotshoes40-homepage.git` |
| Default branch | `main` |
| Current staging URL | `https://hotshoes-homepage.vercel.app` |
| Vercel project | `hotshoes-homepage` under team `epicexperience` |
| Vercel account | `andyoba-2209` |

---

## 2. Recommended EPIC GitHub Repo Name

```
hotshoes-asia-homepage
```

Rationale: lowercase-kebab-case, no numbers, organisation-scoped so it reads clearly as `epic-org/hotshoes-asia-homepage`.  
Alternative if the team prefers matching the current name: `hotshoes40-homepage` (already consistent).

---

## 3. Transferring the Repository to EPIC

### Option A — GitHub Transfer (Recommended)
Keeps full commit history, all tags, the existing Vercel git integration, open issues, and the URL automatically redirects from the old personal repo.

**Steps (done in GitHub, not the terminal):**
1. Go to `https://github.com/Andyoba/Hotshoes40-homepage/settings`
2. Scroll to **Danger Zone → Transfer repository**
3. Enter the new owner: the EPIC GitHub organisation name
4. Confirm with the repo name
5. Accept the invitation on the EPIC org side
6. After transfer, the Vercel integration will ask to re-authorise — approve it in the Vercel dashboard

**After transfer, re-link Vercel:**
- Vercel Dashboard → Project Settings → Git → Disconnect → Connect again using the new org repo

### Option B — Fresh repo (if the org wants a clean slate)
1. Create a new repo in the EPIC org on GitHub (no auto-init)
2. Locally:
   ```bash
   git remote set-url origin https://github.com/EPIC-ORG/hotshoes-asia-homepage.git
   git push -u origin main
   ```
3. Create a new Vercel project linked to the new repo (see Section 5)
4. Re-set the `NEXT_PUBLIC_SITE_URL` environment variable in the new Vercel project

---

## 4. Environment Variables

### Required
| Variable | Where to set | Value |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Vercel → Project → Settings → Environment Variables | `https://uat.hotshoes.com.my` (or production domain) |

### Not required (auto-managed)
| Variable | Notes |
|---|---|
| `VERCEL_OIDC_TOKEN` | Generated automatically by Vercel CLI for local dev. Do not copy or set manually. Lives only in `.env.local` which is gitignored. |

### Future (not yet implemented)
| Variable | Notes |
|---|---|
| `RESEND_API_KEY` | Needed once the Contact form is wired to deliver real emails. See `.env.example`. |

---

## 5. Vercel Deployment Steps (new project)

> Skip this section if doing an Option A transfer — Vercel automatically reconnects.

1. Go to `https://vercel.com/new` and sign in as `andyoba-2209` (team `epicexperience`)
2. Import the EPIC org repo `hotshoes-asia-homepage`
3. Framework preset will auto-detect as **Next.js**
4. Build settings (leave defaults — they match `package.json`):
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`
5. Add environment variable before deploying:
   - `NEXT_PUBLIC_SITE_URL` = `https://uat.hotshoes.com.my`
6. Click **Deploy**
7. After deploy succeeds, go to **Project Settings → Domains** and add `uat.hotshoes.com.my`
8. Vercel will give you a CNAME value to add in DNS

---

## 6. DNS Cutover Checklist

> Jerry has confirmed `uat.hotshoes.com.my` already points to `72.62.244.83` (Hostinger VPS).  
> For Vercel hosting, the DNS record needs to point to Vercel instead.

### If hosting on Vercel
- [ ] In your DNS provider (likely registrar for `hotshoes.com.my`), update `uat` CNAME/A record:
  - **Type:** CNAME
  - **Name:** `uat`
  - **Value:** `cname.vercel-dns.com` *(Vercel will confirm exact value in project Domains settings)*
- [ ] Wait for DNS propagation (typically 5–30 min, up to 24 h)
- [ ] Verify SSL is auto-provisioned by Vercel (shown as "Valid" in Domains settings)
- [ ] Update `NEXT_PUBLIC_SITE_URL` in Vercel env vars to match the live domain
- [ ] Trigger a new deploy so the sitemap/OG tags use the correct URL

### If hosting on Hostinger VPS (alternative)
- Keep the existing A record `uat → 72.62.244.83`
- Follow the VPS configuration steps separately (Nginx + Certbot + pm2 + git deploy)
- Set `NEXT_PUBLIC_SITE_URL=https://uat.hotshoes.com.my` in the server environment or a `.env.production.local` file (gitignored)

---

## 7. Rollback Plan

### Vercel (instant)
1. Go to Vercel Dashboard → Deployments
2. Find the last known-good deployment in the list
3. Click `···` → **Promote to Production**
4. Done — takes effect in seconds, no code changes needed

### Git-based rollback
```bash
# Find the commit to roll back to
git log --oneline

# Revert to a specific commit (creates a new revert commit, safe for shared branch)
git revert <bad-commit-sha>
git push origin main

# Vercel auto-deploys the revert commit
```

---

## 8. Known Lint Warnings (non-blocking)

`npm run build` passes cleanly. `npm run lint` reports 15 findings that do **not** block the build:

| Count | Rule | Reason safe to ignore |
|---|---|---|
| 3 errors | `react-hooks/set-state-in-effect` | False positive. The pattern `useEffect(() => { setMounted(true) }, [])` is the standard SSR hydration guard for `ReactDOM.createPortal` and must remain as-is. |
| 12 warnings | `@next/next/no-img-element` | Plain `<img>` tags are used intentionally. Images are already served as WebP. Migrating to `next/image` would require adding explicit `width`/`height` on every image, which conflicts with the responsive fluid sizing used across the design. |

---

## 9. Pre-Launch QA Checklist

### Functionality
- [ ] Homepage loads and all sections visible (Hero → Contact)
- [ ] Mobile hamburger menu opens and closes correctly
- [ ] Mobile hamburger menu does not bleed through other sections
- [ ] "Selected Cases" carousel auto-advances and is clickable
- [ ] Each case study page (`/case-study/01` through `04`) loads with correct content
- [ ] Prev / Next navigation in case study works (and keyboard ← →)
- [ ] All nav anchor links (`#work`, `#contact`, etc.) scroll to correct sections
- [ ] Contact form submits (or shows placeholder until email delivery is wired)
- [ ] "Start a Project" CTA links reach the Contact section

### SEO & Meta
- [ ] Favicon appears in browser tab (red circle, serif "hs")
- [ ] Page title is site-specific (not boilerplate)
- [ ] Share a case study URL on WhatsApp/LinkedIn — OG image and title preview correctly
- [ ] `https://[domain]/robots.txt` returns 200 with correct sitemap URL
- [ ] `https://[domain]/sitemap.xml` returns 200 and lists all 5 pages with the correct domain

### Performance
- [ ] Run Lighthouse on the live URL (target: Performance ≥ 85, SEO = 100)
- [ ] Google Search Console → URL Inspection on the live domain once indexed

### DNS / SSL
- [ ] `https://uat.hotshoes.com.my` loads over HTTPS without certificate warning
- [ ] HTTP redirects to HTTPS (Vercel handles this automatically)
- [ ] No mixed-content warnings in browser console

---

## 10. What Needs to Be Done Manually

The following **cannot** be done from the terminal — they require browser access to the respective dashboards:

### GitHub
- [ ] **Invite Jerry (CTO)** as a collaborator or admin on the EPIC org repo
  - EPIC org → repo → Settings → Collaborators → Add people
- [ ] **Transfer or fork** the repo from `Andyoba/Hotshoes40-homepage` to the EPIC org (Option A or B above)

### Vercel
- [ ] **Re-authorise the git integration** after the repo transfer (Vercel will prompt automatically)
- [ ] **Add the custom domain** `uat.hotshoes.com.my` in Project Settings → Domains
- [ ] **Set `NEXT_PUBLIC_SITE_URL`** environment variable to `https://uat.hotshoes.com.my`
- [ ] **Add Jerry** to the Vercel team (`epicexperience`) so he can trigger deploys and view logs
  - Vercel → Team Settings → Members → Invite

### DNS
- [ ] Update the `uat` DNS record to point to Vercel (if not self-hosting)
- [ ] Confirm SSL certificate is auto-provisioned and shows "Valid" in Vercel Domains

### Contact Form (future)
- [ ] Choose an email delivery provider (Resend recommended)
- [ ] Add `RESEND_API_KEY` to Vercel environment variables
- [ ] Implement the API route `/app/api/contact/route.js` to process form submissions

---

## 11. Tech Stack Reference (for Jerry / EPIC dev team)

| Layer | Technology | Version |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.9 |
| UI | React | 19.2.4 |
| Language | JavaScript (no TypeScript) | — |
| Styling | Plain CSS (CSS custom properties) | — |
| Fonts | Google Fonts (Archivo, Hanken Grotesk, JetBrains Mono) | CDN |
| Images | WebP (converted from PNG source files) | — |
| Deployment | Vercel | — |
| Node.js (minimum) | 18+ (required by Next.js 16) | — |

Local development:
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run start    # serve production build locally
npm run lint     # ESLint (see known warnings above)
```
