# RahulOS

A voice-first operating system shell for the Mac. Built as an exploration of what a desktop feels like when the primary input is your voice.

## What it does

- Speak a command, the shell dispatches to the right app. "Open my inbox" routes to Mail. "Play my focus playlist" routes to Music. The intent router is a JSON schema, not an LLM prose parse.
- Desktop environment simulated in React with a real window manager, Spotlight-style command palette, terminal, and a logs panel so you can see what the voice layer decided.
- All voice goes through a tuned ElevenLabs Conversational AI agent. It only emits structured JSON intents, which keeps the UI fast and the error modes bounded.

## Tech

- React 18, TypeScript, Vite
- ElevenLabs Conversational AI SDK
- Tailwind, Framer Motion for the window transitions
- Deployed on Vercel at [rahulos.app](https://rahulos.app)

## Screenshots

![Desktop shell with three open windows](docs/screenshots/desktop.png)
![Voice command overlay triggered from Cmd-Space](docs/screenshots/voice-overlay.png)
![Intent log showing resolved JSON](docs/screenshots/intent-log.png)
![Terminal app with a live shell session](docs/screenshots/terminal.png)

## How to run

```bash
git clone https://github.com/rmehta2500/rahulos
cd rahulos
npm install
cp .env.example .env.local
# add VITE_ELEVENLABS_AGENT_ID
npm run dev
```

## Design notes

This is not an "AI shell that tries to do everything." The agent only resolves intents to a fixed vocabulary of commands. Anything ambiguous goes to a fallback prompt. That constraint is what makes it usable.

See `RahulOS-PRD.md` and the `AUDIT-*.md` files for the full design brief.

## Roadmap

- Spotlight command palette enrichments
- Per-app scriptable actions
- iOS companion for Shortcut-style triggers

MIT licensed.
