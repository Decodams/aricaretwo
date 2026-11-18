# Launch Handoff

## Values to supply (each lives in one file)

| Value | File |
|-------|------|
| `phone`, `email`, `kidsHours` | `config/site.ts` |
| DTT typical day schedule | `src/App.jsx` (add a `dttSchedule` and render it on the DTT page when it exists) |
| Activities for the 2:30 to 3:30 slot | `src/App.jsx` (`dtaSchedule`, currently the slot is omitted) |
| Real testimonials with written consent | `data/testimonials.ts` |
| Staff entries with consent | `data/staff.ts` |
| Real, consented photography | `data/images.ts` (each slot has `src`, `alt`, and the representative caption) |

Empty values are hidden throughout the site. Testimonials and staff sections do not render while their arrays are empty. The representative photo captions stay visible until real photography is approved.

## Confirm before publishing

- **Booking system:** run the SQL in `SUPABASE_SCHEMA.md` and set `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET` in Vercel. Without these, bookings are only written to a local JSON file (local development) and `/admin` cannot be opened in production. See `BOOKING-SYSTEM.md`.
- **Email:** booking emails are intentionally dormant. Set `RESEND_API_KEY`, `BOOKING_TO_EMAIL` and a verified `BOOKING_FROM_EMAIL` to send a confirmation to families and a notification to the care team. Bookings save and appear in admin even without email.
- The `/contact` and `/book` forms post to `/api/bookings`, so no contact endpoint secret is needed. The legacy `VITE_CONTACT_*` variables are no longer used by those forms.
- Confirm the business phone number, public email, social profile URLs, service-area wording, current operating days, and holiday hours. They were not verified in the supplied project, so the site does not invent them.
- Replace representative stock imagery only after obtaining appropriate participant, guardian, and staff permissions.
- Confirm current DTA and DTT eligibility, referral and enrollment steps, accepted funding sources, authorizations, availability, family communication, parent training, and transportation options before stating them as services or guarantees.
- Have the organization review the privacy notice, terms, cancellation information, and actual website data-retention practices before launch.

## Current verified content

- Arizona Development Center LLC
- 11001 N 99th Ave, Peoria, AZ 85345
- Day Treatment and Training – Adult (DTA)
- Day Treatment and Training – Kids (DTT)
- DTA program day: 8:00 a.m. to 4:00 p.m. Operating days and holiday hours still need confirmation.
