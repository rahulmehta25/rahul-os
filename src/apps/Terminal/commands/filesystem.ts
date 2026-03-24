import type { CommandContext, CommandResult } from '../shell';

export function pwd(_args: string[], ctx: CommandContext): CommandResult {
  return { output: [ctx.cwd] };
}

export function ls(args: string[], ctx: CommandContext): CommandResult {
  const showAll = args.includes('-a') || args.includes('-la') || args.includes('-al');
  const showLong = args.includes('-l') || args.includes('-la') || args.includes('-al');
  const target = args.find((a) => !a.startsWith('-')) ?? ctx.cwd;
  const absPath = ctx.fs.resolvePath(target, ctx.cwd);
  const entries = ctx.fs.listDirectory(absPath);

  if (!entries) {
    return { output: [`ls: cannot access '${target}': No such file or directory`], isError: true };
  }

  const items = showAll
    ? [
        { type: 'directory' as const, name: '.' },
        { type: 'directory' as const, name: '..' },
        ...entries,
      ]
    : entries.filter((e) => !e.name.startsWith('.'));

  if (items.length === 0) return { output: [] };

  const isExecutable = (name: string, path: string) =>
    name.endsWith('.app') || path.startsWith('/usr/local/bin/');

  if (showLong) {
    const lines = items.map((item) => {
      const isDir = item.type === 'directory';
      const exec = !isDir && isExecutable(item.name, absPath + '/' + item.name);
      const perms = isDir ? 'drwxr-xr-x' : exec ? '-rwxr-xr-x' : '-rw-r--r--';
      const size = item.type === 'file' ? String(item.content.length).padStart(6) : '  4096';
      const date = 'Mar 24 08:00';
      const colorName = isDir
        ? `\x1b[1;34m${item.name}/\x1b[0m`
        : exec
          ? `\x1b[1;32m${item.name}\x1b[0m`
          : item.name;
      return `${perms}  1 rahul rahul ${size} ${date} ${colorName}`;
    });
    return { output: lines };
  }

  const coloredNames = items.map((item) => {
    if (item.type === 'directory') return `\x1b[1;34m${item.name}/\x1b[0m`;
    if (isExecutable(item.name, absPath + '/' + item.name)) return `\x1b[1;32m${item.name}\x1b[0m`;
    return item.name;
  });
  return { output: [coloredNames.join('  ')] };
}

export function cd(args: string[], ctx: CommandContext): CommandResult {
  const target = args[0] ?? '~';
  const absPath = ctx.fs.resolvePath(target, ctx.cwd);
  const node = ctx.fs.getNode(absPath);

  if (!node) {
    return { output: [`cd: no such file or directory: ${target}`], isError: true };
  }
  if (node.type !== 'directory') {
    return { output: [`cd: not a directory: ${target}`], isError: true };
  }

  ctx.setCwd(absPath);
  return { output: [] };
}

export function cat(args: string[], ctx: CommandContext): CommandResult {
  if (args.length === 0) {
    return { output: ['cat: missing operand'], isError: true };
  }

  const allOutput: string[] = [];
  for (const arg of args) {
    const absPath = ctx.fs.resolvePath(arg, ctx.cwd);
    const node = ctx.fs.getNode(absPath);

    if (!node) {
      allOutput.push(`cat: ${arg}: No such file or directory`);
      continue;
    }
    if (node.type === 'directory') {
      allOutput.push(`cat: ${arg}: Is a directory`);
      continue;
    }
    allOutput.push(...node.content.split('\n'));
  }
  return { output: allOutput };
}

export function mkdir(args: string[], ctx: CommandContext): CommandResult {
  if (args.length === 0) {
    return { output: ['mkdir: missing operand'], isError: true };
  }
  for (const arg of args) {
    const absPath = ctx.fs.resolvePath(arg, ctx.cwd);
    if (!ctx.fs.createDirectory(absPath)) {
      return { output: [`mkdir: cannot create directory '${arg}': File exists or parent not found`], isError: true };
    }
  }
  return { output: [] };
}

export function touch(args: string[], ctx: CommandContext): CommandResult {
  if (args.length === 0) {
    return { output: ['touch: missing operand'], isError: true };
  }
  for (const arg of args) {
    const absPath = ctx.fs.resolvePath(arg, ctx.cwd);
    const existing = ctx.fs.getNode(absPath);
    if (!existing) {
      if (!ctx.fs.createFile(absPath)) {
        return { output: [`touch: cannot touch '${arg}': No such file or directory`], isError: true };
      }
    }
  }
  return { output: [] };
}

export function rm(args: string[], ctx: CommandContext): CommandResult {
  const recursive = args.includes('-r') || args.includes('-rf') || args.includes('-fr');
  const targets = args.filter((a) => !a.startsWith('-'));

  if (targets.length === 0) {
    return { output: ['rm: missing operand'], isError: true };
  }

  for (const target of targets) {
    const absPath = ctx.fs.resolvePath(target, ctx.cwd);
    const node = ctx.fs.getNode(absPath);

    if (!node) {
      return { output: [`rm: cannot remove '${target}': No such file or directory`], isError: true };
    }
    if (node.type === 'directory' && !recursive) {
      return { output: [`rm: cannot remove '${target}': Is a directory (use -r)`], isError: true };
    }
    if (!ctx.fs.deleteNode(absPath)) {
      return { output: [`rm: cannot remove '${target}'`], isError: true };
    }
  }
  return { output: [] };
}

export function echo(args: string[], ctx: CommandContext): CommandResult {
  const joined = args.join(' ');

  const redirectIndex = joined.indexOf('>');
  if (redirectIndex !== -1) {
    const content = joined.slice(0, redirectIndex).trim();
    const filePath = joined.slice(redirectIndex + 1).trim();
    if (!filePath) {
      return { output: ['echo: syntax error near unexpected token'], isError: true };
    }
    const absPath = ctx.fs.resolvePath(filePath, ctx.cwd);
    const existing = ctx.fs.getNode(absPath);
    if (existing && existing.type === 'file') {
      ctx.fs.updateFileContent(absPath, content);
    } else if (!existing) {
      ctx.fs.createFile(absPath, content);
    } else {
      return { output: [`echo: ${filePath}: Is a directory`], isError: true };
    }
    return { output: [] };
  }

  return { output: [joined] };
}
