# Booking system, admin dashboard & crawlability

## What was built

### 1. Smart responsive booking form — `/book`
- Four-step flow: **Program & timing → About you → Support needs → Review**.
- Smart behaviour: program choice changes the guidance text; the date picker blocks past days and weekends; choosing "phone call" makes the phone field required; the review step summarizes everything before sending.
- Safety: honeypot, rate limiting (5 requests / 10 min per IP), client + server validation, and a check that blocks diagnoses, medications, or government ID numbers in the notes field.
- Accessibility: labelled fields, `aria-invalid`, `role="alert"` errors, keyboard-friendly, focus moved to the first invalid field. Lighthouse 100/100/100.
- On success, the visitor gets a reference number (`ADC-XXXXXXXX`) and a clear "request, not a confirmed appointment" message.
- All "Book free consultation" CTAs across the site now lead here.

### 2. Admin dashboard — `/admin`
- Password login (HttpOnly, signed session cookie, 8-hour expiry).
- KPI cards (total / pending / contacted / confirmed / cancelled), search, status filter, and a responsive booking table that becomes stacked cards on mobile.
- Per-booking detail panel, status changes, and deletion.
- Protected via `/api/admin/*` and `/api/bookings` server checks — not just a hidden client route. `/admin` is `noindex` and disallowed in `robots.txt`.

### 3. Email — dormant until configured (per your choice)
- `server/email.js` is fully implemented with the Resend REST API. When `RESEND_API_KEY` **and** `BOOKING_TO_EMAIL` are set, each booking sends:
  1. a confirmation to the family (with reference and "not confirmed" wording), and
  2. a notification to the care team with all non-sensitive details and a link to `/admin`.
- Until then it safely no-ops: bookings still save and still appear in the dashboard. The API response reports `"email": { "sent": false, "skipped": true }`.

### 4. SEO + AI crawlability
- **Build-time prerendering** (`scripts/prerender.mjs`): every public route is rendered to real HTML at build time, so crawlers get full content without running JavaScript. `/admin` is rendered with `noindex`.
- `robots.txt` explicitly allows Googlebot/Bingbot plus GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Google-Extended, PerplexityBot, CCBot, Applebot-Extended, Meta-ExternalAgent, cohere-ai and Bytespider; disallows `/admin`, `/api/`, `/data/`.
- `sitemap.xml` lists all 14 public pages (including `/book`, excluding `/admin`).
- `llms.txt` and `llms-full.txt` give AI assistants a concise and a detailed, citable summary of the business, programs, facts, and content caveats.
- Rich structured data: LocalBusiness + Service ×2 + FAQPage (in `index.html`) and a per-route BreadcrumbList injected at prerender time.
- Canonical URLs, OG/Twitter tags, and per-route title/description.

## Architecture
```
Browser → /api/bookings (Vercel function) → Supabase REST → bookings table
                                          ↘ Resend API (when configured)
Browser → /api/admin/* (Vercel function) → signed HttpOnly cookie session
Local dev: server/viteApiPlugin.js mounts the same /api handlers into Vite
No Supabase configured: bookings fall back to ./data/bookings.json (dev only)
```

## Files
| Path | Purpose |
|------|---------|
| `api/bookings/index.js` | Create booking (public) / list bookings (admin) |
| `api/bookings/[id].js` | Status update / delete (admin) |
| `api/admin/{login,logout,me}.js` | Session auth |
| `server/store.js` | Supabase REST + local JSON fallback |
| `server/auth.js` | Password check + signed cookies |
| `server/email.js` | Resend notifications (dormant until configured) |
| `server/validation.js` | Shared validation + PHI check |
| `server/viteApiPlugin.js` | Runs API routes during `npm run dev` |
| `src/BookingPage.jsx` | Booking UI |
| `src/AdminPage.jsx` | Admin UI |
| `scripts/prerender.mjs` | Static HTML generation |
| `SUPABASE_SCHEMA.md` | SQL + setup steps |

## Setup to go live
1. Run the SQL in `SUPABASE_SCHEMA.md`.
2. Set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` in Vercel.
3. To enable email, also set `RESEND_API_KEY`, `BOOKING_TO_EMAIL`, and a verified `BOOKING_FROM_EMAIL`.
4. Deploy (`npm run build` now also prerenders).
5. Sign in at `https://aricaretwo.vercel.app/admin`.

## Verified
- `npm run build` passes and prerenders 15 route HTML files.
- API flow tested end-to-end: create → 201 + reference; unauthenticated list → 401; wrong password → 401; correct password → session; list → bookings + stats; PATCH status → updated counts.
- Booking UI tested through all four steps to confirmation.
- Admin UI tested: login, 2 bookings listed, status change updates stats.
- Responsive: all 16 routes at 320px plus 320–1280px sweeps with zero horizontal overflow; 24px minimum tap targets (44px on touch).
- Lighthouse 100/100/100 on `/`, `/book`, `/contact`, `/admin` and `/faqs`.
- `/contact` now also submits to `/api/bookings` (no configuration needed); consent checkbox added.
- The 2026 redesign added `/services/dta` and `/services/dtt`, with legacy `/services#dta` and `/services#dtt` redirects. All contact details on `/book`, `/contact`, the header and the footer come from `config/site.ts` and hide when empty.
- See `REVIEW-REPORT.md` for the latest 8-persona walkthrough and the full defect list.
