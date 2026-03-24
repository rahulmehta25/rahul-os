import { useCallback } from 'react';
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

function getFileIcon(node: FSNode): { icon: React.ReactNode; color: string } {
  if (node.type === 'directory') {
    return {
      color: '#89b4fa',
      icon: (
        <svg viewBox="0 0 32 32" width="100%" height="100%">
          <path
            d="M3 8C3 6.34 4.34 5 6 5H12L15 9H26C27.66 9 29 10.34 29 12V24C29 25.66 27.66 27 26 27H6C4.34 27 3 25.66 3 24V8Z"
            fill="currentColor"
          />
        </svg>
      ),
    };
  }

  const ext = node.name.split('.').pop()?.toLowerCase() ?? '';
  switch (ext) {
    case 'md':
      return {
        color: '#a6e3a1',
        icon: (
          <svg viewBox="0 0 32 32" width="100%" height="100%">
            <rect x="4" y="2" width="24" height="28" rx="3" fill="currentColor" opacity="0.15" />
            <rect x="4" y="2" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <text x="16" y="20" textAnchor="middle" fill="currentColor" fontSize="10" fontWeight="700">M↓</text>
          </svg>
        ),
      };
    case 'txt':
      return {
        color: '#cdd6f4',
        icon: (
          <svg viewBox="0 0 32 32" width="100%" height="100%">
            <rect x="4" y="2" width="24" height="28" rx="3" fill="currentColor" opacity="0.15" />
            <rect x="4" y="2" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <line x1="9" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="1.5" />
            <line x1="9" y1="15" x2="21" y2="15" stroke="currentColor" strokeWidth="1.5" />
            <line x1="9" y1="20" x2="18" y2="20" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        ),
      };
    case 'pdf':
      return {
        color: '#f38ba8',
        icon: (
          <svg viewBox="0 0 32 32" width="100%" height="100%">
            <rect x="4" y="2" width="24" height="28" rx="3" fill="currentColor" opacity="0.15" />
            <rect x="4" y="2" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <text x="16" y="20" textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="700">PDF</text>
          </svg>
        ),
      };
    case 'url':
      return {
        color: '#74c7ec',
        icon: (
          <svg viewBox="0 0 32 32" width="100%" height="100%">
            <circle cx="16" cy="16" r="12" fill="currentColor" opacity="0.15" />
            <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <path d="M10 16C10 12 12.5 8 16 8C19.5 8 22 12 22 16C22 20 19.5 24 16 24C12.5 24 10 20 10 16Z" stroke="currentColor" strokeWidth="1" fill="none" />
            <line x1="4" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1" />
          </svg>
        ),
      };
    case 'app':
      return {
        color: '#cba6f7',
        icon: (
          <svg viewBox="0 0 32 32" width="100%" height="100%">
            <rect x="4" y="4" width="24" height="24" rx="6" fill="currentColor" opacity="0.2" />
            <rect x="4" y="4" width="24" height="24" rx="6" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <polygon points="13,10 13,22 23,16" fill="currentColor" />
          </svg>
        ),
      };
    case 'json':
      return {
        color: '#f9e2af',
        icon: (
          <svg viewBox="0 0 32 32" width="100%" height="100%">
            <rect x="4" y="2" width="24" height="28" rx="3" fill="currentColor" opacity="0.15" />
            <rect x="4" y="2" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
            <text x="16" y="20" textAnchor="middle" fill="currentColor" fontSize="8" fontWeight="600">{ }</text>
          </svg>
        ),
      };
    default:
      return {
        color: '#a6adc8',
        icon: (
          <svg viewBox="0 0 32 32" width="100%" height="100%">
            <rect x="4" y="2" width="24" height="28" rx="3" fill="currentColor" opacity="0.15" />
            <rect x="4" y="2" width="24" height="28" rx="3" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        ),
      };
  }
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
  const { icon, color } = getFileIcon(node);

  return (
    <button
      className="flex flex-col items-center gap-1 p-2 rounded-lg"
      style={{
        width: '88px',
        background: isSelected ? 'var(--color-accent-subtle)' : 'transparent',
        border: isSelected ? '1px solid var(--color-accent)' : '1px solid transparent',
        cursor: 'default',
        transition: 'background 100ms',
      }}
      onClick={onSelect}
      onDoubleClick={onOpen}
      onContextMenu={onContextMenu}
    >
      <div style={{ width: '40px', height: '40px', color }}>{icon}</div>
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
          maxWidth: '80px',
        }}
      >
        {node.name}
      </span>
    </button>
  );
}

function ListItem({
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
  const { icon, color } = getFileIcon(node);
  const modified = node.type === 'file' ? new Date(node.modifiedAt).toLocaleDateString() : '';
  const size = node.type === 'file' ? formatSize(node.content.length) : '--';

  return (
    <button
      className="flex items-center gap-3 w-full text-left px-3 py-1.5 rounded"
      style={{
        background: isSelected ? 'var(--color-accent-subtle)' : 'transparent',
        cursor: 'default',
        transition: 'background 100ms',
      }}
      onClick={onSelect}
      onDoubleClick={onOpen}
      onContextMenu={onContextMenu}
    >
      <div style={{ width: '18px', height: '18px', color, flexShrink: 0 }}>{icon}</div>
      <span
        className="flex-1 truncate"
        style={{ fontSize: '12px', color: 'var(--color-text-primary)' }}
      >
        {node.name}
      </span>
      <span
        style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', width: '80px', textAlign: 'right' }}
      >
        {modified}
      </span>
      <span
        style={{ fontSize: '11px', color: 'var(--color-text-tertiary)', width: '60px', textAlign: 'right' }}
      >
        {size}
      </span>
    </button>
  );
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
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
  const handleBgClick = useCallback(() => {
    onSelect('');
  }, [onSelect]);

  if (items.length === 0) {
    return (
      <div
        className="flex-1 flex items-center justify-center"
        style={{
          color: 'var(--color-text-tertiary)',
          fontFamily: 'var(--font-system)',
          fontSize: '13px',
        }}
        onClick={handleBgClick}
      >
        This folder is empty
      </div>
    );
  }

  // Suppress unused warning - currentPath is used by parent for context
  void currentPath;

  if (viewMode === 'list') {
    return (
      <div className="flex-1 overflow-y-auto p-2" onClick={handleBgClick}>
        <div className="flex items-center gap-3 px-3 py-1 mb-1" style={{ fontSize: '10px', color: 'var(--color-text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <span style={{ width: '18px' }} />
          <span className="flex-1">Name</span>
          <span style={{ width: '80px', textAlign: 'right' }}>Modified</span>
          <span style={{ width: '60px', textAlign: 'right' }}>Size</span>
        </div>
        {items.map((node) => (
          <ListItem
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

  return (
    <div
      className="flex-1 overflow-y-auto p-3"
      style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignContent: 'flex-start' }}
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
