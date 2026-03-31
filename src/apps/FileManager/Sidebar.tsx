import { useMemo } from 'react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

interface SidebarEntry {
  name: string;
  path: string;
  icon: React.ReactNode;
}

const favorites: SidebarEntry[] = [
  {
    name: 'Desktop',
    path: '/home/rahul/Desktop',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="2" width="13" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
        <line x1="8" y1="11" x2="8" y2="13.5" stroke="currentColor" strokeWidth="1.2" />
        <line x1="5" y1="13.5" x2="11" y2="13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Documents',
    path: '/home/rahul/documents',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4.5 1.5h5l3 3v9.5a1 1 0 01-1 1H4.5a1 1 0 01-1-1V2.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" />
        <path d="M9.5 1.5V5h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: 'Downloads',
    path: '/home/rahul/Downloads',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M8 2v7.5m0 0l-2.5-2.5m2.5 2.5l2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 11v2.5a1 1 0 001 1h8a1 1 0 001-1V11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: 'Projects',
    path: '/home/rahul/projects',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M5.5 4.5L2 8l3.5 3.5M10.5 4.5L14 8l-3.5 3.5M9.5 2.5l-3 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

const locations: SidebarEntry[] = [
  {
    name: 'rahul',
    path: '/home/rahul',
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M2.5 8L8 3l5.5 5M4 7v5.5a1 1 0 001 1h6a1 1 0 001-1V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

function SidebarItem({
  item,
  isActive,
  onClick,
}: {
  item: SidebarEntry;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className="flex items-center gap-2 w-full text-left"
      style={{
        padding: '5px 10px',
        margin: '1px 6px',
        borderRadius: '6px',
        fontSize: '13px',
        color: isActive ? '#fff' : 'var(--color-text-secondary)',
        background: isActive ? 'var(--color-accent)' : 'transparent',
        cursor: 'default',
        width: 'calc(100% - 12px)',
        transition: 'background 100ms',
      }}
      onMouseEnter={(e) => {
        if (!isActive) (e.currentTarget as HTMLElement).style.background = 'var(--color-bg-hover)';
      }}
      onMouseLeave={(e) => {
        if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent';
      }}
      onClick={onClick}
    >
      <span style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>{item.icon}</span>
      <span className="truncate">{item.name}</span>
    </button>
  );
}

export function Sidebar({ currentPath, onNavigate }: SidebarProps) {
  const activePath = useMemo(() => {
    const allItems = [...favorites, ...locations];
    const match = allItems
      .filter((item) => currentPath === item.path || currentPath.startsWith(item.path + '/'))
      .sort((a, b) => b.path.length - a.path.length)[0];
    return match?.path ?? null;
  }, [currentPath]);

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{
        width: '200px',
        borderRight: '1px solid var(--color-border)',
        backgroundColor: 'var(--color-bg-surface-solid)',
        background: 'var(--color-bg-surface-solid)',
        fontFamily: 'var(--font-system)',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--color-text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          padding: '10px 14px 4px',
          userSelect: 'none',
        }}
      >
        Favorites
      </div>
      {favorites.map((item) => (
        <SidebarItem
          key={item.path}
          item={item}
          isActive={activePath === item.path}
          onClick={() => onNavigate(item.path)}
        />
      ))}

      <div
        style={{
          height: '0.5px',
          background: 'var(--color-border)',
          margin: '8px 14px 0',
        }}
      />
      <div
        style={{
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--color-text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          padding: '12px 14px 4px',
          userSelect: 'none',
        }}
      >
        Locations
      </div>
      {locations.map((item) => (
        <SidebarItem
          key={item.path}
          item={item}
          isActive={activePath === item.path}
          onClick={() => onNavigate(item.path)}
        />
      ))}
    </div>
  );
}
