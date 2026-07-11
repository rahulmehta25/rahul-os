# CLAUDE.md — RahulOS

## What this is

Voice-first portfolio piece: React 19 + TypeScript + Vite SPA simulating a Mac
desktop (window manager, Dock, Spotlight-style overlay, 8 apps) entirely
client-side. Voice runs through a tuned ElevenLabs Conversational AI agent
that emits only structured JSON intents (no LLM prose parsing), via Cmd+K.
Deployed to rahulos.app on Vercel. Single-user portfolio piece, not multi-tenant.

## Running it

```bash
npm install
cp .env.example .env.local   # needs VITE_ELEVENLABS_AGENT_ID at minimum
npm run dev                  # vite dev server
npm run build                # tsc -b && vite build — reverified passing 2026-07-11
npm run lint                 # eslint .
```

No test script exists (none in package.json, no framework installed) —
`build` + `lint` are the only gates. Don't assume test coverage that isn't there.

## Visitor Board (Cloud SQL-backed, added 2026-04-18)

Needs `scripts/db-proxy.sh` running in another terminal (Cloud SQL Auth Proxy
to `osmoti-auth:us-east1:portfolio-pg` — see the script for prerequisites), a
`DATABASE_URL` pointed at the proxy, then `npx tsx scripts/serve-visitors.ts`
(port `VISITOR_API_PORT`, default 8787) that the frontend reads via `VITE_API_BASE_URL`.

## Status as of 2026-07-11

Dormant: last commit `084d7dc`, 2026-04-19 (~3 months idle). Tree clean, `main`
synced with `origin/main`, no other branches/worktrees, no open PRs. Build
reverified clean today — pre-existing warning: main JS chunk 948 KB / 271 KB
gzip, over Vite's 500 KB limit, not code-split.

Deeper docs: `docs/ARCHITECTURE.md`, `docs/COMPONENTS.md`, root
`RahulOS-PRD.md`, root `AUDIT-*.md` (4 PRD-compliance passes, 2026-03-24,
all PASS-graded — historical, not reverified since).
