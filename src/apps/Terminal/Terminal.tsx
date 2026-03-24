import { useState, useRef, useEffect, useCallback } from 'react';
import { useFilesystemStore, initializeFilesystem } from '../../stores/filesystemStore';
import { useWindowStore } from '../../stores/windowStore';
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
    '30': '#45475a', '31': '#f38ba8', '32': '#a6e3a1', '33': '#f9e2af',
    '34': '#89b4fa', '35': '#cba6f7', '36': '#94e2d5', '37': '#cdd6f4',
    '40': '#45475a', '41': '#f38ba8', '42': '#a6e3a1', '43': '#f9e2af',
    '44': '#89b4fa', '45': '#cba6f7', '46': '#94e2d5', '47': '#bac2de',
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
  return `rahul@rahulos:${display}$ `;
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

  // Initialize filesystem on first mount
  useEffect(() => {
    if (!fsInitialized) {
      initializeFilesystem(defaultFilesystem);
      fsInitialized = true;
    }
  }, []);

  // Show MOTD on mount
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

  // Auto-scroll on new lines
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

    // Add to history
    setHistoryList((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const result = executeCommand(trimmed, {
      cwd,
      setCwd: (newCwd: string) => {
        setCwd(newCwd);
        // Update window title with new path
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

    const outputLines: TerminalLine[] = result.output.map((line) => ({
      id: ++lineCounter,
      content: line,
    }));

    setLines((prev) => [...prev, promptLine, ...outputLines]);
    setInput('');
  }, [input, cwd, historyList, fsApi, windowId, openWindow]);

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

  const prompt = promptPrefix(cwd);

  return (
    <div
      onClick={focusInput}
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#11111b',
        fontFamily: 'var(--font-mono)',
        fontSize: '13px',
        lineHeight: '1.5',
        color: '#cdd6f4',
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
          padding: '8px 12px',
          minHeight: 0,
        }}
      >
        {lines.map((line) => (
          <div key={line.id} style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', minHeight: '1.5em' }}>
            {parseAnsi(line.content)}
          </div>
        ))}

        {/* Active input line */}
        <div style={{ display: 'flex', whiteSpace: 'pre' }}>
          <span style={{ color: '#a6e3a1', fontWeight: 'bold' }}>
            {prompt.split('$')[0]}$
          </span>
          <span>&nbsp;</span>
          <div style={{ position: 'relative', flex: 1 }}>
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
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#cdd6f4',
                fontFamily: 'inherit',
                fontSize: 'inherit',
                lineHeight: 'inherit',
                width: '100%',
                padding: 0,
                margin: 0,
                caretColor: '#a6e3a1',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
