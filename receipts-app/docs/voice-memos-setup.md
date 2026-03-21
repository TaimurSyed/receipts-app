# Voice Memo Setup

Run `supabase/voice-storage.sql` in the Supabase SQL editor to create the private `voice-memos` storage bucket and its policies.

## What it enables
- users uploading their own voice memos
- private per-user access to those uploads

## App behavior
The app stores the uploaded file in Supabase Storage, transcribes it with OpenAI, then saves a `voice` entry whose content is the transcript.
