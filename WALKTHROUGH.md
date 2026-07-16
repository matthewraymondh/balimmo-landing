# Written walkthrough — reasoning & assumptions

*This is the walkthrough deliverable (submitted in written form, as allowed by the brief's checklist). The full ranked audit, scoring rubric, and measurement plan are in [AUDIT.md](AUDIT.md) — this document explains how I reasoned my way through the exercise.*

---

## How I framed the problem

A real-estate landing page has exactly one job: turn a visitor into a lead — a search, a form submit, or a WhatsApp chat. So instead of auditing "is this page pretty," I audited it as a funnel: where does intent enter, and where does it leak out. Every problem I found is ranked by how directly it blocks that funnel, for the user and for the business.

On that lens the baseline score is **41/100** and my post-fix estimate is **65/100**. The remaining gap is deliberately not frontend polish — it's content and integration work (real listing data, a wired search flow) that no landing-page code can substitute for.

## Assumptions I made (and how I checked them)

1. **The audited artifact is a static clone.** The repo documents that its mock data stands in for the Laravel/Livewire original's dynamic listings, and the tunnel URL serves this exact repo via `vite dev`. I verified the production site (balimmo.fr) separately — it has real, optimized photography. So findings like "all listings show placeholders" are framed as *what the data integration must deliver*, not as accusations that the business lacks photos.
2. **No analytics were provided**, so both scores are reasoned estimates from heuristics — the audit says this explicitly, and the measurement plan in AUDIT.md §5 is how I'd replace estimates with data.
3. **Auditing a local production build is representative** — and strictly generous to the current page, since the public URL actually serves unminified dev-server output.

## The most critical finding — and why I deliberately didn't "fix" it

![The original page: six listings, one grey placeholder](docs/before-desktop-full.jpeg)

All six "exclusive listings" render the same grey 862×543 placeholder — I checked the files, and the three thumbnails are byte-for-byte identical (same MD5). A buyer scrolling past six identical grey boxes doesn't think "placeholder"; they think the site is broken, or the listings aren't real. Photos are the #1 decision input for property buyers, so this caps the money section's conversion at roughly zero.

I did *not* paper over it with stock images, because that would misrepresent listings. The honest fix is upstream: the listing-image integration is the top open dependency, those images must come through an optimization pipeline (resized, AVIF/WebP, `srcset` — the 477–746 KB PNGs elsewhere in the repo suggest no pipeline exists yet), and there must be a designed fallback so a raw grey box is never an empty state users see. Everything I *did* fix was chosen to still hold up once that integration lands.

## Fix 1 — the mobile search trap

| Before | After |
|---|---|
| ![Broken: sheet opens under the navbar, no header or close button](docs/before-mobile-filter-sheet.jpeg) | ![Fixed: sheet overlays the navbar with visible Filters header and close button](docs/after-mobile-filter-sheet.jpeg) |

On a phone, tapping **Search** opens the filter sheet — but its "Filters" header and close button render *behind* the sticky navbar (left screenshot: no header, undimmed navbar showing through). I verified with `document.elementFromPoint` that tapping where the X should be actually hits the hamburger menu. And since the sheet is full-width on a 375px phone, there's no "outside" to tap either: the user is trapped.

The root cause is a classic CSS stacking-context bug: the hero's `relative z-10` wrapper caps everything inside it, so the sheet's `z-[60]` loses to the navbar's `z-50`. The fix portals the sheet to `document.body`, escaping the stacking context entirely, and adds real dialog semantics: `role="dialog"` + `aria-modal`, focus moves to the close button on open and back to the trigger on close, and the overlay tap closes it (right screenshot). Mobile is typically the majority of property-portal traffic — this bug sat at the very top of that funnel.

## Fix 2 — the eight-megabyte hero

The original loads an 8.2 MB autoplay background video on the critical path for every visitor — mobile data included — plus ~2.8 MB of eager below-fold PNGs, with no reduced-motion handling and no pause control.

The fix keeps the video but takes it off the critical path: the poster image paints immediately (preloaded, `fetchpriority="high"`), the video element only mounts after the `window.load` event, and it never loads at all for `prefers-reduced-motion` or Data-Saver/2G users. A pause/play control satisfies WCAG 2.2.2. Every below-fold image is now lazy-loaded with explicit dimensions (CLS stays 0.00), and I dropped a font family that was loaded but never used.

**Measured under identical conditions** (mobile viewport, Fast 4G throttling, cache disabled, 10 seconds after load, no scrolling):

| | Before | After |
|---|---|---|
| Data transferred | **5.6 MB** (still climbing — the video was only half done) | **0.12 MB** |
| Video request starts | immediately, competing with every other asset | only *after* the load event |

That's ~46× less data in the first ten seconds on a 4G phone. It looks identical on a fast dev machine — which is precisely the point: the users it saves are the ones on hotel Wi-Fi and mobile data, who are also the ones most likely to bounce.

![After: hero with pause control, search still front and center](docs/after-mobile-hero.jpeg)

## Fix 3 — the lead form and the buttons

The form the whole page funnels into was a black hole: no validation, no error or success state, labels not programmatically associated, no `name`/`autocomplete` (which breaks browser autofill), and a submit that silently did nothing.

Rebuilt: associated labels, inline validation with `role="alert"` errors and `aria-invalid`, focus jumping to the first invalid field, and a clear confirmation state after submit — with a WhatsApp fast-lane on it, because in the Bali market WhatsApp is *the* contact channel and the page didn't offer it anywhere above the footer.

Alongside it, contrast: white text on the brand gold is roughly **2:1** — a WCAG failure on every primary CTA and every price. It's dark teal on gold now (~6.5:1), with a darker gold token for prices on white. Lighthouse (mobile, production build): **Accessibility 96 → 100, SEO 92 → 100** — the SEO delta also reflects the added Open Graph/Twitter meta and robots.txt.

![The fixed page end to end](docs/after-desktop-full.jpeg)

## What I'd measure to prove it worked

None of this is proven until it's measured, and the page ships with zero analytics. First change after these fixes: event instrumentation — search submits with their filter payloads, the filter sheet's open→apply rate (a step change is expected from the trap fix), WhatsApp clicks, form errors per field, and real-user web-vitals. The primary KPI is **lead rate**: (form submits + WhatsApp clicks) / sessions. The A/B queue starts with moving the listings above the region sections on mobile, and with testing whether the hero video earns its bytes at all against a static image. Full event table, KPI targets, and test list: [AUDIT.md §5](AUDIT.md).
