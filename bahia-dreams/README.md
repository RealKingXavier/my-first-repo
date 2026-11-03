# Bahia Dreams Costa Rica — website

Production site for **https://bahiadreamscr.com**: boutique vacation rentals in Herradura and property management for owners.

Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Zod · Netlify (Next.js runtime, Blobs, Forms, Image CDN).

## Run it

```bash
npm install
npm run dev        # http://localhost:3030
npm run build      # production build
npm run lint       # type-check
```

Locally, form submissions are saved to `./.data/` (demo mode). In production they go to Netlify Blobs.

## Where things live

```
src/
  config/site.ts            contact details, socials, feature switches  ← edit before launch
  content/properties.ts     every property: facts, photos, booking links ← single source of truth
  app/                      routes (one folder per page)
    page.tsx                home
    stays/page.tsx          collection
    stays/[slug]/page.tsx   property template (active + coming-soon)
    property-management/    owner services
    list-your-property/     4-step owner inquiry form
    about/ contact/ privacy/ terms/ not-found.tsx
    api/leads, api/contact  form endpoints (validation, spam checks, storage, email)
    admin/                  password-protected inquiries dashboard, CSV export, photo + guide download
    sitemap.ts robots.ts manifest.ts icon.png apple-icon.png
  components/               header, footer, cards, gallery/lightbox, booking panel, forms
  lib/                      validation (shared client/server), storage, email, rate limiting, SEO
  proxy.ts                  basic-auth gate for /admin
public/
  brand/                    supplied logo files (unaltered) + macaw emblem
  images/stays/<slug>/      property photos (from our own Airbnb listings)
  images/maps/              generalised area maps (rendered from OpenStreetMap)
  __forms.html              hidden form definitions for Netlify Forms email relay
private/service-guide.pdf   owner Service & Pricing guide — only served via /admin/guide (not in git; keep a local copy)
```

## Editing content

**A property's details** — open `src/content/properties.ts` and edit its entry. Every field is optional except name, slug, status and descriptions; anything left out is hidden on the page rather than shown empty.

**Booking.com / Vrbo links** — add them to `bookingLinks`, e.g. `bookingLinks: { airbnb: "…", vrbo: "https://www.vrbo.com/1234567" }`. Buttons appear automatically, only for links that start with `https://`.

**Photos** — put JPEGs (about 1920 px wide) in `public/images/stays/<slug>/` named `01.jpg`, `02.jpg`… and update the list passed to `photos(...)` with alt text and a caption for each. The first photo is the page hero. `cardImage` overrides the image used on collection cards.

**Launching Casa Kathia** — set `status: "active"`, add photos, facts and its booking link. It will then appear in the sitemap and become indexable.

**Contact details, WhatsApp, Instagram** — `src/config/site.ts`. Set `whatsappEnabled: false` to hide every WhatsApp button.

**Fees** — owner commission terms are stored in `site.pricing` and are **not shown publicly** (`showOnPublicSite: false`). Share the guide privately from `/admin/guide` after a consultation.

## Forms: demo vs production

| | Local (`npm run dev`) | Production (Netlify) |
|---|---|---|
| Storage | `./.data/` on disk — **demo mode** | Netlify Blobs (private, per-site) |
| Email | not sent unless Resend vars are set | Netlify Forms relay or Resend |
| Admin | needs `ADMIN_PASSWORD` in `.env.local` | needs `ADMIN_PASSWORD` env var |

Each submission is validated in the browser and again on the server, checked against a honeypot field and a minimum fill time, and rate-limited per IP (stored only as a salted hash). Photos are resized in the browser, re-checked server-side by file signature (JPEG/PNG/WebP, ≤ 1.2 MB, ≤ 5), and stored privately — they're only reachable through the authenticated admin.

The success message is shown **only** after the server confirms the record was saved. If storage is unavailable the form shows the email/WhatsApp fallback instead.

**Admin:** `https://bahiadreamscr.com/admin` (HTTP basic auth, user `ADMIN_USER`, password `ADMIN_PASSWORD`). Lists owner leads (with photos) and contact messages, shows whether email went out, exports CSV, and downloads the private service guide.

**Email notifications:** with `NETLIFY_FORMS_RELAY=true`, the API relays each validated submission to the hidden `owner-lead` / `contact` Netlify Forms, and Netlify emails it to the addresses set in *Netlify → Project → Forms → Form notifications*. To use Resend instead, set `RESEND_API_KEY`, `NOTIFY_FROM` (a verified domain sender) and `NOTIFY_TO`; Resend is tried first.

## Analytics

Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` to enable Plausible (cookieless — no consent banner needed). Tracked events, with no personal data: `Booking Click` (platform, property), `WhatsApp Click`, `Owner CTA`, `Owner Form Start`, `Owner Form Complete`, `Contact Form Complete`. With the variable unset, nothing loads.

## Spanish (/es) later

All copy lives in page files and `content/properties.ts`. To add Spanish, move strings into per-locale dictionaries, add an `app/[lang]` segment, a language switch, and `alternates.languages` (hreflang) in `lib/seo.ts`. Don't add hreflang until real translated pages exist.

## Deploy

The site is a Netlify project (`bahiadreamscr`). From this folder:

```bash
./scripts/deploy.sh           # production
./scripts/deploy.sh --draft   # preview URL only
```

Don't run `netlify deploy` directly from inside the parent monorepo. The CLI treats the outer git repo as the project root and drops the server function's routes, so every page 404s. The script builds from a clean copy instead.

One Netlify quirk the code works around: on this runtime, reading a Blobs key that doesn't exist never resolves, so `src/lib/store.ts` checks a key exists before reading it, and every storage or email step runs under a timeout.

See `LAUNCH_CHECKLIST.md` for DNS, redirects and everything still to confirm.
