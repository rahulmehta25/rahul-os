import { useEffect, useRef, useState, useCallback } from 'react';
import { EditorView, keymap, lineNumbers, drawSelection, highlightActiveLine } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { defaultHighlightStyle, syntaxHighlighting, bracketMatching } from '@codemirror/language';
import { search, searchKeymap, highlightSelectionMatches } from '@codemirror/search';
import { useFilesystemStore } from '../../stores/filesystemStore.ts';
import { useWindowStore } from '../../stores/windowStore.ts';

interface TextEditorProps {
  filePath?: string;
  windowId?: string;
}

const wrapCompartment = new Compartment();

const editorTheme = EditorView.theme({
  '&': {
    height: '100%',
    fontSize: '13px',
    fontFamily: 'var(--font-mono)',
    background: 'transparent',
  },
  '.cm-content': {
    caretColor: 'var(--color-accent)',
    color: 'var(--color-text-primary)',
    padding: '8px 0',
  },
  '.cm-cursor': { borderLeftColor: 'var(--color-accent)' },
  '.cm-selectionBackground': { background: 'rgba(10, 132, 255, 0.2) !important' },
  '&.cm-focused .cm-selectionBackground': { background: 'rgba(10, 132, 255, 0.2) !important' },
  '.cm-gutters': {
    background: 'var(--color-bg-hover)',
    color: 'var(--color-text-tertiary)',
    border: 'none',
    borderRight: '1px solid var(--color-border)',
    minWidth: '50px',
  },
  '.cm-lineNumbers .cm-gutterElement': {
    textAlign: 'right',
    padding: '0 8px 0 0',
  },
  '.cm-activeLineGutter': { background: 'var(--color-bg-active)' },
  '.cm-activeLine': { background: 'var(--color-bg-hover)' },
  '.cm-line': { padding: '0 8px' },
  '.cm-matchingBracket': {
    outline: '1px solid rgba(10, 132, 255, 0.6)',
    borderRadius: '2px',
    backgroundColor: 'rgba(10, 132, 255, 0.1)',
  },
  '.cm-panels': {
    background: 'var(--color-bg-surface-solid)',
    color: 'var(--color-text-primary)',
  },
  '.cm-panels.cm-panels-top': { borderBottom: '1px solid var(--color-border)' },
  '.cm-search': { padding: '6px 8px', gap: '4px' },
  '.cm-search label': { fontSize: '12px', color: 'var(--color-text-secondary)' },
  '.cm-textfield': {
    background: 'var(--color-bg-input)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border)',
    borderRadius: '4px',
    fontSize: '12px',
    padding: '3px 8px',
  },
  '.cm-textfield:focus': {
    borderColor: 'var(--color-accent)',
    outline: 'none',
  },
  '.cm-button': {
    background: 'var(--color-bg-active)',
    color: 'var(--color-text-primary)',
    border: '1px solid var(--color-border)',
    borderRadius: '4px',
    fontSize: '12px',
    padding: '2px 8px',
  },
});

function getLanguage(filename: string): string {
  const name = filename.toLowerCase();
  if (name.startsWith('.bash') || name === '.zshrc' || name === '.profile') return 'Shell';
  if (name.startsWith('.git')) return 'Git Config';

  const ext = filename.split('.').pop()?.toLowerCase() ?? '';
  switch (ext) {
    case 'md': return 'Markdown';
    case 'txt': return 'Plain Text';
    case 'json': return 'JSON';
    case 'ts': case 'tsx': return 'TypeScript';
    case 'js': case 'jsx': return 'JavaScript';
    case 'css': return 'CSS';
    case 'html': case 'htm': return 'HTML';
    case 'py': return 'Python';
    case 'sh': case 'bash': return 'Shell';
    case 'yaml': case 'yml': return 'YAML';
    case 'toml': return 'TOML';
    case 'log': return 'Log';
    default: return 'Plain Text';
  }
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderMarkdown(content: string): string {
  const codeBlocks: string[] = [];
  let html = content.replace(/```(\w*)\n([\s\S]*?)```/g, (_, _lang, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(
      `<pre style="background:rgba(0,0,0,0.25);padding:12px 16px;border-radius:8px;overflow-x:auto;font-family:var(--font-mono);font-size:13px;line-height:1.5;margin:12px 0;color:var(--color-text-primary)"><code>${escapeHtml(code.trim())}</code></pre>`,
    );
    return `__CODEBLOCK_${idx}__`;
  });

  html = html.replace(
    /^### (.+)$/gm,
    '<h3 style="font-size:15px;font-weight:600;margin:16px 0 8px;color:var(--color-text-primary)">$1</h3>',
  );
  html = html.replace(
    /^## (.+)$/gm,
    '<h2 style="font-size:18px;font-weight:600;margin:20px 0 10px;color:var(--color-text-primary)">$1</h2>',
  );
  html = html.replace(
    /^# (.+)$/gm,
    '<h1 style="font-size:24px;font-weight:700;margin:24px 0 12px;color:var(--color-text-primary)">$1</h1>',
  );

  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(
    /`(.+?)`/g,
    '<code style="background:var(--color-bg-active);padding:2px 6px;border-radius:4px;font-size:12px;font-family:var(--font-mono)">$1</code>',
  );
  html = html.replace(
    /\[(.+?)\]\((.+?)\)/g,
    '<a href="$2" style="color:var(--color-accent);text-decoration:none" target="_blank" rel="noopener">$1</a>',
  );
  html = html.replace(
    /^- (.+)$/gm,
    '<li style="margin:3px 0 3px 24px;list-style:disc;line-height:1.6">$1</li>',
  );
  html = html.replace(/^(?!<[hluopra]|<li|<br|__CODEBLOCK)(.+)$/gm, (_, text) => {
    if (text.trim() === '') return '<br/>';
    return `<p style="margin:6px 0;line-height:1.7">${text}</p>`;
  });

  codeBlocks.forEach((block, idx) => {
    html = html.replace(`__CODEBLOCK_${idx}__`, block);
  });

  return html;
}

export function TextEditor({ filePath, windowId }: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const [wordWrap, setWordWrap] = useState(true);
  const [cursorPos, setCursorPos] = useState({ line: 1, col: 1 });
  const contentRef = useRef('');
  const savedContentRef = useRef('');

  const getNode = useFilesystemStore((s) => s.getNode);
  const updateFileContent = useFilesystemStore((s) => s.updateFileContent);
  const setTitle = useWindowStore((s) => s.setTitle);
  const root = useFilesystemStore((s) => s.root);

  const isMarkdown = filePath?.endsWith('.md') ?? false;
  const isProjectFile = filePath?.startsWith('/home/rahul/projects/') ?? false;
  const showPreviewToggle = isMarkdown;

  const fileName = filePath?.split('/').pop() ?? 'Untitled';
  const language = filePath ? getLanguage(fileName) : 'Plain Text';

  const fileNode = filePath ? getNode(filePath) : null;
  const initialContent = fileNode && fileNode.type === 'file' ? fileNode.content : '';
  void root;

  useEffect(() => {
    if (windowId) {
      setTitle(windowId, hasUnsaved ? `\u25CF ${fileName}` : fileName);
    }
  }, [windowId, fileName, hasUnsaved, setTitle]);

  useEffect(() => {
    if (isMarkdown && isProjectFile) setIsPreview(true);
  }, [isMarkdown, isProjectFile]);

  const handleSave = useCallback(() => {
    if (filePath && contentRef.current !== savedContentRef.current) {
      updateFileContent(filePath, contentRef.current);
      savedContentRef.current = contentRef.current;
      setHasUnsaved(false);
    }
  }, [filePath, updateFileContent]);

  useEffect(() => {
    if (!editorRef.current || isPreview) return;

    const content = filePath ? (initialContent as string) : '';
    contentRef.current = content;
    savedContentRef.current = content;

    const updateListener = EditorView.updateListener.of((update) => {
      if (update.docChanged) {
        const newContent = update.state.doc.toString();
        contentRef.current = newContent;
        const changed = newContent !== savedContentRef.current;
        setHasUnsaved(changed);
        if (filePath) {
          updateFileContent(filePath, newContent);
          savedContentRef.current = newContent;
          setHasUnsaved(false);
        }
      }
      if (update.selectionSet || update.docChanged) {
        const pos = update.state.selection.main.head;
        const line = update.state.doc.lineAt(pos);
        setCursorPos({ line: line.number, col: pos - line.from + 1 });
      }
    });

    const state = EditorState.create({
      doc: content,
      extensions: [
        lineNumbers(),
        drawSelection(),
        highlightActiveLine(),
        bracketMatching(),
        syntaxHighlighting(defaultHighlightStyle),
        search(),
        highlightSelectionMatches(),
        ...(isMarkdown ? [markdown()] : []),
        editorTheme,
        keymap.of([
          ...searchKeymap,
          {
            key: 'Mod-s',
            run: () => {
              handleSave();
              return true;
            },
          },
        ]),
        updateListener,
        wrapCompartment.of(wordWrap ? EditorView.lineWrapping : []),
      ],
    });

    const view = new EditorView({ state, parent: editorRef.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreview, filePath]);

  const toggleWordWrap = useCallback(() => {
    setWordWrap((prev) => {
      const next = !prev;
      viewRef.current?.dispatch({
        effects: wrapCompartment.reconfigure(next ? EditorView.lineWrapping : []),
      });
      return next;
    });
  }, []);

  if (!filePath) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ color: 'var(--color-text-tertiary)', fontSize: '13px' }}
      >
        Open a file from the File Manager to start editing
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'var(--font-system)' }}>
      {/* Toolbar */}
      <div
        className="flex items-center gap-3 px-3 shrink-0"
        style={{
          height: '34px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-bg-hover)',
        }}
      >
        {/* Left: filename with unsaved dot */}
        <div className="flex items-center gap-1.5 min-w-0">
          {hasUnsaved && (
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: 'var(--color-text-tertiary)',
                flexShrink: 0,
              }}
            />
          )}
          <span
            className="truncate"
            style={{ fontSize: '13px', fontWeight: 500, color: 'var(--color-text-primary)' }}
          >
            {fileName}
          </span>
        </div>

        {/* Center: preview toggle + language */}
        <div className="flex-1 flex items-center justify-center gap-2">
          {showPreviewToggle && (
            <div
              className="flex gap-0 rounded-md overflow-hidden"
              style={{ border: '1px solid var(--color-border)' }}
            >
              <button
                className="px-2.5 py-0.5"
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  background: !isPreview ? 'var(--color-accent-subtle)' : 'transparent',
                  color: !isPreview ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                }}
                onClick={() => setIsPreview(false)}
              >
                Edit
              </button>
              <button
                className="px-2.5 py-0.5"
                style={{
                  fontSize: '11px',
                  fontWeight: 500,
                  background: isPreview ? 'var(--color-accent-subtle)' : 'transparent',
                  color: isPreview ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
                }}
                onClick={() => setIsPreview(true)}
              >
                Preview
              </button>
            </div>
          )}
          <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{language}</span>
        </div>

        {/* Right: wrap toggle + cursor position */}
        <div className="flex items-center gap-2 shrink-0">
          {!isPreview && (
            <button
              className="px-2 py-0.5 rounded"
              style={{
                fontSize: '11px',
                fontWeight: 500,
                background: wordWrap ? 'var(--color-accent-subtle)' : 'transparent',
                color: wordWrap ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
              }}
              onClick={toggleWordWrap}
              title="Toggle word wrap"
            >
              Wrap
            </button>
          )}
          {!isPreview && (
            <span
              style={{
                fontSize: '11px',
                color: 'var(--color-text-tertiary)',
                whiteSpace: 'nowrap',
              }}
            >
              Ln {cursorPos.line}, Col {cursorPos.col}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      {isPreview ? (
        <div
          className="flex-1 overflow-y-auto p-6"
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: '14px',
            lineHeight: 1.7,
            maxWidth: '720px',
          }}
          dangerouslySetInnerHTML={{
            __html: renderMarkdown(contentRef.current || (initialContent as string)),
          }}
        />
      ) : (
        <div ref={editorRef} className="flex-1 overflow-hidden" />
      )}
    </div>
  );
}
