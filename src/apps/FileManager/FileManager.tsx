import { useState, useCallback, useEffect, useRef } from 'react';
import { useFilesystemStore } from '../../stores/filesystemStore.ts';
import type { FSNode } from '../../stores/filesystemStore.ts';
import { useWindowStore } from '../../stores/windowStore.ts';
import { Sidebar } from './Sidebar.tsx';
import { FileGrid } from './FileGrid.tsx';

interface ContextMenuState {
  x: number;
  y: number;
  target: FSNode | null;
}

export function FileManager() {
  const [navState, setNavState] = useState({ history: ['/home/rahul'], index: 0 });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedName, setSelectedName] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  const currentPath = navState.history[navState.index];
  const canGoBack = navState.index > 0;
  const canGoForward = navState.index < navState.history.length - 1;

  const listDirectory = useFilesystemStore((s) => s.listDirectory);
  const createFile = useFilesystemStore((s) => s.createFile);
  const createDirectory = useFilesystemStore((s) => s.createDirectory);
  const deleteNode = useFilesystemStore((s) => s.deleteNode);
  const renameNode = useFilesystemStore((s) => s.renameNode);
  const openWindow = useWindowStore((s) => s.openWindow);
  const root = useFilesystemStore((s) => s.root);

  const items = listDirectory(currentPath) ?? [];
  void root;

  const breadcrumbs = currentPath === '/' ? [] : currentPath.split('/').filter(Boolean);

  const navigateTo = useCallback((path: string) => {
    setNavState((prev) => ({
      history: [...prev.history.slice(0, prev.index + 1), path],
      index: prev.index + 1,
    }));
    setSelectedName(null);
    setContextMenu(null);
  }, []);

  const goBack = useCallback(() => {
    setNavState((prev) => (prev.index > 0 ? { ...prev, index: prev.index - 1 } : prev));
    setSelectedName(null);
  }, []);

  const goForward = useCallback(() => {
    setNavState((prev) =>
      prev.index < prev.history.length - 1 ? { ...prev, index: prev.index + 1 } : prev,
    );
    setSelectedName(null);
  }, []);

  const handleBreadcrumbClick = useCallback(
    (index: number) => {
      const path = index < 0 ? '/' : '/' + breadcrumbs.slice(0, index + 1).join('/');
      navigateTo(path);
    },
    [breadcrumbs, navigateTo],
  );

  const handleOpen = useCallback(
    (node: FSNode) => {
      if (node.type === 'directory') {
        navigateTo(currentPath === '/' ? `/${node.name}` : `${currentPath}/${node.name}`);
        return;
      }
      const ext = node.name.split('.').pop()?.toLowerCase() ?? '';
      const filePath = currentPath === '/' ? `/${node.name}` : `${currentPath}/${node.name}`;

      if (ext === 'url') {
        const urlMatch = node.content.match(/URL=(.+)/i);
        const url = urlMatch ? urlMatch[1].trim() : node.content.trim();
        if (url) window.open(url, '_blank', 'noopener');
        return;
      }
      if (ext === 'pdf') {
        window.open('https://rahul-mehta.me/resume', '_blank', 'noopener');
        return;
      }
      if (ext === 'app') {
        openWindow('snake', 'Snake', { size: { width: 400, height: 440 } });
        return;
      }
      openWindow('texteditor', node.name, {
        size: { width: 700, height: 500 },
        appProps: { filePath },
      });
    },
    [currentPath, navigateTo, openWindow],
  );

  const handleContextMenu = useCallback((e: React.MouseEvent, node: FSNode) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedName(node.name);
    setContextMenu({ x: e.clientX, y: e.clientY, target: node });
  }, []);

  const handleBgContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if ((e.target as HTMLElement).closest('[data-file-item]')) return;
    setContextMenu({ x: e.clientX, y: e.clientY, target: null });
  }, []);

  const handleNewFile = useCallback(() => {
    let name = 'untitled.txt';
    let i = 1;
    const names = new Set(items.map((n) => n.name));
    while (names.has(name)) name = `untitled-${i++}.txt`;
    createFile(currentPath === '/' ? `/${name}` : `${currentPath}/${name}`, '');
    setContextMenu(null);
    setRenaming(name);
    setRenameValue(name);
  }, [currentPath, items, createFile]);

  const handleNewFolder = useCallback(() => {
    let name = 'New Folder';
    let i = 1;
    const names = new Set(items.map((n) => n.name));
    while (names.has(name)) name = `New Folder ${i++}`;
    createDirectory(currentPath === '/' ? `/${name}` : `${currentPath}/${name}`);
    setContextMenu(null);
    setRenaming(name);
    setRenameValue(name);
  }, [currentPath, items, createDirectory]);

  const handleDelete = useCallback(() => {
    if (!contextMenu?.target) return;
    deleteNode(
      currentPath === '/'
        ? `/${contextMenu.target.name}`
        : `${currentPath}/${contextMenu.target.name}`,
    );
    setContextMenu(null);
    setSelectedName(null);
  }, [contextMenu, currentPath, deleteNode]);

  const handleRenameStart = useCallback(() => {
    if (!contextMenu?.target) return;
    setRenaming(contextMenu.target.name);
    setRenameValue(contextMenu.target.name);
    setContextMenu(null);
  }, [contextMenu]);

  const handleRenameSubmit = useCallback(() => {
    if (!renaming || !renameValue.trim() || renameValue === renaming) {
      setRenaming(null);
      return;
    }
    renameNode(
      currentPath === '/' ? `/${renaming}` : `${currentPath}/${renaming}`,
      renameValue.trim(),
    );
    setRenaming(null);
    setSelectedName(renameValue.trim());
  }, [renaming, renameValue, currentPath, renameNode]);

  const handleDuplicate = useCallback(() => {
    if (!contextMenu?.target || contextMenu.target.type !== 'file') return;
    const node = contextMenu.target;
    const dotIdx = node.name.lastIndexOf('.');
    const baseName = dotIdx > 0 ? node.name.slice(0, dotIdx) : node.name;
    const ext = dotIdx > 0 ? node.name.slice(dotIdx) : '';
    let copyName = `${baseName} copy${ext}`;
    let i = 2;
    const names = new Set(items.map((n) => n.name));
    while (names.has(copyName)) copyName = `${baseName} copy ${i++}${ext}`;
    createFile(
      currentPath === '/' ? `/${copyName}` : `${currentPath}/${copyName}`,
      node.content,
    );
    setContextMenu(null);
  }, [contextMenu, currentPath, items, createFile]);

  useEffect(() => {
    if (renaming && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renaming]);

  useEffect(() => {
    const dismiss = () => setContextMenu(null);
    if (contextMenu) {
      window.addEventListener('click', dismiss);
      return () => window.removeEventListener('click', dismiss);
    }
  }, [contextMenu]);

  return (
    <div
      className="flex flex-col h-full"
      style={{ fontFamily: 'var(--font-system)', fontSize: '13px' }}
      onContextMenu={handleBgContextMenu}
    >
      {/* Toolbar */}
      <div
        className="flex items-center gap-1 px-3 shrink-0"
        style={{
          height: '38px',
          borderBottom: '1px solid var(--color-border)',
          background: 'var(--color-bg-titlebar)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        }}
      >
        {/* Back / Forward chevrons */}
        <button
          style={{
            background: 'transparent',
            color: canGoBack ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)',
            fontSize: '18px',
            cursor: canGoBack ? 'pointer' : 'default',
            opacity: canGoBack ? 1 : 0.35,
            padding: '0 3px',
            lineHeight: 1,
          }}
          disabled={!canGoBack}
          onClick={goBack}
          aria-label="Go back"
        >
          {'\u2039'}
        </button>
        <button
          style={{
            background: 'transparent',
            color: canGoForward ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)',
            fontSize: '18px',
            cursor: canGoForward ? 'pointer' : 'default',
            opacity: canGoForward ? 1 : 0.35,
            padding: '0 3px',
            lineHeight: 1,
          }}
          disabled={!canGoForward}
          onClick={goForward}
          aria-label="Go forward"
        >
          {'\u203A'}
        </button>

        {/* Breadcrumbs */}
        <div className="flex items-center gap-0.5 flex-1 min-w-0 overflow-hidden ml-2">
          <button
            className="shrink-0 px-1 rounded"
            style={{ fontSize: '12px', color: 'var(--color-text-tertiary)', background: 'transparent' }}
            onClick={() => handleBreadcrumbClick(-1)}
          >
            /
          </button>
          {breadcrumbs.map((part, i) => (
            <span key={i} className="flex items-center gap-0.5 shrink-0">
              <span style={{ color: 'var(--color-text-tertiary)', fontSize: '11px' }}>{'\u203A'}</span>
              <button
                className="px-1 rounded truncate"
                style={{
                  fontSize: '12px',
                  color:
                    i === breadcrumbs.length - 1
                      ? 'var(--color-text-primary)'
                      : 'var(--color-text-secondary)',
                  fontWeight: i === breadcrumbs.length - 1 ? 500 : 400,
                  background: 'transparent',
                  maxWidth: '120px',
                }}
                onClick={() => handleBreadcrumbClick(i)}
              >
                {part}
              </button>
            </span>
          ))}
        </div>

        {/* View toggle */}
        <div className="flex gap-0.5 shrink-0">
          <button
            className="rounded p-1"
            style={{
              color: viewMode === 'grid' ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
              background: viewMode === 'grid' ? 'var(--color-accent-subtle)' : 'transparent',
            }}
            onClick={() => setViewMode('grid')}
            aria-label="Grid view"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="6" height="6" rx="1.5" />
              <rect x="9" y="1" width="6" height="6" rx="1.5" />
              <rect x="1" y="9" width="6" height="6" rx="1.5" />
              <rect x="9" y="9" width="6" height="6" rx="1.5" />
            </svg>
          </button>
          <button
            className="rounded p-1"
            style={{
              color: viewMode === 'list' ? 'var(--color-accent)' : 'var(--color-text-tertiary)',
              background: viewMode === 'list' ? 'var(--color-accent-subtle)' : 'transparent',
            }}
            onClick={() => setViewMode('list')}
            aria-label="List view"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="2" width="14" height="2" rx="1" />
              <rect x="1" y="7" width="14" height="2" rx="1" />
              <rect x="1" y="12" width="14" height="2" rx="1" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 min-h-0" style={{ backgroundColor: 'var(--color-bg-surface-solid)' }}>
        <Sidebar currentPath={currentPath} onNavigate={navigateTo} />
        <div className="flex-1 flex flex-col min-w-0 relative" style={{ backgroundColor: 'var(--color-bg-surface-solid)' }}>
          {renaming && (
            <div
              className="absolute top-0 left-0 right-0 z-10 px-3 py-2 flex items-center gap-2"
              style={{
                background: 'var(--color-bg-surface-solid)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Rename:</span>
              <input
                ref={renameInputRef}
                className="flex-1 px-2 py-1 rounded"
                style={{
                  fontSize: '12px',
                  background: 'var(--color-bg-input)',
                  color: 'var(--color-text-primary)',
                  border: '1px solid var(--color-accent)',
                  outline: 'none',
                }}
                value={renameValue}
                onChange={(e) => setRenameValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRenameSubmit();
                  if (e.key === 'Escape') setRenaming(null);
                }}
                onBlur={handleRenameSubmit}
              />
            </div>
          )}
          <FileGrid
            items={items}
            viewMode={viewMode}
            currentPath={currentPath}
            selectedName={selectedName}
            onSelect={setSelectedName}
            onOpen={handleOpen}
            onContextMenu={handleContextMenu}
          />
        </div>
      </div>

      {/* Context menu */}
      {contextMenu && (
        <div
          className="fixed rounded-lg overflow-hidden py-1"
          style={{
            left: contextMenu.x,
            top: contextMenu.y,
            zIndex: 2000,
            background: 'var(--color-bg-surface)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-context-menu)',
            minWidth: '180px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {contextMenu.target ? (
            <>
              <ContextMenuItem
                label="Open"
                onClick={() => {
                  handleOpen(contextMenu.target!);
                  setContextMenu(null);
                }}
              />
              <MenuSeparator />
              <ContextMenuItem label="Rename" onClick={handleRenameStart} />
              {contextMenu.target.type === 'file' && (
                <ContextMenuItem label="Duplicate" onClick={handleDuplicate} />
              )}
              <MenuSeparator />
              <ContextMenuItem label="Move to Trash" onClick={handleDelete} danger />
            </>
          ) : (
            <>
              <ContextMenuItem label="New Folder" onClick={handleNewFolder} />
              <ContextMenuItem label="New File" onClick={handleNewFile} />
            </>
          )}
        </div>
      )}

      {/* Status bar */}
      <div
        className="shrink-0 px-3 flex items-center"
        style={{
          height: '24px',
          borderTop: '1px solid var(--color-border)',
          background: 'var(--color-bg-hover)',
          fontSize: '11px',
          color: 'var(--color-text-tertiary)',
        }}
      >
        {items.length} item{items.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}

function ContextMenuItem({
  label,
  onClick,
  danger,
}: {
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      className="w-full text-left px-3 py-1"
      style={{
        fontSize: '13px',
        color: danger ? '#FF453A' : 'var(--color-text-primary)',
        background: 'transparent',
        borderRadius: '4px',
        margin: '0 4px',
        width: 'calc(100% - 8px)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'var(--color-accent)';
        (e.currentTarget as HTMLElement).style.color = '#fff';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = 'transparent';
        (e.currentTarget as HTMLElement).style.color = danger
          ? '#FF453A'
          : 'var(--color-text-primary)';
      }}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

function MenuSeparator() {
  return (
    <div
      style={{ height: '1px', background: 'var(--color-border)', margin: '4px 8px' }}
    />
  );
}
