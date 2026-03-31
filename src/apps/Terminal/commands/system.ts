import type { CommandContext, CommandResult } from '../shell';
import { useSettingsStore } from '../../../stores/settingsStore';
import { appRegistry } from '../../registry';

export function whoami(_args: string[], _ctx: CommandContext): CommandResult {
  return { output: ['Rahul Mehta | Startup Founder & AI/ML Engineer | Georgia Tech CS \'27'] };
}

export function clear(_args: string[], _ctx: CommandContext): CommandResult {
  return { output: [], clear: true };
}

export function help(_args: string[], _ctx: CommandContext): CommandResult {
  return {
    output: [
      '',
      '\x1b[1;36m  RahulOS Terminal v1.0\x1b[0m',
      '\x1b[2m  Type a command to get started.\x1b[0m',
      '',
      '\x1b[1m  \u{1F4C1} Filesystem\x1b[0m',
      '     \x1b[1;37mls\x1b[0m  \x1b[1;37mcd\x1b[0m  \x1b[1;37mpwd\x1b[0m  \x1b[1;37mmkdir\x1b[0m  \x1b[1;37mtouch\x1b[0m  \x1b[1;37mrm\x1b[0m  \x1b[1;37mcat\x1b[0m  \x1b[1;37mecho\x1b[0m',
      '',
      '\x1b[1m  \u{1F527} System\x1b[0m',
      '     \x1b[1;37mwhoami\x1b[0m  \x1b[1;37mdate\x1b[0m  \x1b[1;37mneofetch\x1b[0m  \x1b[1;37mclear\x1b[0m  \x1b[1;37mhistory\x1b[0m  \x1b[1;37mhelp\x1b[0m',
      '',
      '\x1b[1m  \u{1F680} Projects\x1b[0m',
      '     \x1b[1;37mprojects\x1b[0m  \x1b[1;37mopen\x1b[0m <app>  \x1b[1;37mosmoti\x1b[0m --status',
      '',
      '\x1b[1m  \u{1F3AE} Fun\x1b[0m',
      '     \x1b[1;37mcowsay\x1b[0m  \x1b[1;37mfortune\x1b[0m  \x1b[1;37mmatrix\x1b[0m  \x1b[1;37mexit\x1b[0m',
      '',
      '\x1b[1m  \u{1F95A} Easter Eggs\x1b[0m',
      '     \x1b[2mtry sudo rm -rf /, or find the secrets...\x1b[0m',
      '',
    ],
  };
}

export function neofetch(_args: string[], _ctx: CommandContext): CommandResult {
  const resolution = typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1920x1080';
  const settings = useSettingsStore.getState();
  const appCount = Object.keys(appRegistry).length;

  const uptimeMs = typeof performance !== 'undefined' ? performance.now() : 0;
  const uptimeSec = Math.floor(uptimeMs / 1000);
  const uptimeMin = Math.floor(uptimeSec / 60);
  const uptimeHr = Math.floor(uptimeMin / 60);
  let uptimeStr: string;
  if (uptimeHr > 0) {
    uptimeStr = `${uptimeHr} hour${uptimeHr !== 1 ? 's' : ''}, ${uptimeMin % 60} min${uptimeMin % 60 !== 1 ? 's' : ''}`;
  } else if (uptimeMin > 0) {
    uptimeStr = `${uptimeMin} min${uptimeMin !== 1 ? 's' : ''}`;
  } else {
    uptimeStr = `${uptimeSec} sec${uptimeSec !== 1 ? 's' : ''}`;
  }

  let memoryStr = '64MB / 512MB';
  const perfAny = performance as unknown as Record<string, unknown>;
  if (perfAny.memory) {
    const mem = perfAny.memory as { usedJSHeapSize: number; jsHeapSizeLimit: number };
    const usedMB = Math.round(mem.usedJSHeapSize / 1024 / 1024);
    const totalMB = Math.round(mem.jsHeapSizeLimit / 1024 / 1024);
    memoryStr = `${usedMB}MB / ${totalMB}MB`;
  }

  const themeStr = settings.theme === 'dark' ? 'Sequoia Dark' : 'Sequoia Light';

  const art: string[] = [
    '\x1b[1;36m        \u2588\u2588\u2588\u2588\u2588\u2588\u2557  \u2588\u2588\u2588\u2588\u2588\u2588\u2557 \u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\x1b[0m',
    '\x1b[1;36m        \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2554\u2550\u2550\u2550\u2550\u255D\x1b[0m',
    '\x1b[1;34m        \u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2551   \u2588\u2588\u2551\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2557\x1b[0m',
    '\x1b[1;34m        \u2588\u2588\u2554\u2550\u2550\u2588\u2588\u2557\u2588\u2588\u2551   \u2588\u2588\u2551\u255A\u2550\u2550\u2550\u2550\u2588\u2588\u2551\x1b[0m',
    '\x1b[1;36m        \u2588\u2588\u2551  \u2588\u2588\u2551\u255A\u2588\u2588\u2588\u2588\u2588\u2588\u2554\u255D\u2588\u2588\u2588\u2588\u2588\u2588\u2588\u2551\x1b[0m',
    '\x1b[1;36m        \u255A\u2550\u255D  \u255A\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u255D \u255A\u2550\u2550\u2550\u2550\u2550\u2550\u255D\x1b[0m',
    '         \x1b[2;36m      R a h u l O S\x1b[0m',
  ];

  const info: string[] = [
    '\x1b[1;36mrahul\x1b[0m@\x1b[1;36mrahulos\x1b[0m',
    '\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500',
    `\x1b[1;36mOS:\x1b[0m RahulOS 1.0 Sequoia`,
    '\x1b[1;36mHost:\x1b[0m rahul@rahulos',
    '\x1b[1;36mKernel:\x1b[0m WebKit/React 19',
    `\x1b[1;36mUptime:\x1b[0m ${uptimeStr}`,
    `\x1b[1;36mPackages:\x1b[0m ${appCount} (apps)`,
    '\x1b[1;36mShell:\x1b[0m rahulsh 1.0',
    `\x1b[1;36mResolution:\x1b[0m ${resolution}`,
    '\x1b[1;36mDE:\x1b[0m RahulOS Desktop',
    '\x1b[1;36mWM:\x1b[0m Zustand Window Manager',
    `\x1b[1;36mTheme:\x1b[0m ${themeStr}`,
    '\x1b[1;36mTerminal:\x1b[0m RahulOS Terminal',
    '\x1b[1;36mCPU:\x1b[0m Apple Silicon (simulated)',
    `\x1b[1;36mMemory:\x1b[0m ${memoryStr}`,
  ];

  const visLen = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, '').length;
  const artWidth = Math.max(...art.map(visLen));
  const gap = '    ';
  const maxLines = Math.max(art.length, info.length);
  const output: string[] = [''];

  for (let i = 0; i < maxLines; i++) {
    const a = i < art.length ? art[i] : '';
    const inf = i < info.length ? info[i] : '';
    const pad = ' '.repeat(artWidth - visLen(a));
    output.push(a + pad + gap + inf);
  }

  output.push('');
  output.push('        \x1b[40m   \x1b[41m   \x1b[42m   \x1b[43m   \x1b[44m   \x1b[45m   \x1b[46m   \x1b[47m   \x1b[0m');
  output.push('');

  return { output };
}

export function date(_args: string[], _ctx: CommandContext): CommandResult {
  const now = new Date();
  return { output: [now.toString()] };
}

export function history(_args: string[], ctx: CommandContext): CommandResult {
  if (ctx.history.length === 0) {
    return { output: ['No history yet.'] };
  }
  const lines = ctx.history.map((cmd, i) => `  ${String(i + 1).padStart(4)}  ${cmd}`);
  return { output: lines };
}
