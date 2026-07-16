# Balimmo Landing Page — UX / UI / Performance Audit

**Scope:** the landing page at `https://kmkt1p6d-5173.asse.devtunnels.ms` and its repository (`gedeyoga/balimmo-landing`, commit `6dd75d7`).
**Method:** code review of every component, a live browser audit at desktop (1280px) and mobile (375px) viewports, Lighthouse (mobile emulation, Fast 4G, 4× CPU throttle) against a production build, and a Chrome performance trace.

**Assumptions (documented per the brief):**

- The tunnel URL serves this exact repo via `vite dev`; auditing a local production build of the same commit is therefore representative (and strictly *favourable* to the current page, since the dev server ships unminified code).
- The repo is a static clone of a Laravel/Livewire original, so "search does nothing", "form posts nowhere" and the placeholder listing thumbnails are partly clone artifacts of the missing data integration (the production balimmo.fr site has real photography). I still audit them: **the page as shipped is the page users get**, and each of those findings is framed as what the integration must deliver. The fixes I implemented are written so they can be wired to the real backend.
- No analytics were provided, so scores are reasoned estimates from heuristics, not measured conversion.

---

## 1. Baseline score: **41 / 100**

| Dimension (weight) | Score | Why |
|---|---|---|
| Conversion readiness (30) | 8 | Every listing shows the same grey placeholder photo; search and property cards dead-end; the lead form gives zero feedback; no WhatsApp channel for a market that runs on WhatsApp. |
| UX & functionality (20) | 10 | Solid responsive layout and a genuinely nice filter-chip search UI — but the mobile filter sheet is broken (see P0-2) and the primary journeys go nowhere. |
| Performance (20) | 8 | ~11 MB of eager media on first load (8.2 MB autoplay video + ~2.8 MB of oversized PNGs), fully client-rendered. Offset by: tiny CSS/JS, CLS = 0. |
| Accessibility (10) | 6 | Every gold CTA is ~2:1 white-on-gold (WCAG AA needs 4.5:1); auto-playing video with no pause control (WCAG 2.2.2); form labels not programmatically associated. |
| Trust & content (10) | 4 | "Where to Invest in **2025**" (it is 2026); identical photo reused across sections; unsubstantiated ROI claims; an empty `agents-thumb.png` (0 bytes) hints at a removed team/agents section. |
| SEO & discoverability (10) | 5 | Title/description exist, but no Open Graph/Twitter meta (broken social shares), no robots.txt, no structured data, and an empty-HTML SPA shell. |

A real-estate landing page has one job — turn interest into a lead (search, enquiry, or WhatsApp chat). Today every route to that outcome is impaired, hence a failing score despite the page *looking* professionally designed at first glance.

---

## 2. Ranked problems, impact, and proposed fixes

### P0 — Critical

**1. All six "exclusive listings" ship the same grey placeholder image.**
`best-selling-thumb{,2,3}.png` are byte-identical (same MD5) 862×543 placeholders, each used twice. To be fair about the cause: this is almost certainly an artifact of the static clone — `properties.js` documents that the mock data stands in for the DB-driven `$data_property`, and the production site (balimmo.fr) demonstrably has real, optimized photography. So the finding is not "Balimmo has no photos"; it is what this page needs before it can face real traffic:
- **The listing-image integration is the top open dependency.** As long as cards render identical grey boxes, the money section converts at zero — photos are the #1 decision input for property buyers, and a grid of grey boxes reads as "site is broken" or "listings are fake."
- **When the integration lands, images must go through an optimization pipeline** (~800w AVIF/WebP + `srcset`, <100 KB each), not raw CMS uploads — the static assets elsewhere in this repo (477–746 KB PNGs) suggest no such pipeline exists yet.
- **Design the empty state:** a listing without a photo should get a branded fallback, never this raw placeholder.

**2. The mobile filter sheet renders *underneath* the sticky navbar — users get trapped. _(implemented — see §3.1)_**
The sheet lives inside the hero's `relative z-10` wrapper, which creates a stacking context; its `z-[60]` therefore loses to the `z-50` navbar. Verified in-browser: the "Filters" header and close button sit behind the navbar, and `document.elementFromPoint` at the close button's coordinates returns the **hamburger menu icon**. On a 375px phone the sheet is full-width, so there is no "outside" to tap either — the only escape is the "Find my villa" button itself.
*User impact:* the primary mobile search flow is a trap; tapping "X" opens the nav menu instead.
*Business impact:* mobile is typically 60–70% of property-portal traffic; this bug sits at the top of the funnel.

**3. An 8.2 MB autoplay video loads on the critical path for every visitor. _(implemented — see §3.2)_**
No `preload` strategy, no reduced-motion or Data-Saver handling, no pause control, loaded eagerly on mobile data.
*User impact:* seconds of bandwidth contention on 4G, real money on metered data, motion for users who opted out of it.
*Business impact:* page-weight and LCP correlate directly with bounce; at ~11 MB, the initial payload is roughly 10× a generous mobile page-weight budget.

**4. Primary CTAs dead-end.**
"Find my villa" submits to a `preventDefault()` no-op; property cards link to `#slug` anchors that do not exist; footer "Login" and legal links are `href="#"`.
*User impact:* the two strongest intent signals (search, card click) lead nowhere.
*Business impact:* even a perfect page cannot convert if the funnel has no next step.
*Fix:* wire search to a results route (the filter state is already centralized in `SearchContext`, so this is straightforward), give cards real detail URLs, remove or complete dead links. Needs the backend/routes, so proposed rather than implemented.

### P1 — High

**5. The lead form is a black hole. _(implemented — see §3.3)_**
No validation, no error or success state, labels not associated (`label` without `htmlFor`), no `name`/`autocomplete` attributes (breaking browser autofill), submit is a silent no-op.
*Impact:* form abandonment and lost leads; every misclick is unrecoverable silence.

**6. Systemic WCAG contrast failures on the money elements. _(implemented — see §3.3)_**
White text on the gold `#eba859` is ~2.0:1 (AA requires 4.5:1) — that's **every primary button**. Prices in gold-on-white are also ~2:1. Confirmed by Lighthouse (`color-contrast = 0`).
*Impact:* CTAs and prices are the two things a visitor must be able to read; low-vision users and anyone outdoors on a phone will struggle. It also carries compliance risk for a brand targeting EU/French investors, where the European Accessibility Act is raising the bar for digital services.

**7. No WhatsApp channel. _(implemented — see §3.3)_**
The Bali property market (and the Indonesian market generally) runs on WhatsApp; the phone number is buried in the footer as a `tel:` link.
*Impact:* the lowest-friction, highest-intent contact channel is missing from the conversion sections.

**8. Below-the-fold images are heavy, oversized, and eager.** *(partially implemented — loading strategy done; re-encoding proposed)*
`invest-*.png` are 477–746 KB each yet only 602px wide — then **upscaled** to 948px (blurry on desktop and retina). `how-it-works.png` 420 KB; the AREBI logo is 286 KB for a 64px render; the team photo is a **6720×4276** original. Nothing was lazy-loaded; no image had `width`/`height`.
*Fix applied:* `loading="lazy"`, `decoding="async"`, explicit dimensions everywhere below the fold. *Remaining:* re-export at 2× render size as AVIF/WebP with `srcset` (est. ~2.8 MB → ~300 KB) — flagged for an asset pipeline (e.g. `vite-imagetools`).

**9. Fully client-rendered with no social/SEO hardening.** *(partially implemented)*
The HTML shell is empty until 175 KB of JS executes; there were no OG/Twitter tags (shares render as a bare URL), no robots.txt, no structured data.
*Fix applied:* OG/Twitter meta, `theme-color`, robots.txt, poster preload. *Proposed:* prerender/SSG (or serve from the original Laravel origin), `RealEstateListing` JSON-LD per property.

**10. Zero analytics or event tracking.**
No way to know today's conversion rate, funnel drop-off, or whether any change works.
*Fix:* see §5 — this is the first thing to ship after these fixes.

### P2 — Medium

11. **Trust gap at the decision moment** — no testimonials, reviews, or agent faces (the 0-byte `agents-thumb.png` suggests a team section was dropped); the AREBI membership (a real trust asset) is buried in the footer. *Fix:* testimonial strip + AREBI badge near the listings/form.
12. **Currency defaults to IDR for an international audience** *(implemented: USD default)* — hero copy targets foreign investors and villa search prices in USD, yet cards opened in 10-digit IDR ("IDR 8,500,000,000" is unscannable for the target buyer).
13. **Dated content** *(implemented)* — "Where to Invest in **2025**" in July 2026 signals an unmaintained site; footer said "© 2021–2025".
14. **Same team photo used twice** (Why-choose and Contact sections) — reads as template filler.
15. **Money content is 3+ screens down on mobile** — three full-height region sections precede the listings. *Fix:* A/B a reorder (listings first) or add an in-hero "Browse villas" shortcut.
16. **Unsubstantiated ROI claims** (">11% net") with the disclaimer hidden in the footer. *Fix:* link a "How we calculate ROI" method page near the claims.
17. **Mobile search button says "Search" but opens a filter sheet** — an unannounced extra step; fine, but the sheet must then be flawless (see P0-2).
18. **Dialog a11y is partial** *(partially implemented: role/aria-modal/focus in-out)* — a full focus trap and `inert` background are the remaining gap.

### P3 — Low / polish

19. Footer uses `h2`/`h3` for widget titles (heading outline noise); "Listing" → "Listings"; "Mention Legales" misspelled *(fixed)*; French/English mix.
20. Favicon is the full wordmark PNG — illegible at 16px; no apple-touch-icon.
21. Card stats show an icon for bedrooms only — bathrooms/land size are bare numbers (visual imbalance).
22. `body { overflow-x: hidden }` can mask real layout overflow bugs.
23. Region `h3` merged name and ROI into one heading ("Uluwatu AreaROI >11% net" to screen readers) *(fixed: ROI moved to a paragraph)*.
24. The public URL serves `vite dev` (unminified, HMR, no caching). Ship `vite build` output behind a real host/CDN.

---

## 3. Implemented fixes (branch `audit-improvements`)

### 3.1 Mobile filter sheet trap — commit `57acdb4`
Portaled the sheet to `document.body` (escaping the hero's stacking context), added `role="dialog"` + `aria-modal`, focus moves to the close button on open and back to the trigger on close, overlay tap closes.
**Verified:** `elementFromPoint` at the close button now returns the button; sheet overlays the navbar; Escape, overlay tap and X all close it; focus returns to "Search".

### 3.2 Hero media & loading performance — commit `03845cd`
The poster image paints immediately (preloaded from `index.html`, `fetchpriority="high"`); the video element only mounts after `window.load`, and never for `prefers-reduced-motion` or Data-Saver/2G users; a pause/play control satisfies WCAG 2.2.2. All below-fold images: `loading="lazy"`, `decoding="async"`, explicit `width/height`. Dropped Nunito (loaded but never used) and trimmed Inter from 7 weights to the 4 in use.
**Measured** (cold loads of production builds, mobile + Fast 4G emulation — waterfall figure in `docs/fix2-network-waterfall.png`): the settled page needs ~180 KB, with the video starting only after the load event instead of competing from t≈1 s; 13 of the 16 images (~1.1 MB) now wait for scroll instead of downloading eagerly; and reduced-motion / Data-Saver / 2G users never fetch the 8.2 MB video at all. On capable connections the video still downloads in the background — deliberately. LCP-image load delay fell 635 ms → 230 ms in the trace; CLS stays 0.00.

### 3.3 Lead capture & contrast — commit `d1bd71d`
Rebuilt the form: associated labels, `name`/`autocomplete`, inline validation with `role="alert"` errors + `aria-invalid`, focus jumps to the first invalid field, and a confirmation state (with a WhatsApp fast-lane) replaces the silent void. Added a WhatsApp CTA in the contact section. Contrast: dark-teal text on gold buttons (~6.5:1), new `accent-strong` token for gold text on white (prices, region names), secondary microcopy bumped to 70% opacity. Plus the quick wins listed in §2 (OG meta, robots.txt, evergreen heading, USD default, dynamic year, typo).
**Verified:** empty submit shows three inline errors and focuses First name; valid submit shows the confirmation panel. Lighthouse (mobile): **Accessibility 96 → 100, SEO 92 → 100, Best Practices 100** on the production build.

---

## 4. Estimated "after" score: **65 / 100**

| Dimension | Before | After | Reasoning |
|---|---|---|---|
| Conversion readiness (30) | 8 | 14 | Working form with feedback, WhatsApp channel, USD prices. Still capped by placeholder photos (P0-1) and dead search/cards (P0-4). |
| UX & functionality (20) | 10 | 15 | The broken mobile search flow is fixed end-to-end; dead-end journeys remain. |
| Performance (20) | 8 | 14 | Heavy media off the critical path: page settles on ~180 KB, video deferred (and skipped for reduced-motion/Data-Saver), below-fold images on demand; fonts trimmed; zero CLS kept. Remaining: re-encode images, prerender, ship a built bundle. |
| Accessibility (10) | 6 | 9 | Lighthouse 100; pause control; labelled form. Remaining: full focus trap. |
| Trust & content (10) | 4 | 5 | Dated title fixed, honest reassurance copy. Photos/testimonials still needed. |
| SEO (10) | 5 | 8 | OG/Twitter, robots.txt, Lighthouse SEO 100. Remaining: SSG + JSON-LD. |

The remaining ~15–20 points are deliberately *not* frontend polish: the listing data/photo integration, a wired search/results flow, and testimonials. With those, this page plausibly reaches 80+.

---

## 5. Post-launch measurement plan

**Instrument first (GA4 or Plausible + custom events):**

| Event | Fires when | Answers |
|---|---|---|
| `search_submitted` (+ filter payload) | Find my villa/land | Which filters matter; demand by area/price |
| `filter_sheet_open` / `filter_sheet_apply` | mobile sheet | Did the sheet fix recover mobile search? (apply-rate was ~impossible before) |
| `listing_card_click` (+ property id) | card click | Card CTR; which listings pull |
| `whatsapp_click` (hero/contact/success) | WhatsApp CTA | Channel share of leads |
| `form_start` / `form_error` (+ field) / `form_submit` | contact form | Funnel completion, which field kills it |
| `currency_toggle`, `video_pause`, scroll-depth 25/50/75 | — | Audience currency preference; hero engagement |
| `web-vitals` (LCP/CLS/INP) → analytics | every load | Real-user performance, segmented by device/connection |

**KPIs (weekly, mobile vs desktop):**
- **Primary: lead rate** = (form submits + WhatsApp clicks) / sessions — target +30% within a month of the photo fix landing.
- Search engagement rate (sessions with `search_submitted`), mobile sheet open→apply rate (expect a step change from the trap fix).
- Bounce rate & p75 LCP on mobile (expect LCP improvement from the payload cut; watch CrUX once traffic exists).
- Form error rate per field (validation copy tuning).

**A/B test ideas (one at a time, lead rate as the metric):**
1. Listings section above the region sections (mobile-first reorder).
2. Static hero image vs deferred video (does the video earn its bytes at all?).
3. WhatsApp button in the sticky navbar vs contact section only.
4. USD vs IDR default (now instrumented by the toggle event).
5. Testimonials/AREBI badge adjacent to the form vs footer only.

---

## 6. If I had another day

1. Wire search to a results view (state is already in `SearchContext`) and make cards real links.
2. Image pipeline: `vite-imagetools` → AVIF/WebP + `srcset`; re-encode the video to ~1.5 MB/720p (or replace with a still on mobile).
3. Prerender the page (SSG) and add `RealEstateListing` JSON-LD.
4. Full focus trap + `inert` background for the sheet; wire the real listing images through that same pipeline the moment the data integration lands.
