# Supabase Setup

## 1. Create a Supabase project
Create a new project in Supabase, then copy:
- Project URL
- anon public key

## 2. Add env vars
Create `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 3. Apply schema
Run the SQL in `supabase/schema.sql` inside the Supabase SQL editor.

## 4. Enable auth
Start with email auth or magic links.

## 5. Current behavior
- Without env vars, the app falls back to mock data.
- With env vars + auth, `/app` can save text entries to the `entries` table.

## 6. Recommended next additions
- sign-in / sign-up pages
- profile onboarding
- insight generation job
- storage bucket for voice notes
