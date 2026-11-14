# WanzStore

SMM Booster panel built with Next.js, TypeScript, Tailwind CSS, and Supabase Auth.

## Current implementation

- Responsive SMM landing page and platform categories
- Supabase email/password sign-in and registration
- Email confirmation callback
- Cookie session refresh middleware
- Protected starter customer dashboard

Not implemented yet: SprintPedia API orders, payment processing, wallet ledger, admin roles/dashboard, reseller API, and order history. Preview content is not live service data.

## Setup

1. Create a Supabase project.
2. In Supabase Authentication settings, enable Email provider and configure the site URL plus redirect URL `https://YOUR_DOMAIN/auth/callback`.
3. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to Vercel for Production, Preview, and Development.
4. Redeploy the project.

For local development, copy `.env.example` to `.env.local`, fill the two public Supabase values, then run `npm install` and `npm run dev`.

Never put the Supabase service role key or SprintPedia API key in client-side code or commit them to Git.

## Security

- Browser authentication uses the Supabase anon key and cookie-based sessions.
- Server routes must verify users with `auth.getUser()`.
- Add database Row Level Security before storing customer data.
- Balance changes must use atomic database transactions.
- Verify SprintPedia webhook signatures and keep provider credentials server-side.
