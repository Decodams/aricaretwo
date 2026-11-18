# Supabase setup for bookings

1. Create a Supabase project (free tier is fine).
2. In the SQL editor, run the schema below.
3. Copy `.env.example` to `.env.local` (or set Environment Variables in Vercel) and fill in:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `ADMIN_PASSWORD`
4. Deploy. Until Supabase is configured, bookings are written to `data/bookings.json` for local testing.

## SQL

```sql
create extension if not exists "pgcrypto";

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  status text not null default 'pending' check (status in ('pending','contacted','confirmed','cancelled')),
  program text not null check (program in ('dta','dtt','unsure')),
  name text not null,
  email text not null,
  phone text not null default '',
  city text not null,
  zip text not null default '',
  participant_name text not null default '',
  participant_age text not null default '',
  contact_method text not null default 'email',
  preferred_date date,
  preferred_time text not null default '',
  accessibility_needs boolean not null default false,
  transportation_needs boolean not null default false,
  notes text not null default '',
  consent boolean not null default false,
  source text not null default 'website',
  utm_source text not null default '',
  utm_medium text not null default '',
  utm_campaign text not null default '',
  confirmation_sent boolean not null default false
);

create index if not exists bookings_created_at_idx on public.bookings (created_at desc);
create index if not exists bookings_status_idx on public.bookings (status);

-- The server uses the service-role key, so RLS is bypassed server-side.
-- Keep RLS enabled and do not expose the service-role key to the browser.
alter table public.bookings enable row level security;
```

## Email (optional)

To enable email notifications, set `RESEND_API_KEY`, `BOOKING_TO_EMAIL` and
`BOOKING_FROM_EMAIL` (a verified sender domain in Resend). Without these,
bookings still save and appear in `/admin`; the email step is simply skipped.

## Admin

Set `ADMIN_PASSWORD` and sign in at `/admin`. For production also set
`ADMIN_SESSION_SECRET` to a long random string so sessions stay valid across
redeploys.
