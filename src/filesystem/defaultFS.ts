import type { FSDirectory, FSFile } from '../stores/filesystemStore';

const now = Date.now();

function file(name: string, content: string): FSFile {
  return { type: 'file', name, content, createdAt: now, modifiedAt: now };
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
