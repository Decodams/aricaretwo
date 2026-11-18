# Arizona Development Center — Full System Review

> **Update:** Since this review, a full booking system (multi-step form, Supabase-backed API, password-protected admin dashboard, email layer, and build-time prerendering for SEO/AI crawlers) has been built. See `BOOKING-SYSTEM.md` and `SUPABASE_SCHEMA.md`. The launch blockers listed below still apply.

**Scope:** `index.html`, `src/App.jsx` (1,605 lines), `src/styles.css` (~720 lines), `vite.config.js`, `vercel.json`, `.env.example`, image assets, and all 14 public routes.
**Method:** static code review + live browser walkthrough + 36-viewport responsive harness (320–1280px across `/`, `/services`, `/faqs`, `/contact`) + Lighthouse audits on every key route.
**Date:** 2026-11-18

---

## 0. Executive summary

The site is a well-crafted, honest static marketing site for two Arizona HCBS programs (DTA for adults, DTT for children/youth). Its biggest strengths are restraint (it refuses to invent unverified facts), clear writing, and a calm visual system. Its biggest weakness is **conversion**: the primary action (a consultation) has no working endpoint out of the box, no phone number is published, and almost every substantive question is answered with "contact us."

I fixed every code-level defect I found:

| # | Issue | Status |
|---|-------|--------|
| 1 | 15px horizontal overflow at 320px on every page | Fixed |
| 2 | 12 WCAG color-contrast failures | Fixed (now 0) |
| 3 | Invalid `robots.txt` (SEO) | Fixed (SEO 83 → 100) |
| 4 | `/careers` page existed but had **no link from anywhere** | Fixed |
| 5 | Contact form had no endpoint; submit button was a dead, disabled control | Fixed (endpoint-ready) |
| 6 | Stale topic state when navigating between `/contact` variants | Fixed |
| 7 | No sitemap for a 14-page site | Fixed |

**Verification:** `npm run build` passes; Lighthouse scores **Accessibility 100 / Best Practices 100 / SEO 100**; 36 responsive combinations show **zero overflow**; all 14 routes render with correct titles and no console errors.

**Remaining blockers are business decisions, not code:** a verified contact email or form endpoint, a phone number, real staff/photo content with permissions, and legal review of the draft policies. See `LAUNCH-HANDOFF.md`.

---

## 1. Persona: The User (parent, guardian, or self-advocate)

### What is fine
- Calm, plain language. "You can start with a question. No plan needed." lowers the anxiety of a first contact.
- Honest labeling: every photo is marked "Representative image," and the testimonial/team sections explicitly say the people shown are not ADC participants or staff. That builds trust rather than faking social proof.
- The FAQ answers real questions in readable language, including "please don't send health details through the form."
- Clear address, a Google Maps link, a visible schedule, and a "bring your own lunch" note.
- The mobile menu and FAQ accordions are keyboard-accessible; there is a skip link.

### What is wrong
- **There is no phone number or email anywhere on the site.** The single action available is a form. For a family in a hurry, that is a dead end.
- **"Book Free Consultation" does not book anything.** It opens an email draft (or, before config, a disabled button).
- The daily schedule contains an honest but alarming row: `2:30–3:30 PM — "Schedule details to confirm."`
- Almost every substantive question — eligibility, AHCCCS/insurance, parent training, transportation, availability — ends in "ask the center." The site raises the questions but rarely answers them.

### What is difficult
- Understanding DTA vs DTT (the FAQ helps, but the homepage uses the acronyms immediately).
- Figuring out "is this right for my family?" with no comparison view and no stated availability.
- Reaching a human quickly.

### What is missing
- Phone number, real booking, response-time expectation ("we reply within 1 business day"), staff names, actual availability, funding/cost answers, directions/transit/parking information.

### What should be done
1. Publish a verified phone number with click-to-call.
2. Configure a real submission endpoint or a booking link (Calendly etc.).
3. Add a short "What happens after you contact us" section with a response-time commitment.
4. Replace "ask the center" with real answers wherever the business approves them.

---

## 2. Persona: The Critic (UX and quality skeptic)

### What is fine
- Remarkable restraint: the site does not fabricate credentials, testimonials, hours, or capabilities. Many commercial care sites do.
- Consistent editorial design — serif headlines, generous spacing, one accent color — applied across all 14 routes.
- Fast, dependency-light static build; no trackers by default.

### What is wrong
- The "honest hedging" crosses into incompleteness. Six of the thirteen FAQs are variations of "contact us to confirm." A skeptical visitor reads that as "they don't actually know / can't say."
- The "Testimonials" section contains **no testimonial** — it is a photo of unrelated adults and a paragraph about trust.
- The "Meet the team" section shows a children's photo labelled "not center staff." It announces a team it never introduces.
- Before this review, the CSS was ~720 lines containing **two complete theme blocks and two overlapping sets of media queries** — clear evidence of layers of edits, with contradictory font-size declarations (e.g. `74px` declared globally *after* mobile `clamp()` rules).
- The primary CTA's disabled state explained the problem only in fine print.

### What is difficult
- Scanning a very long homepage where several sections repeat the same "Book a consultation" message.
- Knowing which statements are verified vs placeholders — the site does not mark them differently.
- Finding Careers (it was an orphan page — now linked in the footer).

### What is missing
- Real proof: testimonials with permission, named staff, outcome data, referral-partner logos.
- A decision aid: a simple "DTA vs DTT, which fits?" comparison table.
- Information density — many sections could say more with fewer words.

### What should be done
1. Ship fewer, denser sections; add a DTA/DTT comparison table near the top.
2. Replace the fake "testimonial" and "team" sections with real content once permissions exist — until then, rename them honestly ("Our approach," "The people who support each program").
3. Consolidate the CSS into a single source of truth (see Developer report).

---

## 3. Persona: The Manager (program / operations)

### What is fine
- Program descriptions, activity lists, the 9-row daily schedule, meal policy, and non-discrimination statement give staff a solid content base.
- "How it works" (consultation → tailored plan → ongoing support) is a clear intake narrative.
- The Safety page gives families a good list of questions to ask — useful as a staff training checklist too.

### What is wrong
- Operating days and holiday hours are still unconfirmed; the site says so, but that leaves a core operational fact blank.
- The schedule's 2:30–3:30 PM gap reads as unfinished.
- No referral workflow, enrollment checklist, family-communication cadence, or emergency-procedure summary.
- No content management path: every text change requires a code change and redeploy.

### What is difficult
- Answering the same basic questions the website deliberately defers.
- Keeping all "confirm with the center" wording accurate as policies evolve.
- Coordinating content updates with a developer.

### What is missing
- Staff directory and role descriptions, referral packet, transport policy, availability/status indicator, downloadable forms.

### What should be done
1. Publish verified hours, holidays, and referral/enrollment steps.
2. Add a lightweight content source (JSON/Markdown files or a small CMS) so staff can edit copy without touching JSX.
3. Add a "Current status" note (e.g. "Now accepting inquiries for DTA") that can be updated easily.

---

## 4. Persona: The Sales Person (enrollment / growth)

### What is fine
- Strong emotional framing and repeated, well-placed CTAs (header, hero, section ends, footer banner).
- Low-pressure language is a genuine conversion asset in this sector.
- Solid SEO foundations: per-route title/description, LocalBusiness schema, OG tags, and now a valid sitemap + robots.txt.

### What is wrong
- **No conversion instrumentation.** The cookie page states plainly that no analytics is connected, so there is no way to see which pages or campaigns produce inquiries.
- **No click-to-call.** For a local service business, the absence of a phone number is a direct lead killer.
- Until this review, the submit button was disabled unless an env var was set — i.e. the site could ship with **zero lead capture**.
- Careers had no inbound link (fixed).

### What is difficult
- Measuring a funnel, attributing leads, or proving marketing ROI.
- Explaining DTA vs DTT in one sentence during a phone call.
- Reassuring families about fit without published proof.

### What is missing
- Privacy-friendly analytics with consent, conversion events, UTM capture, a thank-you/confirmation experience, a downloadable one-pager, Google Business Profile linkage.

### What should be done
1. Configure `VITE_CONTACT_ENDPOINT` (or email fallback) immediately — see `.env.example`.
2. Add privacy-friendly analytics (e.g. Plausible) gated by the existing cookie preference control.
3. Add a verified phone number with click-to-call and capture the lead source in the form payload.

---

## 5. Persona: The Auditor (compliance, privacy, risk)

### What is fine
- Privacy notice, Terms, and Cancellation pages exist and are clearly labelled as general information.
- Strong privacy hygiene in the UI: repeated "do not send diagnoses/medications" warnings, a honeypot field, no analytics by default, localStorage-only cookie preference.
- Non-discrimination statement, 911 emergency disclaimer, and representative-image disclaimers are present.
- All routes render without console errors; no broken external dependencies in the app code.

### What is wrong
- All three policy pages contain "Before launch" instructions addressed to the business — they are **drafts, not publishable policies**. There is no effective date, owner, or version.
- No verified business contact identity, no data-retention statement, and no data-processing terms for whatever endpoint receives inquiries.
- `robots.txt` was invalid (the SPA rewrite served HTML) — fixed by adding real `public/robots.txt` and `sitemap.xml`.
- No cookie banner: the preference page is opt-in only, which is defensible only because no cookies are set — that must be re-audited once analytics is added.

### What is difficult
- Demonstrating consent, retention, and data-flow compliance once a third-party form endpoint is introduced.
- Mapping the site's claims to Arizona DDD/HCBS requirements for DTA/DTT.

### What is missing
- Legally reviewed policies with dates, an accessibility statement, an image-permission log, staff screening disclosures, and documented incident/emergency procedures.

### What should be done
1. Legal review of Privacy / Terms / Cancellation before launch; add effective dates and remove "Before launch" text.
2. Document the data flow: form → endpoint → inbox → retention period.
3. Keep a permissions register for every photo used, and add a WCAG/accessibility statement.

---

## 6. Persona: The Designer (visual and brand)

### What is fine
- Cohesive palette (deep pine, warm gold, paper white), editorial serif headings, disciplined spacing, and a strong hero image treatment.
- Thoughtful responsive intent: grids collapse cleanly, sticky header offset (`scroll-padding-top`) is respected by anchor links, and `prefers-reduced-motion` is supported.
- Focus-visible outlines and a skip link show real accessibility awareness.

### What is wrong
- **12 color-contrast failures** were measured by Lighthouse — gold labels on light backgrounds (~3.4:1) and a grey caption on the dark team section (1.96:1). All fixed (gold darkened to `#75551a`, label grey to `#657066`, caption to `#d7e1d8`).
- The duplicated CSS blocks make the cascade hard to reason about; the same selectors are redefined at multiple points with different values.
- Several micro-labels are 9–11px; they pass contrast now but remain small for low-vision users.
- Repeated "Representative image" badges compete visually with the CTA in the program cards.

### What is difficult
- Safely changing a value when it may be overridden by a later block.
- Testing at 320px, where `body { min-width: 320px }` caused a 15px horizontal scrollbar (fixed).

### What is missing
- A documented type scale and spacing tokens, a real brand photography set, a dark-mode consideration, and visual-regression snapshots.

### What should be done
1. Consolidate CSS into one themed token layer; delete dead selectors (`.service-row`, `.approach-*`, `.standards-*`, etc. no longer used by the JSX).
2. Keep the accessible palette; bump the smallest labels to 12px minimum.
3. Replace the repeated representative-image badges with a single clear disclosure near the gallery.

---

## 7. Persona: The Developer (code and maintainability)

### What is fine
- Components are small and readable; semantic HTML and ARIA are used correctly (menu `aria-expanded`/`aria-controls`, status roles, labelled inputs).
- Route-level metadata effect handles title + description + hash scrolling in one place.
- Honeypot spam trap, lazy-loaded images, image-copy build plugin, SPA rewrite config — all sensible.

### What is wrong
- Everything lives in one 1,605-line `App.jsx`. Contact logic is embedded in the presentational component.
- `styles.css` contains two `:root` blocks and two sets of breakpoints with overlapping, sometimes contradictory rules — a classic merge-without-cleanup state.
- `ContactPage` read `window.location.search` directly instead of using router hooks, so the topic did not reset on client-side navigation (fixed with `useSearchParams`).
- No error boundary, no tests, no linter/formatter config, no CI.
- `vercel.json`'s catch-all rewrite made `/robots.txt` return HTML (fixed with real `public/` files).

### What is difficult
- Onboarding a new developer; debugging which CSS rule actually wins; changing contact behaviour safely.

### What is missing
- Component/page split, unit + E2E tests, CI pipeline, error boundary, typed env vars, and a proper setup section in the README.

### What should be done
1. Split `App.jsx` into `components/` and `pages/`; move form logic into a hook.
2. Consolidate CSS to one source of truth and delete dead rules.
3. Add ESLint + Prettier, an error boundary, and a small Playwright smoke test covering all 14 routes.

---

## 8. Persona: The Investor (growth, value, risk)

### What is fine
- Credible, trustworthy brand presentation in a sensitive sector — the site's honesty is a genuine differentiator.
- Very low operating cost: static SPA, no backend to maintain (as long as the form endpoint is a cheap third-party service).
- Strong technical SEO base and a fully responsive experience across phone, tablet, and desktop.
- Clear service lines (DTA/DTT) and a defined geographic market (Peoria, AZ).

### What is wrong
- Out of the box, the site cannot capture a lead (no configured endpoint, no phone). Growth is impossible until that is fixed.
- No analytics means no funnel data, no CAC analysis, and no evidence for marketing decisions.
- No proof points: no testimonials, named staff, outcome metrics, or referral-partner relationships.
- Draft legal policies and unverified business details are launch risk.

### What is difficult
- Estimating conversion, capacity, or unit economics from the current site.
- Due diligence on compliance and on the durability of the "no invented claims" content model.

### What is missing
- KPI dashboard, lead funnel, referral-source tracking, capacity/utilization metrics, licensing/accreditation evidence, and a documented roadmap.

### What should be done
1. Close the launch blockers (endpoint/email, phone, legal review) — this is the highest-ROI work.
2. Instrument privacy-friendly analytics and publish real outcome/testimonial content once permissions are secured.
3. Produce a one-page impact/capacity dashboard for future partners and funders.

---

## 9. Routing audit — complete matrix

**Routes defined in `App.jsx` (14 + 404):**
`/`, `/services`, `/how-it-works`, `/about`, `/careers`, `/find-care`, `/contact`, `/safety`, `/faqs`, `/privacy`, `/terms`, `/cancellation`, `/cookies`, `*`.

**Result:** every in-app `Link`/`NavLink` target resolves to a defined route. There are **no `href="#"` placeholders, no empty `to=""`, and no textless interactive controls** (the icon-only menu button has `aria-label`).

| Finding | Detail | Fix applied |
|---------|--------|-------------|
| Orphan page | `/careers` rendered correctly but had **zero inbound links**; the only careers-related link went to `/contact?topic=careers` | Added "Careers" link to the footer Explore column |
| Dead submit button | The contact form's submit button was `disabled` whenever `VITE_CONTACT_EMAIL` was unset, with no server endpoint | Added `VITE_CONTACT_ENDPOINT` JSON-POST support + documented both env vars; button now disables only when neither is configured and shows "Sending…" while submitting |
| Stale query state | Navigating `/contact?topic=appointment` → `/contact` via the footer kept the appointment topic and extra fields | Switched to `useSearchParams` + effect-driven reset |
| Hash anchors | `<a href="#dtt">` / `#dta` and `/services#dta` | Verified live: smooth-scroll lands 96px below the sticky header as intended |
| Low discoverability | `/safety`, `/find-care`, `/privacy`, `/terms`, `/cancellation`, `/cookies` are footer-only | Acceptable; recommend adding contextual links in body copy (e.g. "Read our safety questions" near the Safety content) |
| SPA deep links | `vercel.json` catch-all rewrite | Verified `/no-such-page` and all deep links render the SPA; added real `public/robots.txt` + `sitemap.xml` so crawlers get valid files |

---

## 10. Responsiveness audit

**Method:** same-origin iframe harness at **320, 360, 375, 414, 600, 768, 900, 1024, 1280px** across `/`, `/services`, `/faqs`, `/contact` (36 combinations), measuring `scrollWidth - clientWidth`.

| Viewport class | Behaviour |
|----------------|-----------|
| ≤ 620px | Single-column stacks; hero actions stack; announcement wraps; nav becomes a full-width dropdown; contact fields go single-column |
| 621–900px | Two-column cards/tables compress; nav collapsed; footer reflows to 3 then 2 columns |
| > 900px | Full multi-column desktop layout; sticky header with offset anchors |

**Issues found and fixed:**
- **320px:** 15px horizontal overflow on every page, caused by `body { min-width: 320px }` exceeding the 305px layout viewport when a scrollbar is present → changed to `min-width: 0`. Result: **0 overflow in all 36 combinations**.
- Buttons, modals, and screens: the site has no modal dialogs. All buttons are inline-flex with wrapping, adequate min-heights (42–52px), and visible focus states.

**Caveat:** the duplicated CSS blocks mean future responsive edits can be silently overridden. Consolidating them is the main durability risk.

---

## 11. Bugs and quality fixes applied

1. `src/styles.css` — 320px overflow (`body min-width`).
2. `src/styles.css` — 12 color-contrast failures fixed by darkening `--coral` to `#75551a`, label grey to `#657066`, and the dark-section figcaption to `#d7e1d8`.
3. `public/robots.txt` + `public/sitemap.xml` added; SEO audit now 100.
4. `src/App.jsx` — contact topic now derives from `useSearchParams` and resets on navigation.
5. `src/App.jsx` — contact form supports a real JSON POST endpoint (`VITE_CONTACT_ENDPOINT`) with success/error states, loading state, and honeypot; mailto fallback retained via `VITE_CONTACT_EMAIL`.
6. `src/App.jsx` — Careers page linked from the footer.
7. `.env.example` and `LAUNCH-HANDOFF.md` updated to document the new configuration.

---

## 12. Verification results

- `npm run build` — passes (310 KB JS / 41 KB CSS, ~96 KB JS gzipped).
- Lighthouse (home, after fixes): **Accessibility 100, Best Practices 100, SEO 100**, zero failures.
- All 14 routes: correct `h1`, correct per-route `document.title` and meta description, zero console errors, `main` landmark present.
- Responsive harness: 36/36 viewport combinations with zero horizontal overflow.
- Live interaction checks: mobile menu, FAQ accordions, anchor scrolling with sticky header, contact topic reset, footer Careers link — all pass.

## 13. Launch checklist (owner: business)

- [ ] Set `VITE_CONTACT_ENDPOINT` or `VITE_CONTACT_EMAIL` (without this, no inquiries arrive).
- [ ] Publish a verified phone number and email; confirm address, service-area wording, hours, and holidays.
- [ ] Replace representative imagery and add staff content only with signed permissions.
- [ ] Have counsel review Privacy, Terms, and Cancellation; add effective dates and remove draft notes.
- [ ] Confirm DTA/DTT eligibility, referral steps, funding/AHCCCS, transportation, and parent-training statements.
- [ ] Add privacy-friendly analytics and re-check the cookie disclosure when tracking is enabled.
