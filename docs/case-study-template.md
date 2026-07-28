# Case Study Template

How to add a case study to the Hotshoes website. Every case study on the site
follows this same structure — copy the block below, fill it in, drop the images
in, done. No component code needs to change.

---

## 1. Where things live

| What | Where |
|---|---|
| Case study content | `app/data/content.js` → the `cases` array |
| Images | `public/assets/cases/` |
| Page layout (shared by all cases) | `app/case-study/[caseId]/CaseStudyView.js` |
| Source material | Google Drive → *EPIC Case Study Library* → category folder |

Each case study folder in Drive contains a write-up doc (Challenge / Experience /
Impact) and an `Images` subfolder.

---

## 2. The content block

Add a new object to the end of the `cases` array in `app/data/content.js`:

```js
{
  n: '07',                                    // next number in sequence, zero-padded
  client: 'Client Name',
  title: 'Campaign Name',
  category: 'Brand Activation',               // must match a value in caseCategories
  photo: '/assets/cases/slug-cover.webp',     // cover image — see section 4

  challenge:  '...',                          // straight from the Drive write-up
  experience: '...',
  impact:     '...',

  metrics: [                                  // exactly 3
    { value: '25K', label: 'Total Engagements',     icon: 'globe' },
    { value: '25',  label: 'Days of Activation',    icon: 'calendar' },
    { value: '3',   label: 'Venue Types Nationwide', icon: 'screen' },
  ],

  photos: [                                   // 5 gallery images — see section 4
    '/assets/cases/slug-01.webp',
    '/assets/cases/slug-02.webp',
    '/assets/cases/slug-03.webp',
    '/assets/cases/slug-04.webp',
    '/assets/cases/slug-05.webp',
  ],

  // Optional — only if there's a campaign video
  youtubeId: 'abc123',
  heroVideo: true,                            // true = video plays as the hero background
},
```

### Field notes

- **`n`** drives the URL (`/case-study/07`) and the prev/next navigation, which
  wraps around automatically. Just take the next number.
- **`category`** must be one of the values in the `caseCategories` array, or the
  work filter on the homepage won't pick it up.
- **`metrics`** — always three. Valid `icon` values are `globe`, `calendar`,
  `screen`. Keep `value` short (`25K`, `12+`, `4.37M`); the label carries the detail.
- **`youtubeId` + `heroVideo`** are optional. With `heroVideo: true` the video
  becomes the hero background; with only `youtubeId` it renders as a standard
  embed below the metrics. Omit both for a photo hero.
- Nothing else is needed — the gallery carousel, metrics row, copy sections and
  prev/next links all render off this one object.

---

## 3. Choosing photos

Pull from the case study's `Images` folder in Drive. What works:

- **Clear branding** — logos, brand walls, product standees visible
- **The activation itself** — the build, the space, the scale
- **Happy people holding the product** — this is the one that sells the work

What to avoid: empty booths with no people, crowds shot from behind, photos where
faces are cut off or out of focus, and near-duplicates of a shot you already picked.

Aim for a spread across those three categories rather than five variations of the
same moment. Five images is the house standard.

**Cover image** (`photo`) is used twice — as the card on the homepage work grid
and as the hero background on the case study page. Pick a landscape shot with
strong branding and people in it. It does not have to be one of the five gallery
photos.

---

## 4. Preparing images

Save everything as WebP into `public/assets/cases/` using the naming convention
`<slug>-cover.webp` and `<slug>-01.webp` … `<slug>-05.webp`.

```bash
python3 -c "
from PIL import Image
im = Image.open('source.jpg').convert('RGB')
im.save('public/assets/cases/slug-01.webp', 'WEBP', quality=82)
"
```

- **Quality 82** for gallery photos, **84** for the cover
- Target **~1200px on the long edge** — keeps files between 50–150KB
- Do **not** pre-crop to a fixed shape. The carousel handles framing (section 5),
  so keeping the original aspect ratio gives it the most to work with.

To pull an image straight from Drive at a usable size:

```bash
curl -sL "https://drive.google.com/thumbnail?id=FILE_ID&sz=w1600" -o photo.jpg
```

---

## 5. How the gallery renders

Handled entirely by `PhotoCarousel` in `CaseStudyView.js` — worth knowing so you
can predict the framing:

- Slides share one row height and scroll horizontally, with prev/next arrows.
- Each slide's aspect ratio is **clamped between 4:3 and 3:4**. Landscape wider
  than 4:3 crops to 4:3; portrait taller than 3:4 crops to 3:4; anything in
  between keeps its natural shape. This keeps the row consistent while letting
  portraits stay portrait.
- Portrait crops are biased toward the top (`center 30%`) so faces stay in frame.

The upshot: a 16:9 or 9:16 phone photo will lose some edge, so avoid images where
the subject sits right at the top or bottom edge.

---

## 6. Checklist

1. Read the write-up doc from the case study's Drive folder
2. Pick 5 gallery photos + 1 cover from its `Images` folder
3. Convert to WebP into `public/assets/cases/`
4. Add the content block to the `cases` array
5. Check it locally at `/case-study/<n>` — hero, 3 metrics, carousel, copy, prev/next
6. Confirm the new card appears in the homepage work section
7. Push to a `uat/<name>` branch for review, then merge to `main` to go live

Never push straight to `main` — `main` is the production site. UAT branches get
their own Vercel preview URL for sign-off first.
