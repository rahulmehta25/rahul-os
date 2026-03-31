import { useState, useRef, useEffect, useCallback } from 'react';
import { useFilesystemStore, initializeFilesystem } from '../../stores/filesystemStore';
import { useWindowStore } from '../../stores/windowStore';
import { useEffectsStore } from '../../stores/effectsStore';
import { defaultFilesystem } from '../../filesystem/defaultFS';
import { executeCommand } from './shell';
import type { FilesystemAPI } from './shell';

interface TerminalLine {
  id: number;
  content: string;
  isPrompt?: boolean;
}

let lineCounter = 0;
let fsInitialized = false;

function parseAnsi(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /\x1b\[([0-9;]*)m/g;
  let lastIndex = 0;
  let currentStyle: React.CSSProperties = {};
  let match: RegExpExecArray | null;

  const colorMap: Record<string, string> = {
    '30': '#3a3a3c', '31': '#FF453A', '32': '#32D74B', '33': '#FFD60A',
    '34': '#0A84FF', '35': '#BF5AF2', '36': '#64D2FF', '37': '#f5f5f7',
    '40': '#3a3a3c', '41': '#FF453A', '42': '#32D74B', '43': '#FFD60A',
    '44': '#0A84FF', '45': '#BF5AF2', '46': '#64D2FF', '47': '#d1d1d6',
  };

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`${lastIndex}-t`} style={{ ...currentStyle }}>
          {text.slice(lastIndex, match.index)}
        </span>,
      );
    }

    const codes = match[1].split(';');
    for (const code of codes) {
      if (code === '0' || code === '') {
        currentStyle = {};
      } else if (code === '1') {
        currentStyle = { ...currentStyle, fontWeight: 'bold' };
      } else if (code === '2') {
        currentStyle = { ...currentStyle, opacity: 0.6 };
      } else if (colorMap[code]) {
        const num = parseInt(code, 10);
        if (num >= 30 && num <= 37) {
          currentStyle = { ...currentStyle, color: colorMap[code] };
        } else if (num >= 40 && num <= 47) {
          currentStyle = { ...currentStyle, backgroundColor: colorMap[code], padding: '0 2px' };
        }
      }
    }

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(
      <span key={`${lastIndex}-t`} style={{ ...currentStyle }}>
        {text.slice(lastIndex)}
      </span>,
    );
  }

  return parts.length > 0 ? parts : [text];
}

function promptPrefix(cwd: string): string {
  const display = cwd.replace('/home/rahul', '~');
  return `\x1b[1;32mrahul@rahulos\x1b[0m\x1b[37m:\x1b[0m\x1b[1;34m${display}\x1b[0m\x1b[37m$ \x1b[0m`;
}

export function Terminal({ windowId }: { windowId: string }) {
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [input, setInput] = useState('');
  const [cwd, setCwd] = useState('/home/rahul');
  const [historyList, setHistoryList] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fsStore = useFilesystemStore();
  const openWindow = useWindowStore((s) => s.openWindow);
  const triggerEffect = useEffectsStore((s) => s.triggerEffect);

  useEffect(() => {
    if (!fsInitialized) {
      initializeFilesystem(defaultFilesystem);
      fsInitialized = true;
    }
  }, []);

  useEffect(() => {
    const motd = fsStore.getNode('/etc/motd');
    const welcomeLines: TerminalLine[] = [];
    if (motd && motd.type === 'file') {
      for (const line of motd.content.split('\n')) {
        welcomeLines.push({ id: ++lineCounter, content: line });
      }
    }
    welcomeLines.push({ id: ++lineCounter, content: '' });
    setLines(welcomeLines);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines, input]);

  const fsApi: FilesystemAPI = {
    resolvePath: fsStore.resolvePath,
    getNode: fsStore.getNode,
    listDirectory: fsStore.listDirectory,
    createFile: fsStore.createFile,
    createDirectory: fsStore.createDirectory,
    deleteNode: fsStore.deleteNode,
    renameNode: fsStore.renameNode,
    updateFileContent: fsStore.updateFileContent,
  };

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    const promptLine: TerminalLine = {
      id: ++lineCounter,
      content: promptPrefix(cwd) + input,
      isPrompt: true,
    };

    if (!trimmed) {
      setLines((prev) => [...prev, promptLine]);
      setInput('');
      return;
    }

    setHistoryList((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const result = executeCommand(trimmed, {
      cwd,
      setCwd: (newCwd: string) => {
        setCwd(newCwd);
        useWindowStore.getState().setTitle(windowId, `Terminal — ${newCwd.replace('/home/rahul', '~')}`);
      },
      fs: fsApi,
      history: [...historyList, trimmed],
      openApp: (appId: string, title: string) => {
        openWindow(appId, title);
      },
    });

    if (result.clear) {
      setLines([]);
      setInput('');
      return;
    }

    if (result.effect) {
      triggerEffect(result.effect);
    }

    const outputLines: TerminalLine[] = result.output.map((line) => ({
      id: ++lineCounter,
      content: line,
    }));

    const MAX_LINES = 500;
    setLines((prev) => {
      const combined = [...prev, promptLine, ...outputLines];
      return combined.length > MAX_LINES ? combined.slice(combined.length - MAX_LINES) : combined;
    });
    setInput('');
  }, [input, cwd, historyList, fsApi, windowId, openWindow, triggerEffect]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSubmit();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyList.length === 0) return;
        const newIndex = historyIndex === -1 ? historyList.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(historyList[newIndex]);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex === -1) return;
        const newIndex = historyIndex + 1;
        if (newIndex >= historyList.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(historyList[newIndex]);
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        const text = input;
        const lastSpaceIdx = text.lastIndexOf(' ');
        const prefix = lastSpaceIdx === -1 ? '' : text.slice(0, lastSpaceIdx + 1);
        const partial = lastSpaceIdx === -1 ? text : text.slice(lastSpaceIdx + 1);
        if (!partial) return;

        const resolvedDir = fsApi.resolvePath(
          partial.includes('/') ? partial.slice(0, partial.lastIndexOf('/') + 1) || '/' : '.',
          cwd,
        );
        const baseName = partial.includes('/') ? partial.slice(partial.lastIndexOf('/') + 1) : partial;
        const entries = fsApi.listDirectory(resolvedDir);
        if (!entries) return;

        const matches = entries.filter((e) => e.name.startsWith(baseName));
        if (matches.length === 1) {
          const match = matches[0];
          const dirPrefix = partial.includes('/') ? partial.slice(0, partial.lastIndexOf('/') + 1) : '';
          const suffix = match.type === 'directory' ? '/' : '';
          setInput(prefix + dirPrefix + match.name + suffix);
        } else if (matches.length > 1) {
          const completionLine: TerminalLine = {
            id: ++lineCounter,
            content: matches.map((m) => (m.type === 'directory' ? `\x1b[1;34m${m.name}/\x1b[0m` : m.name)).join('  '),
          };
          setLines((prev) => {
            const combined = [...prev, completionLine];
            return combined.length > 500 ? combined.slice(combined.length - 500) : combined;
          });
        }
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        setLines([]);
      } else if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        const promptLine: TerminalLine = {
          id: ++lineCounter,
          content: promptPrefix(cwd) + input + '^C',
          isPrompt: true,
        };
        setLines((prev) => [...prev, promptLine]);
        setInput('');
      }
    },
    [handleSubmit, historyList, historyIndex, cwd, input],
  );

  const focusInput = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const displayCwd = cwd.replace('/home/rahul', '~');

  return (
    <div
      onClick={focusInput}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#1e1e1e',
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
        lineHeight: '1.5',
        color: '#CCCCCC',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'text',
      }}
    >
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          minHeight: 0,
        }}
      >
        {lines.map((line) => (
          <div key={line.id} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', minHeight: '1.5em', ...(line.isPrompt ? { marginTop: '8px' } : {}) }}>
            {parseAnsi(line.content)}
          </div>
        ))}

        {/* Active input line */}
        <div style={{ display: 'flex', whiteSpace: 'pre', alignItems: 'baseline', marginTop: '8px' }}>
          <span style={{ color: '#32D74B', fontWeight: 'bold' }}>
            rahul@rahulos
          </span>
          <span style={{ color: '#f5f5f7' }}>:</span>
          <span style={{ color: '#0A84FF', fontWeight: 'bold' }}>
            {displayCwd}
          </span>
          <span style={{ color: '#f5f5f7' }}>$ </span>
          <div style={{ position: 'relative', flex: 1 }}>
            {/* Visual text + block cursor */}
            <span style={{ pointerEvents: 'none', color: '#f5f5f7' }}>
              {input}
              <span
                className="terminal-block-cursor"
                style={{
                  display: 'inline-block',
                  width: '8px',
                  height: '14px',
                  background: '#f5f5f7',
                  verticalAlign: 'text-bottom',
                  marginLeft: '1px',
                  animation: 'terminal-blink 1s step-end infinite',
                  boxShadow: '0 0 2px rgba(255,255,255,0.5)',
                }}
              />
            </span>
            {/* Hidden input for capturing keystrokes */}
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              spellCheck={false}
              autoComplete="off"
              autoCapitalize="off"
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'transparent',
                caretColor: 'transparent',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                lineHeight: 'inherit',
                padding: 0,
                margin: 0,
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes terminal-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
