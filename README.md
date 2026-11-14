# WanzStore

Premium digital growth platform built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Current status

The repository currently contains the initial responsive landing page and application scaffold. Authentication, database-backed orders, wallet/deposits, admin tools, and provider integrations are not implemented yet.

## Requirements

- Node.js 20+
- npm

## Local development

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000.

## Environment variables

See `.env.example`. Never commit real credentials or expose the Supabase service role key to browser code.

## Deployment

Import this repository into Vercel, configure the environment variables when Supabase integration is implemented, and deploy the `main` branch.

## Security principles

- Enforce authorization on the server, not only in the UI.
- Validate all user input.
- Use atomic database operations for balance changes.
- Verify provider webhook signatures.
- Keep secrets out of client bundles.
- Only offer transparent, legitimate digital marketing services that comply with platform terms.
