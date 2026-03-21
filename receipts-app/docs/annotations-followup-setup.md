# Annotation Follow-up Setup

Run `supabase/annotations-followup.sql` in the Supabase SQL editor to enable AI replies to margin notes.

## What it adds
- `author` column so notes can be from the user or the notebook
- `reply_to` column so AI replies can point at a specific user note
