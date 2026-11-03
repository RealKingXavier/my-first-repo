# Launch checklist — bahiadreamscr.com

Status as of Nov 3, 2026. The site is live at **https://bahiadreamscr.netlify.app** (Netlify project `bahiadreamscr`). All four domains are attached to the project and are waiting for DNS.

## 1. DNS at Namecheap — required, owner action

DNS records alone don't redirect anything. Redirects are handled by Netlify (`netlify.toml`) once traffic reaches it. **Don't change nameservers** and **don't touch the MX/TXT records**: both domains have email records that must stay.

### bahiadreamscr.com (Namecheap → Domain List → Manage → Advanced DNS)

| Action | Type | Host | Value |
|---|---|---|---|
| Delete | A / URL Redirect / CNAME parking records for `@` and `www` | | |
| Add | A Record | `@` | `75.2.60.5` |
| Add | CNAME | `www` | `bahiadreamscr.netlify.app.` |

### bahiadreamscostarica.com (DNS is on Namecheap hosting → cPanel → Zone Editor)

| Action | Type | Name | Value |
|---|---|---|---|
| Edit | A | `bahiadreamscostarica.com` | `75.2.60.5` (replaces `68.65.120.175`) |
| Edit | CNAME | `www` | `bahiadreamscr.netlify.app.` |
| Keep | MX, TXT (SPF) | | unchanged |

Then, in Netlify → *Domain management*, wait for the HTTPS certificate (Let's Encrypt, automatic, usually under an hour after DNS propagates). Turn on **Force HTTPS** if it's off.

### Verify the redirects (only claim it's live after these pass)

```bash
curl -sI https://bahiadreamscr.com | head -1                     # 200
curl -sI "https://www.bahiadreamscr.com/stays?x=1" | grep -i location          # https://bahiadreamscr.com/stays?x=1
curl -sI "https://bahiadreamscostarica.com/about" | grep -i location           # https://bahiadreamscr.com/about
curl -sI "http://www.bahiadreamscostarica.com/contact?topic=owner" | grep -i location
```

Each redirect should be a `301` and keep the path and query string.

## 2. Email notifications — owner action

Submissions are already **saved** (Netlify Blobs) and **relayed** to Netlify Forms. Netlify only emails them once a notification exists:

- Netlify → Project `bahiadreamscr` → **Forms → Form notifications → Add notification → Email notification**, for both `owner-lead` and `contact`.
- Netlify only allows the email address of a **team member**. To deliver to `bahiadreamscostarica@gmail.com`, either invite that address to the Netlify team, or use your own team email and forward it in Gmail.
- Alternative: create a Resend account, verify `bahiadreamscr.com`, and set `RESEND_API_KEY`, `NOTIFY_FROM` and `NOTIFY_TO`. Resend is tried first.
- After setting this up, send one test inquiry and confirm the email arrives.

## 3. Admin access

- URL: `https://bahiadreamscr.com/admin` (for now, `https://bahiadreamscr.netlify.app/admin`). Username: `admin`.
- Password: run `netlify env:get ADMIN_PASSWORD` in this folder, or see Netlify → *Environment variables*. Change it whenever you want.
- `/admin/health` reports whether storage and email are configured.
- **QA test entries** named "QA Tester" (qa@example.com) are in the admin and in Netlify Forms. Delete them when you're ready.

## 4. Content to verify before announcing

- [ ] **Property specs and amenities.** These were taken from the live Airbnb listings on Nov 3, 2026: Carara 3 bd / 2.5 ba / 6 guests, Enchanting 3 bd / 2 ba / 6 guests, Lovely 2 bd / 2 ba / 4 guests. Confirm with each owner.
- [ ] **Locations.** Carara: "Mar a Mar, Herradura · Puntarenas". Enchanting and Lovely: "Herradura · near Los Sueños Marina". The listing copy names Condominio La Estancia; the site doesn't. Confirm the wording owners are happy to publish.
- [ ] **Nearby distances.** "5 min Punta Leona, 15 min Jacó / Los Sueños" and "beach 5-minute drive" are quoted from the listings.
- [ ] **Photo rights.** The galleries use photos from our own Airbnb listings. Confirm Bahia Dreams owns them or has the owners' permission for website use.
- [ ] **Booking.com / Vrbo URLs.** None have been supplied, so those buttons are hidden. Add real URLs in `src/content/properties.ts`.
- [ ] **Casa Kathia.** Coming soon, `noindex`, not in the sitemap. When it's ready, add photos, facts and a link, and set `status: "active"`.
- [ ] **Contact details.** Confirm `+506 6048 1990`, the WhatsApp link `wa.me/50660481990` and `bahiadreamscostarica@gmail.com` are the ones to publish. They're consistent across the brochures. Instagram is confirmed as `@bahiadreamscr`.
- [ ] **Response-time promise.** None is shown. If you approve one, set `site.contact.responseExpectation`.
- [ ] **Logo on light backgrounds.** It uses the supplied colour logo with the wordmark recoloured to brand navy (`public/brand/logo-color-navy.svg`). Proportions are unchanged. Approve it, or supply an official version.
- [ ] **Fees.** They're kept off the public site by design. The private guide is at `/admin/guide`.

## 5. Legal

- [ ] Have **Privacy** and **Terms** reviewed. They are drafts, marked as such on the page, and written with Costa Rica's Law 8968 in mind.
- [ ] Confirm the legal entity name for the footer and policies (currently "Bahia Dreams Costa Rica").

## 6. Optional

- [ ] Analytics: create a Plausible site for `bahiadreamscr.com` and set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. It's cookieless, so no consent banner is needed. Booking clicks, WhatsApp clicks, owner CTAs and form starts/completions are already instrumented.
- [ ] Google Search Console: verify the domain and submit `https://bahiadreamscr.com/sitemap.xml`.
- [ ] Spanish version (`/es`): see the README.
- [ ] Commit this folder to git (it isn't committed yet).

## What was tested

- Every route returns 200 (404 page returns 404) at 1440 px and 390 px, with no console errors, no broken images and no horizontal overflow. Locally and in production.
- Unique titles, descriptions and canonicals on every page. Casa Kathia is `noindex`. Sitemap and robots work.
- Owner form: per-step validation and focus management, back/next keeps values, URL validation, photo upload with required consent, and successful submission in production (saved, photo stored privately, relayed to Netlify Forms).
- Contact form: validation, topic and property prefill from links, and successful submission in production.
- API: honeypot submissions are silently dropped, the time trap works, the server rejects invalid payloads, and cross-origin posts get 403.
- Admin: 401 without the right password, dashboard lists leads and messages with photos, CSV export, and the guide PDF is only reachable through the admin.
- Keyboard: the mobile menu opens, traps focus, closes with Esc and returns focus. The gallery works with ←/→ (wraps around), closes with Esc and restores focus.
- Booking buttons: only Airbnb renders, `target=_blank rel="noopener noreferrer"`, all three links resolve to the right listings.
- Security headers (CSP, HSTS, frame-ancestors, nosniff, referrer and permissions policy). Images are served as WebP/AVIF through Netlify's image CDN.

**Not yet tested:** custom-domain redirects and HTTPS (waiting on DNS), notification email delivery (waiting on step 2), Lighthouse scores, and real-device testing on iOS Safari and Android.
