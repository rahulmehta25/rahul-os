import { useState, useCallback, useMemo } from 'react';
import type { FSNode } from '../../stores/filesystemStore.ts';

interface FileGridProps {
  items: FSNode[];
  viewMode: 'grid' | 'list';
  currentPath: string;
  selectedName: string | null;
  onSelect: (name: string) => void;
  onOpen: (node: FSNode) => void;
  onContextMenu: (e: React.MouseEvent, node: FSNode) => void;
}

type SortColumn = 'name' | 'modified' | 'size' | 'kind';
type SortDirection = 'asc' | 'desc';

function getFileIcon(node: FSNode): React.ReactNode {
  if (node.type === 'directory') {
    return (
      <svg viewBox="0 0 64 52" width="100%" height="100%">
        <path
          d="M4 10C4 6.7 6.7 4 10 4H24L29 12H54C57.3 12 60 14.7 60 18V42C60 45.3 57.3 48 54 48H10C6.7 48 4 45.3 4 42V10Z"
          fill="#4FACE9"
        />
        <path
          d="M4 18H60V42C60 45.3 57.3 48 54 48H10C6.7 48 4 45.3 4 42V18Z"
          fill="#3D99DB"
        />
        <rect x="4" y="18" width="56" height="2" rx="1" fill="rgba(255,255,255,0.12)" />
      </svg>
    );
  }

  const ext = node.name.split('.').pop()?.toLowerCase() ?? '';

  switch (ext) {
    case 'md':
      return (
        <svg viewBox="0 0 52 64" width="100%" height="100%">
          <path d="M6 4h28l12 12v40c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4V8c0-2.2 1.8-4 4-4z" fill="#E8E8ED" />
          <path d="M34 4v12h12L34 4z" fill="#C7C7CC" />
          <rect x="12" y="30" width="28" height="24" rx="3" fill="#34C759" />
          <text x="26" y="47" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="system-ui">MD</text>
        </svg>
      );
    case 'txt':
      return (
        <svg viewBox="0 0 52 64" width="100%" height="100%">
          <path d="M6 4h28l12 12v40c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4V8c0-2.2 1.8-4 4-4z" fill="#E8E8ED" />
          <path d="M34 4v12h12L34 4z" fill="#C7C7CC" />
          <line x1="14" y1="32" x2="38" y2="32" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="39" x2="34" y2="39" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" />
          <line x1="14" y1="46" x2="28" y2="46" stroke="#8E8E93" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'pdf':
      return (
        <svg viewBox="0 0 52 64" width="100%" height="100%">
          <path d="M6 4h28l12 12v40c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4V8c0-2.2 1.8-4 4-4z" fill="#E8E8ED" />
          <path d="M34 4v12h12L34 4z" fill="#C7C7CC" />
          <rect x="12" y="30" width="28" height="24" rx="3" fill="#FF3B30" />
          <text x="26" y="47" textAnchor="middle" fill="white" fontSize="10" fontWeight="700" fontFamily="system-ui">PDF</text>
        </svg>
      );
    case 'url':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <circle cx="32" cy="32" r="26" fill="#5AC8FA" />
          <ellipse cx="32" cy="32" rx="12" ry="26" fill="none" stroke="white" strokeWidth="1.5" opacity="0.6" />
          <line x1="6" y1="32" x2="58" y2="32" stroke="white" strokeWidth="1.5" opacity="0.6" />
          <line x1="6" y1="22" x2="58" y2="22" stroke="white" strokeWidth="1" opacity="0.3" />
          <line x1="6" y1="42" x2="58" y2="42" stroke="white" strokeWidth="1" opacity="0.3" />
        </svg>
      );
    case 'app':
      return (
        <svg viewBox="0 0 64 64" width="100%" height="100%">
          <rect x="4" y="4" width="56" height="56" rx="14" fill="#AF52DE" />
          <polygon points="26,18 26,46 46,32" fill="white" />
        </svg>
      );
    case 'json':
      return (
        <svg viewBox="0 0 52 64" width="100%" height="100%">
          <path d="M6 4h28l12 12v40c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4V8c0-2.2 1.8-4 4-4z" fill="#E8E8ED" />
          <path d="M34 4v12h12L34 4z" fill="#C7C7CC" />
          <rect x="12" y="30" width="28" height="24" rx="3" fill="#FF9500" />
          <text x="26" y="47" textAnchor="middle" fill="white" fontSize="12" fontWeight="700" fontFamily="system-ui">&#123; &#125;</text>
        </svg>
      );
    case 'ts':
    case 'tsx':
      return (
        <svg viewBox="0 0 52 64" width="100%" height="100%">
          <path d="M6 4h28l12 12v40c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4V8c0-2.2 1.8-4 4-4z" fill="#E8E8ED" />
          <path d="M34 4v12h12L34 4z" fill="#C7C7CC" />
          <rect x="12" y="30" width="28" height="24" rx="3" fill="#3178C6" />
          <text x="26" y="47" textAnchor="middle" fill="white" fontSize="11" fontWeight="700" fontFamily="system-ui">TS</text>
        </svg>
      );
    case 'js':
    case 'jsx':
      return (
        <svg viewBox="0 0 52 64" width="100%" height="100%">
          <path d="M6 4h28l12 12v40c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4V8c0-2.2 1.8-4 4-4z" fill="#E8E8ED" />
          <path d="M34 4v12h12L34 4z" fill="#C7C7CC" />
          <rect x="12" y="30" width="28" height="24" rx="3" fill="#F7DF1E" />
          <text x="26" y="47" textAnchor="middle" fill="#333" fontSize="11" fontWeight="700" fontFamily="system-ui">JS</text>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 52 64" width="100%" height="100%">
          <path d="M6 4h28l12 12v40c0 2.2-1.8 4-4 4H10c-2.2 0-4-1.8-4-4V8c0-2.2 1.8-4 4-4z" fill="#E8E8ED" />
          <path d="M34 4v12h12L34 4z" fill="#C7C7CC" />
        </svg>
      );
  }
}

function getKind(node: FSNode): string {
  if (node.type === 'directory') return 'Folder';
  const ext = node.name.split('.').pop()?.toLowerCase() ?? '';
  switch (ext) {
    case 'md': return 'Markdown';
    case 'txt': return 'Plain Text';
    case 'json': return 'JSON';
    case 'pdf': return 'PDF Document';
    case 'url': return 'Web Shortcut';
    case 'app': return 'Application';
    case 'ts': case 'tsx': return 'TypeScript';
    case 'js': case 'jsx': return 'JavaScript';
    default: return 'Document';
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(timestamp: number): string {
  const d = new Date(timestamp);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
}

function GridItem({
  node,
  isSelected,
  onSelect,
  onOpen,
  onContextMenu,
}: {
  node: FSNode;
  isSelected: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const [pulsing, setPulsing] = useState(false);

  const handleDoubleClick = useCallback(() => {
    setPulsing(true);
    setTimeout(() => {
      setPulsing(false);
      onOpen();
    }, 150);
  }, [onOpen]);

  return (
    <button
      data-file-item
      className="flex flex-col items-center gap-1 rounded-lg"
      style={{
        width: '96px',
        padding: '8px 4px 6px',
        background: isSelected ? 'rgba(10, 132, 255, 0.12)' : 'transparent',
        border: isSelected ? '1px solid rgba(10, 132, 255, 0.25)' : '1px solid transparent',
        borderRadius: '8px',
        cursor: 'default',
        transition: 'background 100ms, transform 100ms ease-out',
        transform: pulsing ? 'scale(1.05)' : 'scale(1)',
      }}
      onClick={onSelect}
      onDoubleClick={handleDoubleClick}
      onContextMenu={onContextMenu}
    >
      <div style={{ width: '64px', height: '64px' }}>{getFileIcon(node)}</div>
      <span
        className="text-center leading-tight"
        style={{
          fontSize: '11px',
          color: 'var(--color-text-primary)',
          wordBreak: 'break-word',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          maxWidth: '88px',
        }}
      >
        {node.name}
      </span>
    </button>
  );
}

function ListRow({
  node,
  isSelected,
  isEven,
  onSelect,
  onOpen,
  onContextMenu,
}: {
  node: FSNode;
  isSelected: boolean;
  isEven: boolean;
  onSelect: () => void;
  onOpen: () => void;
  onContextMenu: (e: React.MouseEvent) => void;
}) {
  const modified = node.type === 'file' ? formatDate(node.modifiedAt) : '--';
  const size = node.type === 'file' ? formatSize(node.content.length) : '--';
  const kind = getKind(node);

  return (
    <button
      data-file-item
      className="flex items-center gap-3 w-full text-left px-3"
      style={{
        height: '24px',
        background: isSelected
          ? 'var(--color-accent)'
          : isEven
            ? 'var(--color-bg-input)'
            : 'transparent',
        color: isSelected ? '#fff' : 'var(--color-text-primary)',
        cursor: 'default',
        transition: 'background 80ms',
        borderRadius: isSelected ? '4px' : '0',
      }}
      onClick={onSelect}
      onDoubleClick={onOpen}
      onContextMenu={onContextMenu}
    >
      <div style={{ width: '18px', height: '18px', flexShrink: 0 }}>{getFileIcon(node)}</div>
      <span className="flex-1 truncate" style={{ fontSize: '12px' }}>
        {node.name}
      </span>
      <span
        style={{
          fontSize: '11px',
          color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--color-text-tertiary)',
          width: '120px',
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {modified}
      </span>
      <span
        style={{
          fontSize: '11px',
          color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--color-text-tertiary)',
          width: '70px',
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {size}
      </span>
      <span
        style={{
          fontSize: '11px',
          color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--color-text-tertiary)',
          width: '100px',
          textAlign: 'right',
          flexShrink: 0,
        }}
      >
        {kind}
      </span>
    </button>
  );
}

export function FileGrid({
  items,
  viewMode,
  currentPath,
  selectedName,
  onSelect,
  onOpen,
  onContextMenu,
}: FileGridProps) {
  const [sortBy, setSortBy] = useState<SortColumn>('name');
  const [sortDir, setSortDir] = useState<SortDirection>('asc');

  void currentPath;

  const handleSort = useCallback((col: SortColumn) => {
    setSortBy((prev) => {
      if (prev === col) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortDir('asc');
      return col;
    });
  }, []);

  const sortedItems = useMemo(() => {
    if (viewMode !== 'list') return items;
    return [...items].sort((a, b) => {
      if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
      let cmp = 0;
      switch (sortBy) {
        case 'name':
          cmp = a.name.localeCompare(b.name);
          break;
        case 'modified': {
          const at = a.type === 'file' ? a.modifiedAt : a.createdAt;
          const bt = b.type === 'file' ? b.modifiedAt : b.createdAt;
          cmp = at - bt;
          break;
        }
        case 'size': {
          const as2 = a.type === 'file' ? a.content.length : 0;
          const bs2 = b.type === 'file' ? b.content.length : 0;
          cmp = as2 - bs2;
          break;
        }
        case 'kind':
          cmp = getKind(a).localeCompare(getKind(b));
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
  }, [items, viewMode, sortBy, sortDir]);

  const handleBgClick = useCallback(() => onSelect(''), [onSelect]);

  if (items.length === 0) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        style={{ color: 'var(--color-text-tertiary)', fontSize: '13px' }}
        onClick={handleBgClick}
      >
        This folder is empty
      </div>
    );
  }

  if (viewMode === 'list') {
    const columns: { key: SortColumn; label: string; width?: string }[] = [
      { key: 'name', label: 'Name' },
      { key: 'modified', label: 'Date Modified', width: '120px' },
      { key: 'size', label: 'Size', width: '70px' },
      { key: 'kind', label: 'Kind', width: '100px' },
    ];

    return (
      <div className="flex-1 flex flex-col overflow-hidden" onClick={handleBgClick}>
        <div
          className="flex items-center gap-3 px-3 shrink-0"
          style={{
            height: '22px',
            borderBottom: '1px solid var(--color-border)',
            fontSize: '11px',
            color: 'var(--color-text-tertiary)',
            fontWeight: 500,
            userSelect: 'none',
          }}
        >
          <span style={{ width: '18px', flexShrink: 0 }} />
          {columns.map((col) => (
            <button
              key={col.key}
              className="flex items-center gap-1"
              style={{
                ...(col.key === 'name'
                  ? { flex: 1, justifyContent: 'flex-start' }
                  : { width: col.width, justifyContent: 'flex-end', flexShrink: 0 }),
                background: 'transparent',
                color: sortBy === col.key ? 'var(--color-text-secondary)' : 'var(--color-text-tertiary)',
                fontSize: '11px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.stopPropagation();
                handleSort(col.key);
              }}
            >
              {col.label}
              {sortBy === col.key && (
                <span style={{ fontSize: '8px', marginLeft: '2px' }}>
                  {sortDir === 'asc' ? '\u25B2' : '\u25BC'}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-y-auto py-1">
          {sortedItems.map((node, i) => (
            <ListRow
              key={node.name}
              node={node}
              isSelected={selectedName === node.name}
              isEven={i % 2 === 0}
              onSelect={() => onSelect(node.name)}
              onOpen={() => onOpen(node)}
              onContextMenu={(e) => onContextMenu(e, node)}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-3"
      style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignContent: 'flex-start' }}
      onClick={handleBgClick}
    >
      {items.map((node) => (
        <GridItem
          key={node.name}
          node={node}
          isSelected={selectedName === node.name}
          onSelect={() => onSelect(node.name)}
          onOpen={() => onOpen(node)}
          onContextMenu={(e) => onContextMenu(e, node)}
        />
      ))}
    </div>
  );
}
