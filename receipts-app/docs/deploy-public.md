# Public Deployment Guide (Vercel + Supabase)

## Recommended target
Deploy Receipts publicly on **Vercel**.

## Before deploying
Make sure these features already work in your local/dev Supabase project:
- sign in / sign up
- text entries
- voice upload + transcription
- image notes
- weekly insights
- monthly insights

## Required environment variables in Vercel
Add these in the Vercel project settings:

```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...
```

## Required Supabase SQL
Run these in the Supabase SQL editor before launch:

1. `supabase/schema.sql`
2. `supabase/voice-entry-path.sql`
3. `supabase/voice-storage.sql`
4. `supabase/image-entry-path.sql`
5. `supabase/image-entry-type.sql`
6. `supabase/image-storage.sql`
7. `supabase/insight-scope.sql`

## Required Supabase auth settings
In Supabase Auth settings:

### Site URL
Set this to your production domain, for example:

```text
https://your-app-name.vercel.app
```

### Redirect URLs
Allow at least:

```text
http://localhost:3000
http://localhost:3001
https://your-app-name.vercel.app
```

If you later add magic links, password reset, or OAuth, these URLs matter even more.

## Vercel deployment flow
1. Push `receipts-app` to a GitHub/GitLab/Bitbucket repo.
2. Import the repo into Vercel.
3. Set the root directory to `receipts-app` if needed.
4. Add the environment variables above.
5. Deploy.
6. After deploy, update Supabase Site URL / Redirect URLs to the real production domain.
7. Test sign-in, sign-out, text entry, voice entry, image entry, and insights on the live site.

## Public-launch warnings
This app is usable publicly, but it is still an early product. Before sharing widely, sanity-check:
- empty states
- auth flows
- voice/image upload limits
- OpenAI cost exposure
- copy that still sounds too prototype-ish
- whether sign-up should be open to everyone yet

## Recommended launch posture
Best option: **soft public launch**.

Meaning:
- public URL
- but share it intentionally, not broadly
- use real feedback to tune insight quality before any bigger push
