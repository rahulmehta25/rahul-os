import type { CommandContext, CommandResult } from '../shell';

export function whoami(_args: string[], _ctx: CommandContext): CommandResult {
  return { output: ['rahul'] };
}

export function clear(_args: string[], _ctx: CommandContext): CommandResult {
  return { output: [], clear: true };
}

export function help(_args: string[], _ctx: CommandContext): CommandResult {
  return {
    output: [
      '\x1b[1;36mRahulOS Terminal v1.0.0\x1b[0m',
      '',
      '\x1b[1mFilesystem:\x1b[0m',
      '  ls [path]       List directory contents',
      '  cd <path>       Change directory',
      '  cat <file>      Display file contents',
      '  pwd             Print working directory',
      '  mkdir <name>    Create directory',
      '  touch <name>    Create empty file',
      '  rm [-r] <path>  Remove file or directory',
      '  echo <text>     Print text (supports > redirect)',
      '',
      '\x1b[1mSystem:\x1b[0m',
      '  whoami          Current user',
      '  neofetch        System info',
      '  date            Current date and time',
      '  history         Command history',
      '  clear           Clear terminal',
      '  help            Show this help',
      '',
      '\x1b[1mSpecial:\x1b[0m',
      '  projects        Browse my portfolio',
      '  open <app>      Launch an application',
      '  osmoti --status  Osmoti system status',
      '',
      '\x1b[1mEaster Eggs:\x1b[0m',
      '  Try: cowsay, fortune, matrix, sudo rm -rf /',
    ],
  };
}

export function neofetch(_args: string[], _ctx: CommandContext): CommandResult {
  const resolution = typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '1920x1080';
  return {
    output: [
      '',
      '\x1b[1;36m        ██████╗  ██████╗ ███████╗\x1b[0m    \x1b[1mrahul\x1b[0m@\x1b[1mrahulos\x1b[0m',
      '\x1b[1;36m        ██╔══██╗██╔═══██╗██╔════╝\x1b[0m    ─────────────',
      '\x1b[1;36m        ██████╔╝██║   ██║███████╗\x1b[0m    \x1b[1mOS:\x1b[0m RahulOS 1.0.0 (Catppuccin)',
      '\x1b[1;36m        ██╔══██╗██║   ██║╚════██║\x1b[0m    \x1b[1mHost:\x1b[0m Browser/Vite 8.0',
      '\x1b[1;36m        ██║  ██║╚██████╔╝███████║\x1b[0m    \x1b[1mKernel:\x1b[0m React 19.2.4',
      '\x1b[1;36m        ╚═╝  ╚═╝ ╚═════╝ ╚══════╝\x1b[0m    \x1b[1mShell:\x1b[0m rahulsh 1.0',
      '                                    \x1b[1mWM:\x1b[0m Zustand WindowManager',
      '                                    \x1b[1mTheme:\x1b[0m Catppuccin Mocha',
      '                                    \x1b[1mTerminal:\x1b[0m RahulOS Terminal',
      '                                    \x1b[1mPackages:\x1b[0m 3 (npm)',
      `                                    \x1b[1mResolution:\x1b[0m ${resolution}`,
      '                                    \x1b[1mUptime:\x1b[0m since page load',
      '',
      '    \x1b[40m  \x1b[41m  \x1b[42m  \x1b[43m  \x1b[44m  \x1b[45m  \x1b[46m  \x1b[47m  \x1b[0m',
      '',
    ],
  };
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
