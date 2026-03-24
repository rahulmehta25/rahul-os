import { useEffect, useRef, useState, useCallback } from 'react';
import { EditorView, keymap, lineNumbers, drawSelection, highlightActiveLine } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { defaultHighlightStyle, syntaxHighlighting } from '@codemirror/language';
import { useFilesystemStore } from '../../stores/filesystemStore.ts';
import { useWindowStore } from '../../stores/windowStore.ts';

interface TextEditorProps {
  filePath?: string;
  windowId?: string;
}

const darkTheme = EditorView.theme({
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
  '.cm-selectionBackground': { background: 'var(--color-accent-subtle) !important' },
  '&.cm-focused .cm-selectionBackground': { background: 'var(--color-accent-subtle) !important' },
  '.cm-gutters': {
    background: 'var(--color-bg-hover)',
    color: 'var(--color-text-tertiary)',
    border: 'none',
    borderRight: '1px solid var(--color-border)',
  },
  '.cm-activeLineGutter': { background: 'var(--color-bg-active)' },
  '.cm-activeLine': { background: 'rgba(255,255,255,0.03)' },
  '.cm-line': { padding: '0 8px' },
});

function renderMarkdown(content: string): string {
  let html = content;
  html = html.replace(/^### (.+)$/gm, '<h3 style="font-size:15px;font-weight:600;margin:16px 0 8px;color:var(--color-text-primary)">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 style="font-size:17px;font-weight:600;margin:20px 0 10px;color:var(--color-text-primary)">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 style="font-size:22px;font-weight:700;margin:24px 0 12px;color:var(--color-text-primary)">$1</h1>');
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/`(.+?)`/g, '<code style="background:var(--color-bg-active);padding:1px 4px;border-radius:3px;font-size:12px;font-family:var(--font-mono)">$1</code>');
  html = html.replace(/^- (.+)$/gm, '<li style="margin:4px 0;margin-left:20px;list-style:disc">$1</li>');
  html = html.replace(/^(?!<[hl]|<li)(.+)$/gm, (_, text) => {
    if (text.trim() === '') return '<br/>';
    return `<p style="margin:6px 0;line-height:1.6">${text}</p>`;
  });
  return html;
}

export function TextEditor({ filePath, windowId }: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const contentRef = useRef('');
  const savedContentRef = useRef('');

  const getNode = useFilesystemStore((s) => s.getNode);
  const updateFileContent = useFilesystemStore((s) => s.updateFileContent);
  const setTitle = useWindowStore((s) => s.setTitle);
  const root = useFilesystemStore((s) => s.root);

  const isMarkdown = filePath?.endsWith('.md') ?? false;
  const isProjectFile = filePath?.startsWith('/home/rahul/projects/') ?? false;
  const showPreviewToggle = isMarkdown && isProjectFile;

  const fileName = filePath?.split('/').pop() ?? 'Untitled';

  // Initialize content from filesystem
  const fileNode = filePath ? getNode(filePath) : null;
  const initialContent = fileNode && fileNode.type === 'file' ? fileNode.content : '';
  void root;

  // Update title with unsaved indicator
  useEffect(() => {
    if (windowId) {
      const title = hasUnsaved ? `● ${fileName}` : fileName;
      setTitle(windowId, title);
    }
  }, [windowId, fileName, hasUnsaved, setTitle]);

  // Auto-start in preview mode for project markdown files
  useEffect(() => {
    if (showPreviewToggle) setIsPreview(true);
  }, [showPreviewToggle]);

  // Save handler
  const handleSave = useCallback(() => {
    if (filePath && contentRef.current !== savedContentRef.current) {
      updateFileContent(filePath, contentRef.current);
      savedContentRef.current = contentRef.current;
      setHasUnsaved(false);
    }
  }, [filePath, updateFileContent]);

  // Initialize CodeMirror
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

        // Auto-save after typing stops (debounced via the FS store)
        if (filePath) {
          updateFileContent(filePath, newContent);
          savedContentRef.current = newContent;
          setHasUnsaved(false);
        }
      }
    });

    const state = EditorState.create({
      doc: content,
      extensions: [
        lineNumbers(),
        drawSelection(),
        highlightActiveLine(),
        syntaxHighlighting(defaultHighlightStyle),
        ...(isMarkdown ? [markdown()] : []),
        darkTheme,
        keymap.of([
          { key: 'Mod-s', run: () => { handleSave(); return true; } },
        ]),
        updateListener,
        EditorView.lineWrapping,
      ],
    });

    const view = new EditorView({ state, parent: editorRef.current });
    viewRef.current = view;

    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // Only re-init on preview toggle or filePath change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPreview, filePath]);

  // No file selected
  if (!filePath) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{
          color: 'var(--color-text-tertiary)',
          fontFamily: 'var(--font-system)',
          fontSize: '13px',
        }}
      >
        Open a file from the File Manager to start editing
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'var(--font-system)' }}>
      {/* Toolbar */}
      {showPreviewToggle && (
        <div
          className="flex items-center gap-2 px-3 shrink-0"
          style={{
            height: '32px',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-bg-hover)',
          }}
        >
          <button
            className="px-2 py-0.5 rounded text-xs"
            style={{
              background: !isPreview ? 'var(--color-accent-subtle)' : 'transparent',
              color: !isPreview ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              fontWeight: !isPreview ? 500 : 400,
            }}
            onClick={() => setIsPreview(false)}
          >
            Edit
          </button>
          <button
            className="px-2 py-0.5 rounded text-xs"
            style={{
              background: isPreview ? 'var(--color-accent-subtle)' : 'transparent',
              color: isPreview ? 'var(--color-accent)' : 'var(--color-text-secondary)',
              fontWeight: isPreview ? 500 : 400,
            }}
            onClick={() => setIsPreview(true)}
          >
            Preview
          </button>
          <div className="flex-1" />
          <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>
            {filePath}
          </span>
        </div>
      )}

      {/* Content */}
      {isPreview ? (
        <div
          className="flex-1 overflow-y-auto p-6"
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: '14px',
            lineHeight: 1.6,
            maxWidth: '720px',
          }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(contentRef.current || (initialContent as string)) }}
        />
      ) : (
        <div ref={editorRef} className="flex-1 overflow-hidden" />
      )}
    </div>
  );
}
