# AI Setup

## What exists now
- An insights page at `/insights`
- Server-side insight reads from the `insights` table
- OpenAI-ready helper code for generation

## To enable real AI generation
Add this to `.env.local`:

```bash
OPENAI_API_KEY=your-openai-api-key
```

## Recommended next step
Build a server action or cron job that:
1. reads recent entries
2. sends them to OpenAI with a structured prompt
3. stores pattern / contradiction / weekly receipt rows in `insights`
