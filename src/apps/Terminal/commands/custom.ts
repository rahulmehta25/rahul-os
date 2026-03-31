import type { CommandContext, CommandResult } from '../shell';

export function projects(_args: string[], _ctx: CommandContext): CommandResult {
  const projectList = [
    { name: 'Osmoti', status: 'Active', desc: 'B2B SaaS for ad performance management & optimization', stack: 'Next.js \u00B7 Express \u00B7 Prisma \u00B7 AWS', link: 'osmoti.com' },
    { name: 'Keep Safe', status: 'Active', desc: 'Hotel/resort smart safe with speaker, charger & AI concierge', stack: 'React \u00B7 OpenAI \u00B7 Firebase', link: 'beachbox.co' },
    { name: 'Analytics Pro', status: 'Active', desc: 'Marketing analytics platform with AI-powered query & RAG', stack: 'FastAPI \u00B7 BigQuery \u00B7 Vertex AI', link: 'analytics-pro-frontend.vercel.app' },
    { name: 'RahulOS', status: 'Active', desc: "Web-based macOS desktop environment (you're using it!)", stack: 'React 19 \u00B7 Zustand \u00B7 Tailwind \u00B7 Vite', link: '' },
    { name: 'Screenshot Reviewer', status: 'Active', desc: 'Native macOS app for reviewing & cleaning screenshots', stack: 'SwiftUI \u00B7 Vision \u00B7 macOS native', link: '' },
    { name: 'ACP Dashboard', status: 'Active', desc: 'Jarvis-style mission control for AI coding agents', stack: 'Next.js \u00B7 SSE \u00B7 Agent orchestration', link: '' },
    { name: 'Voice Visualizer', status: 'Complete', desc: 'Real-time audio visualization, zero dependencies', stack: 'Vanilla JS \u00B7 Web Audio API \u00B7 Canvas', link: 'voice-visualizer-eight.vercel.app' },
  ];

  const lines: string[] = [
    '',
    '\x1b[1;36m  \u2500\u2500\u2500 Project Portfolio \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\x1b[0m',
    '',
  ];

  for (const p of projectList) {
    const statusColor = p.status === 'Active' ? '\x1b[1;32m\u25CF' : '\x1b[1;34m\u25CB';
    lines.push(`  \x1b[1;33m${p.name}\x1b[0m  ${statusColor} ${p.status}\x1b[0m`);
    lines.push(`  ${p.desc}`);
    lines.push(`  \x1b[2m${p.stack}\x1b[0m`);
    if (p.link) {
      lines.push(`  \x1b[35m${p.link}\x1b[0m`);
    }
    lines.push('');
  }

  lines.push('\x1b[2m  Run "cat ~/projects/<name>/README.md" for details.\x1b[0m');
  lines.push('');

  return { output: lines };
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
  '"The best way to predict the future is to build it." \x1b[2m\u2014 Alan Kay\x1b[0m',
  '"First, solve the problem. Then, write the code." \x1b[2m\u2014 John Johnson\x1b[0m',
  '"Simplicity is the soul of efficiency." \x1b[2m\u2014 Austin Freeman\x1b[0m',
  '"Talk is cheap. Show me the code." \x1b[2m\u2014 Linus Torvalds\x1b[0m',
  '"Any fool can write code that a computer can understand. Good programmers write code that humans can understand." \x1b[2m\u2014 Martin Fowler\x1b[0m',
  '"Programs must be written for people to read, and only incidentally for machines to execute." \x1b[2m\u2014 Abelson & Sussman\x1b[0m',
  '"The most disastrous thing that you can ever learn is your first programming language." \x1b[2m\u2014 Alan Kay\x1b[0m',
  '"It works on my machine." \x1b[2m\u2014 Every developer, at least once\x1b[0m',
  '"There are only two hard things in Computer Science: cache invalidation and naming things." \x1b[2m\u2014 Phil Karlton\x1b[0m',
  '"If debugging is the process of removing bugs, then programming must be the process of putting them in." \x1b[2m\u2014 Edsger Dijkstra\x1b[0m',
  '"The only way to do great work is to love what you do." \x1b[2m\u2014 Steve Jobs\x1b[0m',
  '"Measuring programming progress by lines of code is like measuring aircraft building progress by weight." \x1b[2m\u2014 Bill Gates\x1b[0m',
  '"The best error message is the one that never shows up." \x1b[2m\u2014 Thomas Fuchs\x1b[0m',
  '"Code is like humor. When you have to explain it, it\'s bad." \x1b[2m\u2014 Cory House\x1b[0m',
];

export function fortune(_args: string[], _ctx: CommandContext): CommandResult {
  const f = fortunes[Math.floor(Math.random() * fortunes.length)];
  return { output: ['', `  ${f}`, ''] };
}

export function cowsay(args: string[], _ctx: CommandContext): CommandResult {
  const msg = args.length > 0 ? args.join(' ') : 'Moo! Welcome to RahulOS!';
  const border = '\u2500'.repeat(msg.length + 2);
  return {
    output: [
      `\x1b[1;33m \u250C${border}\u2510\x1b[0m`,
      `\x1b[1;33m \u2502\x1b[0m ${msg} \x1b[1;33m\u2502\x1b[0m`,
      `\x1b[1;33m \u2514${border}\u2518\x1b[0m`,
      '\x1b[1;37m        \\   ^__^\x1b[0m',
      '\x1b[1;37m         \\  \x1b[1;35m(oo)\x1b[1;37m\\_______\x1b[0m',
      '\x1b[1;37m            (__)\x1b[0m\\       )\\/\\',
      '                ||----w |',
      '                ||     ||',
    ],
  };
}

export function matrix(_args: string[], _ctx: CommandContext): CommandResult {
  return { output: ['\x1b[1;32mEntering the Matrix...\x1b[0m'], effect: 'matrix' };
}

export function sudoRmRf(_args: string[], _ctx: CommandContext): CommandResult {
  return {
    output: ['\x1b[1;31m  rm: destroying filesystem...\x1b[0m'],
    effect: 'kernelPanic',
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
