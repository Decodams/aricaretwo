# Arizona Development Center — Full System Review (fresh pass)

**Reviewed:** 2026-11-18 — the *current* system, including the new booking API, admin dashboard, email layer and prerendered SEO/AI output.
**Method:** static review of all source + live browser walkthrough of every route; iframe harness across 320/360/375/414/600/768/900/1024/1280px; API edge-case tests; Lighthouse on every key page.
**Companion docs:** `BOOKING-SYSTEM.md`, `SUPABASE_SCHEMA.md`, `LAUNCH-HANDOFF.md`.

---

## Executive summary

This pass found and fixed **six real defects** that the previous review's automated checks missed:

| # | Defect | Fix |
|---|--------|-----|
| 1 | `/contact` submit was a **dead, disabled button** (no endpoint configured) | Now POSTs to the real `/api/bookings` endpoint; no secret needed. Added consent checkbox. |
| 2 | `/contact` had **74px horizontal overflow at 320px / 43px at 1280px** — the global `input { width:100% }` stretched the consent checkbox | Scoped checkbox to `16px` |
| 3 | Text links across the site had **21–23px tap targets** (below WCAG 2.5.8's 24px) | `min-height:24px` globally, `44px` on touch devices, including `.pathway-links a` |
| 4 | `/contact` two **color-contrast failures** (small labels, privacy text) | Darkened to `#5f6a63` |
| 5 | `/admin` **ARIA table violations** (role=row containing a button; unwrapped rows) | Added `role="presentation"` wrapper and `role="cell"` around the expand button |
| 6 | Footer logo link had **no accessible name in markup** | Added `aria-label` |

**Final state:** all 16 public/admin routes at 320px have **zero overflow and zero dead controls**; Lighthouse is **100/100/100** (Accessibility / Best Practices / SEO) on `/`, `/book`, `/contact`, `/admin`, `/faqs`; all API validation, auth and honeypot edge cases pass; `npm run build` passes and prerenders 15 pages.

---

## 1. User — parent, guardian, self-advocate

**Fine:** The new 4-step `/book` flow is calm and guided — it never asks for medical details, explains the program choice with plain hints, blocks past/weekend dates, and confirms "request, not a confirmed appointment." The confirmation screen gives a reference number. FAQs, the schedule, the lunch note, and the "start with a question" tone all reduce anxiety. Repeat CTA placement means help is always one tap away.

**Wrong:** Two inquiry paths still coexist (`/contact` and `/book`) with similar wording, which can confuse. Email delivery is dormant, so a family may submit and receive no confirmation email yet (they do get an on-screen reference). No phone number is published.

**Difficult:** Picking DTA vs DTT without a comparison table; understanding eligibility/funding; waiting for a human reply with no stated response time.

**Missing:** Published phone/email, response-time expectation, real availability, staff names, directions/parking, downloadable referral info.

**Should do:** Merge `/contact` into `/book` as a single entry point, publish verified contact details, add a "what happens next / typical reply time" block, and enable email.

## 2. Critic — UX & quality skeptic

**Fine:** The site still refuses to invent credentials, testimonials, hours or outcomes — unusual integrity. The booking flow's PHI guard and "not confirmed" wording are thoughtful. Real functionality now exists behind every button.

**Wrong:** The "Testimonials" section on the home page still contains no testimonial; "Meet the team" shows a children's photo labelled "not center staff." Those two sections promise proof they don't deliver. Six FAQs still end in "ask the center." Email being deliberately dormant means the system is half-connected until configured.

**Difficult:** Knowing which claims are verified vs placeholders; scanning the long home page; maintaining overlapping CSS blocks.

**Missing:** Real proof points, a DTA/DTT comparison, a documented content-review workflow.

**Should do:** Rename or replace the two hollow social-proof sections; consolidate CSS; add a visible "verified content" marker; close the email config gap.

## 3. Manager — program / operations

**Fine:** The admin dashboard is genuinely useful: KPI cards, search, status filter, per-booking details, status changes and deletion. It works on mobile (stacked cards). Bookings carry all operational details (program, participant age, accessibility, transportation, notes, UTM source).

**Wrong:** No pagination or export — with hundreds of bookings the single list will get unwieldy. No assignment/owner field, no follow-up date, no audit trail of status changes. The schedule still has a 2:30–3:30 PM "details to confirm" gap.

**Difficult:** Working a queue without ownership or due dates; keeping staff content current without a CMS; no notification when a new booking arrives until email is enabled.

**Missing:** CSV export, assignment, follow-up reminders, activity log, operating-calendar management.

**Should do:** Add pagination + CSV export, assignee and follow-up date fields, and a status-change history. Then enable email so the team is notified immediately.

## 4. Sales person — enrollment / growth

**Fine:** Every "Book free consultation" CTA now reaches a working 4-step form that actually stores leads. UTM source/medium/campaign are captured on each booking. Admin shows counts by status for pipeline visibility. Strong SEO base: prerendered HTML, structured data, sitemap, AI crawler files.

**Wrong:** No analytics is connected, so traffic → booking conversion cannot be measured. No phone/click-to-call. Email notifications are off, so speed-to-lead depends on someone checking the dashboard. Careers page is reachable only from the footer.

**Difficult:** Attributing leads, proving ROI, responding fast enough, explaining DTA vs DTT in one sentence.

**Missing:** Privacy-friendly analytics with consent, conversion events, click-to-call, a thank-you/next-steps email, Google Business Profile linkage.

**Should do:** Enable Resend email, add Plausible/analytics gated by the existing cookie preference, publish a phone number, and add UTM capture to all outbound campaign links.

## 5. Auditor — compliance, privacy, risk

**Fine:** Booking data flow is server-side only (service-role key never reaches the browser); rate limiting, honeypot, server-side validation, PHI rejection, signed HttpOnly admin cookies with 8-hour expiry, `SameSite=Lax`, `Secure` in production, constant-time password comparison. `/admin` is `noindex` + disallowed in robots. Lighthouse accessibility 100. No console errors on any route.

**Wrong:** Policies are still drafts with "Before launch" instructions and no effective dates. No data-retention period or DPA with the form/email provider. No CSRF token on state-changing API calls (mitigated by SameSite=Lax). No audit log of who changed a booking status. Rate limiter is in-memory and resets on cold start.

**Difficult:** Demonstrating retention, consent and access controls once Supabase/Resend are live; mapping DTA/DTT claims to Arizona DDD/HCBS rules.

**Missing:** Approved legal policies with dates, image permissions register, accessibility statement, incident procedure, vendor DPAs.

**Should do:** Legal review before launch; document retention and vendor data flows; add a status-change audit table; add CSRF tokens or origin checks if the site moves to a broader audience.

## 6. Designer — visual & brand

**Fine:** Consistent pine/gold/paper system, editorial type, generous whitespace, sticky header with anchor offset, reduced-motion support, focus-visible outlines, skip link. The booking stepper and admin cards follow the same visual language. Tap targets now meet WCAG 2.5.8 (24px, 44px on touch).

**Wrong:** The CSS remains two overlapping theme blocks with duplicate media queries — the source of the 74px overflow regression found in this pass. Small labels at 9–11px still pass contrast now but are visually tiny. Repeated "Representative image" badges compete with CTAs.

**Difficult:** Safely changing any value when a later rule may override it; keeping the admin table legible on narrow screens (now handled by stacked cards).

**Missing:** A single token layer, visual-regression snapshots, real brand photography, documented type/spacing scale.

**Should do:** Consolidate CSS into one source of truth, delete dead selectors (`.service-row`, `.approach-*`, `.standards-*`), bump micro-labels to 12px, and add visual regression tests.

## 7. Developer — code & maintainability

**Fine:** API handlers are small and shared (`server/*`), the same handlers run in dev via a Vite plugin and in prod as Vercel functions. Validation, storage and email are separated. Build passes; prerender works; routes have per-page metadata; no console errors.

**Wrong:** `/contact` and `/book` duplicate inquiry logic and field mapping. No error boundary, no tests, no linter, no CI. The CSS duplication noted above. `data/bookings.json` fallback is dev-only and will not persist on Vercel (documented, but a footgun if env vars are forgotten). Admin table ARIA needed two fixes this pass.

**Difficult:** Onboarding; debugging cascade overrides; changing shared form behaviour in two places.

**Missing:** Component split, unit/E2E tests, CI, error boundary, typed env vars, monitoring/alerting for failed email sends.

**Should do:** Extract a shared inquiry hook, add tests covering all 16 routes + API flows, add ESLint/Prettier + CI, add an error boundary, and alert on email failures.

## 8. Investor — growth, value, risk

**Fine:** A real end-to-end lead capture system now exists: form → database → admin pipeline, with email ready to switch on. Static hosting + managed free-tier services keep costs negligible. Crawlability work (prerender, schema, llms.txt, AI crawler rules) is ahead of most small competitors. Lighthouse 100 across the board.

**Wrong:** Without the Vercel env vars, production bookings have nowhere durable to go and `/admin` is locked — launch readiness depends entirely on configuration. No analytics means no funnel data. No proof points (testimonials, outcomes, staff). Draft policies are a legal risk.

**Difficult:** Estimating conversion or CAC; due diligence on compliance; trusting a handoff where key values live in env vars rather than code.

**Missing:** KPI dashboard, lead-source reporting, capacity/utilization metrics, licensing/accreditation evidence, roadmap, configured monitoring.

**Should do:** Configure Supabase + admin password + Resend now, enable privacy-friendly analytics, publish real outcomes and testimonials, and formalize policies. That converts a well-built site into a measurable acquisition engine.

---

## Routing / endpoint audit

- **All 16 routes render** with correct titles, `main` landmark and no console errors.
- **Every in-app `Link`/`NavLink` resolves** to a defined route; no `href="#"`, no empty `to`, no textless controls (the icon-only menu button and logo links have `aria-label`).
- **Fixed this pass:** `/contact` submit had no endpoint → now posts to `/api/bookings`; footer logo gained an accessible name.
- **Verified working:** header/hero/banner "Book" CTAs → `/book`; pathway hash anchors `#dtt`/`#dta` scroll correctly under the sticky header; `/services#dta` deep link; hash-driven contact topic.
- **API endpoints:** `POST /api/bookings`, `GET /api/bookings` (admin), `PATCH|DELETE /api/bookings/:id` (admin), `POST /api/admin/login|logout`, `GET /api/admin/me` — all present and exercised.
- **Email:** implemented but dormant by design until Resend keys are set; bookings still save and appear in admin.

## Responsiveness audit

- Harness checked 320/360/375/414/600/768/900/1024/1280px across all pages. **Zero horizontal overflow** after the checkbox fix.
- Tap targets: 24px minimum everywhere, 44px on touch devices; checkboxes/radios enlarged to 16px inside full-size clickable labels.
- Admin table → stacked cards ≤980px; booking form rows collapse ≤620px; mobile nav collapses ≤900px; reduced-motion honoured.

## Bug & quality fixes applied this pass

1. `/contact` dead submit → real API POST + consent.
2. `/contact` 74px/43px overflow → scoped checkbox width.
3. Sub-24px link targets → global min-height + touch media query.
4. Two `/contact` contrast failures → darker muted text.
5. Admin ARIA table violations → presentation/cell roles.
6. Footer logo accessible name.

## Verification

- `npm run build` passes; 15 routes prerendered to static HTML.
- Lighthouse **100/100/100** on `/`, `/book`, `/contact`, `/admin`, `/faqs`.
- API edge cases: PHI → 422, weekend → 422, past date → 422, honeypot → silent 201, tampered cookie → 401, wrong password → 401, valid login → session, status change → updated stats.
- Booking UI: 4 steps → confirmation reference. Admin UI: login → list → expand details.
- 16 routes at 320px: zero overflow, zero dead controls.
