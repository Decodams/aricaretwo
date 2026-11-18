# Launch Handoff

## Confirm before publishing

- **Booking system:** run the SQL in `SUPABASE_SCHEMA.md` and set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` in Vercel. Without these, bookings are only written to a local JSON file (local development) and `/admin` cannot be opened in production. See `BOOKING-SYSTEM.md`.
- **Email:** booking emails are intentionally dormant. Set `RESEND_API_KEY`, `BOOKING_TO_EMAIL` and a verified `BOOKING_FROM_EMAIL` to send a confirmation to families and a notification to the care team. Bookings save and appear in admin even without email.
- Configure a form endpoint (`VITE_CONTACT_ENDPOINT`, a URL that accepts a JSON POST) so the contact form actually submits to the care team. If no endpoint is available, set `VITE_CONTACT_EMAIL` as a fallback: the form then opens a pre-filled draft in the visitor's email app. The submit button stays disabled until one of these is configured. See `.env.example`.
- Confirm the business phone number, public email, social profile URLs, service-area wording, current operating days, and holiday hours. They were not verified in the supplied project, so the site does not invent them.
- Replace representative stock imagery with current Arizona Development Center photos only after obtaining appropriate participant, guardian, and staff permissions. The current image labels make clear that photos are illustrative, not ADC clients or employees.
- Add approved team member names, roles, training and qualification details, and biographies. The supplied team image is branded for an unrelated childcare center and is intentionally not used.
- Confirm current DTA and DTT eligibility, referral and enrollment steps, accepted funding sources, authorizations, availability, family communication, parent training, and transportation options before stating them as services or guarantees.
- Have the organization review the privacy notice, terms, cancellation information, and actual website data-retention practices before launch.

## Current verified content

- Arizona Development Center LLC
- 11001 N 99th Ave, Peoria, AZ 85345
- Day Treatment and Training – Adult (DTA)
- Day Treatment and Training – Kids (DTT)
- DTA program day listed as 8:00 a.m.–4:00 p.m.; operating days and holiday hours still need confirmation
