import type { CommandContext, CommandResult } from '../shell';

export function projects(_args: string[], _ctx: CommandContext): CommandResult {
  return {
    output: [
      '',
      '\x1b[1;36m  Rahul Mehta — Project Portfolio\x1b[0m',
      '',
      '  ┌──────────────────────────┬────────────┬────────────────────────────────────┐',
      '  │ \x1b[1mProject\x1b[0m                    │ \x1b[1mStatus\x1b[0m     │ \x1b[1mStack\x1b[0m                              │',
      '  ├──────────────────────────┼────────────┼────────────────────────────────────┤',
      '  │ \x1b[1;33mOsmoti\x1b[0m                     │ \x1b[1;32m● Active\x1b[0m   │ Next.js, Express, Prisma, AWS      │',
      '  │ \x1b[1;33mKeep Safe\x1b[0m                  │ \x1b[1;32m● Active\x1b[0m   │ React, OpenAI, Firebase            │',
      '  │ \x1b[1;33mAnalytics Pro\x1b[0m              │ \x1b[1;32m● Active\x1b[0m   │ FastAPI, BigQuery, Vertex AI       │',
      '  │ \x1b[1;33mSmart Legal Contracts\x1b[0m      │ \x1b[1;32m● Active\x1b[0m   │ FastAPI, sentence-transformers     │',
      '  │ \x1b[1;33mRahulOS\x1b[0m                    │ \x1b[1;32m● Active\x1b[0m   │ React 19, Zustand, Tailwind        │',
      '  │ \x1b[1;37mVoice Visualizer\x1b[0m           │ \x1b[1;34m○ Complete\x1b[0m │ Vanilla JS, Web Audio API          │',
      '  │ \x1b[1;37mScreenshot Reviewer\x1b[0m        │ \x1b[1;32m● Active\x1b[0m   │ SwiftUI, Vision, macOS native      │',
      '  │ \x1b[1;37mACP Dashboard\x1b[0m              │ \x1b[1;32m● Active\x1b[0m   │ Next.js, SSE, Agent orchestration  │',
      '  └──────────────────────────┴────────────┴────────────────────────────────────┘',
      '',
      '  \x1b[2mRun "cat ~/projects/<name>/README.md" for details on any project.\x1b[0m',
      '',
    ],
  };
}

export function open(args: string[], ctx: CommandContext): CommandResult {
  const appName = args[0]?.toLowerCase();
  if (!appName) {
    return {
      output: [
        'Usage: open <app>',
        '',
        'Available apps: terminal, files, texteditor, browser, settings',
      ],
    };
  }

  const appMap: Record<string, { id: string; name: string }> = {
    terminal: { id: 'terminal', name: 'Terminal' },
    files: { id: 'filemanager', name: 'Files' },
    filemanager: { id: 'filemanager', name: 'Files' },
    texteditor: { id: 'texteditor', name: 'TextEdit' },
    textedit: { id: 'texteditor', name: 'TextEdit' },
    browser: { id: 'browser', name: 'Safari' },
    safari: { id: 'browser', name: 'Safari' },
    settings: { id: 'settings', name: 'Settings' },
  };

  const app = appMap[appName];
  if (!app) {
    return { output: [`open: application '${appName}' not found`], isError: true };
  }

  if (ctx.openApp) {
    ctx.openApp(app.id, app.name);
  }
  return { output: [`Opening ${app.name}...`] };
}

export function osmoti(args: string[], _ctx: CommandContext): CommandResult {
  if (args.includes('--status')) {
    return {
      output: [
        '',
        '\x1b[1;33m  ╔═══════════════════════════════════╗\x1b[0m',
        '\x1b[1;33m  ║       OSMOTI SYSTEM STATUS        ║\x1b[0m',
        '\x1b[1;33m  ╚═══════════════════════════════════╝\x1b[0m',
        '',
        '  \x1b[1mAPI Server:\x1b[0m      \x1b[1;32m● Online\x1b[0m  (AWS App Runner)',
        '  \x1b[1mDashboard:\x1b[0m       \x1b[1;32m● Online\x1b[0m  (Vercel)',
        '  \x1b[1mDatabase:\x1b[0m        \x1b[1;32m● Online\x1b[0m  (Supabase Pro)',
        '  \x1b[1mAI Pipeline:\x1b[0m     \x1b[1;32m● Online\x1b[0m  (Anthropic + OpenAI)',
        '  \x1b[1mStripe Billing:\x1b[0m  \x1b[1;32m● Online\x1b[0m',
        '  \x1b[1mPostHog:\x1b[0m         \x1b[1;33m● Pending\x1b[0m (key not set)',
        '',
        '  \x1b[1mModels:\x1b[0m     33 Prisma models, 41 enums',
        '  \x1b[1mTests:\x1b[0m      273 passing (15 test files)',
        '  \x1b[1mCoverage:\x1b[0m   ~5% (target: 30% Q2 2026)',
        '  \x1b[1mCI/CD:\x1b[0m      GitHub Actions (lint → test → build)',
        '',
      ],
    };
  }
  return { output: ['Usage: osmoti --status'] };
}

const fortunes = [
  '"The best way to predict the future is to build it." — Alan Kay',
  '"First, solve the problem. Then, write the code." — John Johnson',
  '"Simplicity is the soul of efficiency." — Austin Freeman',
  '"Talk is cheap. Show me the code." — Linus Torvalds',
  '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." — Martin Fowler',
  '"Programs must be written for people to read, and only incidentally for machines to execute." — Abelson & Sussman',
  '"The most disastrous thing that you can ever learn is your first programming language." — Alan Kay',
  '"It works on my machine." — Every developer, at least once',
  '"There are only two hard things in Computer Science: cache invalidation and naming things." — Phil Karlton',
  '"If debugging is the process of removing bugs, then programming must be the process of putting them in." — Edsger Dijkstra',
];

export function fortune(_args: string[], _ctx: CommandContext): CommandResult {
  const f = fortunes[Math.floor(Math.random() * fortunes.length)];
  return { output: ['', `  ${f}`, ''] };
}

export function cowsay(args: string[], _ctx: CommandContext): CommandResult {
  const msg = args.length > 0 ? args.join(' ') : 'Moo! Welcome to RahulOS!';
  const border = '─'.repeat(msg.length + 2);
  return {
    output: [
      ` ┌${border}┐`,
      ` │ ${msg} │`,
      ` └${border}┘`,
      '        \\   ^__^',
      '         \\  (oo)\\_______',
      '            (__)\\       )\\/\\',
      '                ||----w |',
      '                ||     ||',
    ],
  };
}

export function matrix(_args: string[], _ctx: CommandContext): CommandResult {
  const chars = 'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:.="*+-<>¦|';
  const lines: string[] = ['', '\x1b[1;32m'];
  for (let i = 0; i < 12; i++) {
    let line = '  ';
    for (let j = 0; j < 48; j++) {
      line += chars[Math.floor(Math.random() * chars.length)];
    }
    lines.push(line);
  }
  lines.push('\x1b[0m');
  lines.push('');
  lines.push('\x1b[1;32m  Wake up, Neo...\x1b[0m');
  lines.push('  \x1b[1;32mThe Matrix has you...\x1b[0m');
  lines.push('');
  return { output: lines };
}

export function sudoRmRf(_args: string[], _ctx: CommandContext): CommandResult {
  return {
    output: [
      '',
      '\x1b[1;31m  ⚠ CRITICAL SYSTEM ERROR ⚠\x1b[0m',
      '',
      '  Permission denied. Nice try though.',
      '',
      '  Did you really think I would let you',
      '  destroy my portfolio? I spent weeks',
      '  on this thing.',
      '',
      '  \x1b[2m  ...okay it was mostly Claude Code but still.\x1b[0m',
      '',
    ],
  };
}

export function exitCmd(_args: string[], _ctx: CommandContext): CommandResult {
  return {
    output: [
      '',
      '  There is no escape from RahulOS.',
      '  You live here now.',
      '',
      '  \x1b[2m(But you can close this window with the red button.)\x1b[0m',
      '',
    ],
  };
}
