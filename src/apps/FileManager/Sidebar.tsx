import { useState, useCallback } from 'react';
import { useFilesystemStore } from '../../stores/filesystemStore.ts';
import type { FSNode } from '../../stores/filesystemStore.ts';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

function DirectoryNode({
  node,
  path,
  currentPath,
  onNavigate,
  depth,
}: {
  node: FSNode;
  path: string;
  currentPath: string;
  onNavigate: (path: string) => void;
  depth: number;
}) {
  const [expanded, setExpanded] = useState(depth < 2);
  const isActive = currentPath === path;

  const handleClick = useCallback(() => {
    if (node.type === 'directory') {
      setExpanded((e) => !e);
      onNavigate(path);
    }
  }, [node.type, path, onNavigate]);

  if (node.type !== 'directory') return null;

  const children = Object.values(node.children).filter(
    (c) => c.type === 'directory',
  );
  children.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <button
        className="flex items-center gap-1 w-full text-left py-0.5 rounded"
        style={{
          paddingLeft: `${8 + depth * 14}px`,
          paddingRight: '8px',
          fontSize: '12px',
          color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
          background: isActive ? 'var(--color-accent-subtle)' : 'transparent',
          fontWeight: isActive ? 500 : 400,
        }}
        onClick={handleClick}
      >
        <span
          style={{
            display: 'inline-block',
            width: '10px',
            textAlign: 'center',
            fontSize: '8px',
            color: 'var(--color-text-tertiary)',
            flexShrink: 0,
          }}
        >
          {children.length > 0 ? (expanded ? '▼' : '▶') : ''}
        </span>
        <svg width="14" height="14" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
          <path
            d="M1.5 3C1.5 2.17 2.17 1.5 3 1.5H6.5L8 3.5H13C13.83 3.5 14.5 4.17 14.5 5V12C14.5 12.83 13.83 13.5 13 13.5H3C2.17 13.5 1.5 12.83 1.5 12V3Z"
            fill="#89b4fa"
            fillOpacity={isActive ? 1 : 0.7}
          />
        </svg>
        <span className="truncate">{node.name === '/' ? 'Root' : node.name}</span>
      </button>
      {expanded &&
        children.map((child) => (
          <DirectoryNode
            key={child.name}
            node={child}
            path={path === '/' ? `/${child.name}` : `${path}/${child.name}`}
            currentPath={currentPath}
            onNavigate={onNavigate}
            depth={depth + 1}
          />
        ))}
    </div>
  );
}

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  const root = useFilesystemStore((s) => s.root);

  return (
    <div
      className="flex flex-col h-full overflow-y-auto py-2"
      style={{
        width: '180px',
        borderRight: '1px solid var(--color-border)',
        background: 'var(--color-bg-hover)',
        fontFamily: 'var(--font-system)',
      }}
    >
      <div
        style={{
          fontSize: '10px',
          fontWeight: 600,
          color: 'var(--color-text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          padding: '4px 12px 6px',
        }}
      >
        Locations
      </div>
      <DirectoryNode
        node={root}
        path="/"
        currentPath={currentPath}
        onNavigate={onNavigate}
        depth={0}
      />
    </div>
  );
}
