# TNV Leadership Selection Portal (Next.js + Supabase)

A Next.js rewrite of the TNV interview portal with real authentication (Supabase Auth), row-level-security-backed data access, and Vercel deployment.

## Stack

- Next.js 16 (App Router, Server Actions, Middleware)
- Supabase (Postgres + Auth + RLS)
- Tailwind CSS
- `xlsx` for Excel export

## 1. Create the Supabase project

1. Create a new project at [supabase.com](https://supabase.com).
2. Open the SQL Editor and run [`supabase/schema.sql`](./supabase/schema.sql) once.
3. In **Authentication → Users**, add the first Admin user (email + password).
4. In the SQL Editor, insert a matching profile row so that user is recognised as admin:

   ```sql
   insert into profiles (id, role, full_name, email, is_active)
   values ('<auth-user-uuid-from-step-3>', 'admin', 'Core TNV Admin', 'admin@example.com', true);
   ```

5. Copy **Project URL**, **anon/public key**, and **service_role key** from Project Settings → API.

## 2. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in the three Supabase values. Never commit `.env.local` — the service role key bypasses RLS.

Interviewer invitations require the `SMTP_*` values (any SMTP provider works — Gmail app password, SendGrid, Mailgun, Amazon SES, etc.) and `NEXT_PUBLIC_APP_URL` (the portal's public URL, used to build the setup link in the email). If SMTP is left unconfigured, the interviewer account is still created — the invite email is simply skipped with a warning, and the admin needs to hit "Resend Invite" once SMTP is configured.

## 3. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 4. Deploy to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add the same three environment variables in Project Settings → Environment Variables (Production + Preview).
4. Deploy.

## How accounts work

- There is no public sign-up. The Admin invites interviewers from **Admin → Interviewers** by email only — a one-time setup link is emailed to them; opening it signs them in and lets them choose their own name, mobile number, and password on `/setup-account`. Until they complete that step the account shows as "⏳ Invite Sent" and can't be used to sign in with a password.
- Roles live in the `profiles` table (`admin` / `interviewer`) and are enforced both by `middleware.ts` (route redirects) and Postgres RLS policies (data access), not just client-side checks.
- Revoking an interviewer (`is_active = false`) blocks their login immediately without deleting their history.
