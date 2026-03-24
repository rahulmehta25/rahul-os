import type { FSNode } from '../../stores/filesystemStore';
import type { EffectType } from '../../stores/effectsStore';
import { pwd, ls, cd, cat, mkdir, touch, rm, echo } from './commands/filesystem';
import { whoami, clear, help, neofetch, date, history } from './commands/system';
import { projects, open, osmoti, fortune, cowsay, matrix, sudoRmRf, exitCmd } from './commands/custom';

export interface CommandResult {
  output: string[];
  isError?: boolean;
  clear?: boolean;
  effect?: EffectType;
}

export interface FilesystemAPI {
  resolvePath: (path: string, cwd: string) => string;
  getNode: (path: string) => FSNode | null;
  listDirectory: (path: string) => FSNode[] | null;
  createFile: (path: string, content?: string) => boolean;
  createDirectory: (path: string) => boolean;
  deleteNode: (path: string) => boolean;
  renameNode: (oldPath: string, newName: string) => boolean;
  updateFileContent: (path: string, content: string) => boolean;
}

export interface CommandContext {
  cwd: string;
  setCwd: (path: string) => void;
  fs: FilesystemAPI;
  history: string[];
  openApp?: (appId: string, title: string) => void;
}

type CommandFn = (args: string[], ctx: CommandContext) => CommandResult;

const commands: Record<string, CommandFn> = {
  pwd,
  ls,
  cd,
  cat,
  mkdir,
  touch,
  rm,
  echo,
  whoami,
  clear,
  help,
  neofetch,
  date,
  history,
  projects,
  open,
  osmoti,
  fortune,
  cowsay,
  matrix,
  exit: exitCmd,
};

function parseInput(input: string): { command: string; args: string[] } {
  const trimmed = input.trim();
  if (!trimmed) return { command: '', args: [] };

  // Handle sudo rm -rf / as special case
  if (/^sudo\s+rm\s+(-rf|-fr)\s+\//.test(trimmed)) {
    return { command: '__sudo_rm_rf', args: [] };
  }

  const tokens: string[] = [];
  let current = '';
  let inSingle = false;
  let inDouble = false;

  for (let i = 0; i < trimmed.length; i++) {
    const ch = trimmed[i];

    if (ch === "'" && !inDouble) {
      inSingle = !inSingle;
      continue;
    }
    if (ch === '"' && !inSingle) {
      inDouble = !inDouble;
      continue;
    }
    if (ch === ' ' && !inSingle && !inDouble) {
      if (current) {
        tokens.push(current);
        current = '';
      }
      continue;
    }
    current += ch;
  }
  if (current) tokens.push(current);

  const command = tokens[0] ?? '';
  const args = tokens.slice(1);
  return { command, args };
}

export function executeCommand(input: string, ctx: CommandContext): CommandResult {
  const { command, args } = parseInput(input);

  if (!command) {
    return { output: [] };
  }

  if (command === '__sudo_rm_rf') {
    return sudoRmRf(args, ctx);
  }

  if (command === 'sudo') {
    return { output: ['sudo: permission denied. This is a portfolio, not a server.'] };
  }

  const handler = commands[command];
  if (!handler) {
    return {
      output: [`rahulsh: command not found: ${command}`, `Type 'help' for available commands.`],
      isError: true,
    };
  }

  return handler(args, ctx);
}
