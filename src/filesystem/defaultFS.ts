import type { FSDirectory, FSFile } from '../stores/filesystemStore';

const now = Date.now();

function file(name: string, content: string, extra?: { icon?: string; opensWith?: string; externalUrl?: string }): FSFile {
  return { type: 'file', name, content, createdAt: now, modifiedAt: now, ...extra };
}

function dir(name: string, children: Record<string, FSDirectory | FSFile>): FSDirectory {
  return { type: 'directory', name, children, createdAt: now };
}

export const defaultFilesystem: FSDirectory = dir('/', {
  home: dir('home', {
    rahul: dir('rahul', {
      'README.md': file('README.md', `# Welcome to RahulOS

This is Rahul Mehta's interactive portfolio, built as a browser-based desktop OS.

Type 'help' in the terminal to see available commands.
Type 'projects' to see what I've been building.

Explore the filesystem to learn more about my work.`),
      '.bashrc': file('.bashrc', `# ~/.bashrc
export PS1="rahul@rahulos:\\w$ "
export EDITOR=vim
export PATH="/usr/local/bin:/usr/bin:/bin"
alias ll="ls -la"
alias gs="git status"
alias gp="git push"
# fortune | cowsay`),
      '.gitconfig': file('.gitconfig', `[user]
  name = Rahul Mehta
  email = rahul@osmoti.com
[init]
  defaultBranch = main
[pull]
  rebase = true`),
      'secrets.txt': file('secrets.txt', `Nice try.

But since you're here, here's a real secret:
I once mass-deployed a typo to production that changed
"Sign In" to "Sign In!" on every button. Nobody noticed
for two weeks. The exclamation mark stayed.

Also, the best coffee in NYC is at Abraco. Tell them I sent you.
They won't know who I am, but the coffee is still good.`),
      projects: dir('projects', {
        osmoti: dir('osmoti', {
          'README.md': file('README.md', `# Osmoti
B2B SaaS platform for ad performance management and optimization.

## Stack
- Frontend: Next.js on Vercel (osmoti-dashboard.vercel.app)
- Backend: Node.js/Express on AWS App Runner (50K lines TypeScript)
- Database: Supabase Postgres (Pro), 33 Prisma models, 41 enums
- AI: Dual LLM pipeline (Anthropic primary, OpenAI fallback)
- Billing: Stripe integration with tiered plans
- Monitoring: Sentry, PostHog analytics

## Architecture
Multi-tenant with organization-scoped data isolation.
Prisma middleware enforces org boundaries on every query.
Rolling demo data system for prospect walkthroughs.
Encrypted token storage for ad platform connections.

## Status: Active, Primary Project
Co-founded with Om Patel. Backed by AWS credits ($10K).`),
          'package.json': file('package.json', `{
  "name": "osmoti-backend",
  "version": "2.1.0",
  "description": "Ad performance management API",
  "main": "dist/index.js",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc -b",
    "test": "vitest run",
    "lint": "eslint src/"
  },
  "dependencies": {
    "@prisma/client": "^5.x",
    "express": "^4.18",
    "stripe": "^14.x",
    "@anthropic-ai/sdk": "^0.20"
  }
}`),
          'architecture.md': file('architecture.md', `# Osmoti Architecture

## System Overview
Multi-tenant B2B SaaS with organization-scoped data isolation.

## Components
- **API Layer:** Express.js with Prisma ORM, org-scoped middleware on every query
- **AI Pipeline:** Dual LLM (Anthropic primary, OpenAI fallback) for ad optimization
- **Auth:** Supabase Auth with RLS-augmented application-layer isolation
- **Billing:** Stripe integration with tiered plans (Free, Pro, Enterprise)
- **Ingestion:** Encrypted token storage for ad platform OAuth connections
- **CI/CD:** GitHub Actions (lint + typecheck -> unit tests w/ Postgres -> build)

## Data Flow
1. User connects ad platform (Google/Meta/TikTok) via OAuth
2. Ingestion service pulls campaign data on schedule
3. AI pipeline analyzes performance, generates optimization recommendations
4. Dashboard renders insights with real-time metrics

## Security
- Prisma middleware enforces org boundaries on every DB query
- Encrypted token storage for third-party credentials
- Rate limiting, CORS, Sentry error tracking`),
          'src': dir('src', {
            'index.ts': file('index.ts', `import express from 'express';
import { setupRoutes } from './routes';
import { orgScopedPrisma } from './middleware/orgContext';

const app = express();
app.use(orgScopedPrisma);
setupRoutes(app);

app.listen(process.env.PORT || 3000);`),
          }),
        }),
        'keep-safe': dir('keep-safe', {
          'README.md': file('README.md', `# Keep Safe / Beach Box Safe Inc.
Hotel and resort product: smart safe + speaker + charger + digital concierge.

## What It Is
A physical product for hotel rooms that combines a safe, Bluetooth speaker,
wireless charger, and an AI-powered digital concierge tablet. Guests interact
with a chatbot that knows the hotel, local restaurants, and activities.

## Tech Stack
- AI Chatbot: React + OpenAI GPT-4 with hotel-specific RAG
- Analytics: Firebase + real-time usage dashboards
- Website: beachbox.co

## Traction
- Secured first $100K hotel partnership
- Co-founded by Rahul Mehta
- Pilot deployed at boutique hotel in Miami`),
        }),
        'analytics-pro': dir('analytics-pro', {
          'README.md': file('README.md', `# Analytics Pro
Marketing analytics platform with AI-powered natural language querying.

## Stack
- Backend: FastAPI + BigQuery + Vertex AI (Gemini 2.0 Flash)
- Frontend: Next.js 16 dashboard (analytics-pro-frontend.vercel.app)
- Storage: Google Cloud Storage for report artifacts
- Auth: Supabase Auth with ES256 JWT verification
- Data: BigQuery dataset with 6 tables, 2,971 rows of marketing data

## Features
- Natural language to SQL: "Show me top campaigns by ROAS last quarter"
- RAG demo with document retrieval and citation
- Real-time dashboard with $1.1M spend, $6.4M revenue, 65K conversions
- Automatic fallback to realistic mock data when backend unavailable`),
        }),
        'smart-legal-contracts': dir('smart-legal-contracts', {
          'README.md': file('README.md', `# Smart Legal Contracts
AI-powered arbitration clause analysis for legal documents.

## Stack
- Backend: FastAPI + sentence-transformers + SQLAlchemy
- AI: Hybrid retriever combining vector search + text-based signal detection
- NLP: Sentence-transformers for document embeddings (lazy-loaded)
- Frontend: React (Arbitration-Frontend)
- Deployed: GCP Cloud Run (2Gi RAM for ML model loading)

## How It Works
Upload a legal document. The system chunks it, generates embeddings,
and uses a hybrid retrieval approach to identify and score arbitration
clauses. Detects signals like mandatory vs. optional arbitration,
venue selection, class action waivers, and governing law provisions.`),
        }),
        'rahulos': dir('rahulos', {
          'README.md': file('README.md', `# RahulOS
You're looking at it.

An interactive browser-based desktop OS serving as a portfolio piece.
Built with React 19, Zustand, Tailwind CSS 4, and Vite 8.

Features:
- Window manager with drag, resize, minimize, maximize
- Virtual filesystem (you're browsing it right now)
- Terminal emulator with real commands
- App launcher dock with macOS-style animations
- Dark/light theme with Catppuccin-inspired colors

The whole thing is about 3,000 lines of TypeScript.
No external UI libraries. No component frameworks. Just React.`),
        }),
      }),
      documents: dir('documents', {
        'resume.txt': file('resume.txt', `RAHUL MEHTA
Software Engineer & Founder

EDUCATION
Georgia Institute of Technology - Computer Science

EXPERIENCE
- Co-Founder, Osmoti: B2B SaaS for ad performance optimization
- Co-Founder, Beach Box Safe Inc: Smart hotel room product ($100K partnership)
- Full-stack development across 15+ shipped projects

SKILLS
TypeScript, React, Node.js, Python, FastAPI, PostgreSQL, Prisma,
AWS, GCP, Vercel, Supabase, BigQuery, Vertex AI, Docker, Terraform

INTERESTS
Building things that ship. Coffee. Not writing cover letters.`),
        'notes.md': file('notes.md', `# Quick Notes

## Ideas
- Add Snake game as easter egg in RahulOS
- Build a "blog" app that renders markdown files
- Music player that plays lo-fi beats

## Reminders
- PostHog key needs to be set for Osmoti frontend
- app.osmoti.com CNAME record pending on Namecheap
- Analytics Pro needs end-to-end auth flow test on prod`),
        'about-me.md': file('about-me.md', `# Rahul Mehta

CS student at Georgia Tech (class of '27), startup founder, and full-stack engineer
who likes building things that actually ship.

I co-founded Osmoti, a B2B SaaS platform for ad performance management, and
Beach Box Safe Inc., a smart hotel room product that landed a $100K partnership.

I've shipped 15+ projects across web, mobile, AI/ML, and hardware. My stack
leans TypeScript/React/Node on the frontend and Python/FastAPI on the backend,
with AWS, GCP, and Supabase for infrastructure.

When I'm not coding, I'm probably drinking coffee, arguing about software
architecture, or building yet another side project that I'll swear is "the last one."`),
        'contact.md': file('contact.md', `# Contact

- GitHub:   https://github.com/rahulmehta25
- LinkedIn: https://linkedin.com/in/rahulmehta25
- Email:    rahul@osmoti.com
- Website:  https://rahul-mehta.me
- Twitter:  https://twitter.com/rahulmehta25`),
      }),
      '.ssh': dir('.ssh', {
        'config': file('config', `Host github.com
  HostName github.com
  User git
  IdentityFile ~/.ssh/id_ed25519

Host osmoti-prod
  HostName ec2-xx-xx-xx-xx.compute-1.amazonaws.com
  User ubuntu
  IdentityFile ~/.ssh/osmoti-key.pem`),
      }),
      '.config': dir('.config', {
        'rahulos.json': file('rahulos.json', `{
  "theme": "catppuccin-mocha",
  "dock": { "position": "bottom", "autohide": false, "iconSize": 48 },
  "terminal": { "fontFamily": "SF Mono", "fontSize": 13, "scrollback": 500 },
  "wallpaper": "gradient-mocha",
  "animations": true
}`),
      }),
      Desktop: dir('Desktop', {
        'welcome.txt': file('welcome.txt', `Welcome to RahulOS!

This is your desktop. You can:
- Double-click files to open them
- Drag windows around
- Use the dock at the bottom to launch apps
- Open the terminal and type 'help' to explore

Have fun poking around.`),
        'resume.pdf': file('resume.pdf', 'Open externally to view resume.', {
          icon: 'document',
          externalUrl: 'https://rahul-mehta.me/resume',
        }),
      }),
      Games: dir('Games', {
        'snake.app': file('snake.app', 'Launch Snake game.', {
          icon: 'game',
          opensWith: 'snake',
        }),
      }),
      Pictures: dir('Pictures', {
        wallpapers: dir('wallpapers', {
          'README.md': file('README.md', 'Wallpaper files go here. Currently using the default gradient.'),
        }),
      }),
    }),
  }),
  etc: dir('etc', {
    'hostname': file('hostname', 'rahulos'),
    'os-release': file('os-release', `NAME="RahulOS"
VERSION="1.0.0"
ID=rahulos
PRETTY_NAME="RahulOS 1.0.0 (Catppuccin)"
HOME_URL="https://os.rahul-mehta.me"
BUG_REPORT_URL="https://github.com/rahulmehta25/RahulOS/issues"`),
    'motd': file('motd', `Welcome to RahulOS v1.0.0

  "The best way to predict the future is to build it."

Type 'help' for available commands.
Type 'projects' for a tour of my work.`),
  }),
  usr: dir('usr', {
    local: dir('local', {
      bin: dir('bin', {
        'neofetch': file('neofetch', '#!/bin/bash\n# system info display'),
        'fortune': file('fortune', '#!/bin/bash\n# random fortune cookie'),
        'cowsay': file('cowsay', '#!/bin/bash\n# talking cow'),
      }),
    }),
  }),
  var: dir('var', {
    log: dir('log', {
      'system.log': file('system.log', `[2026-03-24 08:00:00] RahulOS booted successfully
[2026-03-24 08:00:01] WindowManager initialized
[2026-03-24 08:00:01] Dock loaded with 5 applications
[2026-03-24 08:00:02] Filesystem mounted
[2026-03-24 08:00:02] Terminal ready
[2026-03-24 08:00:03] All systems nominal`),
    }),
  }),
  tmp: dir('tmp', {}),
});
