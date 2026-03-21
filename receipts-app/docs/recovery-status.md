# Recovery Status

## Current code health
- `npm run build` passes on Next.js 16.2.1.
- Main routes compile successfully: `/`, `/app`, `/app/new-entry`, `/app/timeline`, `/insights`, `/journal/[date]`, `/journal/archive`, `/journal/month/[month]`, `/sign-in`, `/sign-up`.

## Implemented in code
- Text entries
- Voice memo recording/upload UI
- Voice upload to Supabase Storage (`voice-memos`)
- Voice transcription via OpenAI (`gpt-4o-mini-transcribe`)
- Image upload UI
- Image upload to Supabase Storage (`image-notes`)
- Signed playback URLs for voice and images
- AI insight generation with tone preference + annotation memory
- Multimodal image-aware insight generation

## Likely remaining setup in Supabase
The app code expects these DB/storage changes to exist:

1. Base schema:
   - `supabase/schema.sql`
2. Voice support:
   - `supabase/voice-entry-path.sql`
   - `supabase/voice-storage.sql`
3. Image support:
   - `supabase/image-entry-path.sql`
   - `supabase/image-entry-type.sql`
   - `supabase/image-storage.sql`

## Important mismatch to note
- `supabase/schema.sql` still constrains `entries.type` to `('text', 'voice')`.
- The app code now inserts `type = 'image'` for picture notes.
- Therefore `supabase/image-entry-type.sql` must be applied or image inserts will fail.

## Most likely next step
- Verify/apply the missing Supabase SQL files above.
- Then test in this order:
  1. text entry save
  2. voice memo upload + transcription
  3. image upload
  4. insight generation

## Git note
- `supabase/image-entry-type.sql` was untracked during review.
- Consider committing it once confirmed.
