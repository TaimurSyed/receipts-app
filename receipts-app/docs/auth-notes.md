# Auth Notes

## Current behavior
- `/sign-in` and `/sign-up` now exist.
- If Supabase env vars are missing, the UI explains that auth is ready but not connected.
- Once env vars are present, sign-up and password sign-in use Supabase Auth.

## Next auth improvements
- add magic-link flow
- protect `/app` with middleware or a stricter server redirect path
- create a profile row on first sign-up
- add password reset
