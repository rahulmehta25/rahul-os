import { useCallback } from 'react';
import { useWindowStore } from '../../stores/windowStore.ts';

interface DesktopIcon {
  appId: string;
  label: string;
  icon: React.ReactNode;
  defaultSize?: { width: number; height: number };
}

const icons: DesktopIcon[] = [
  {
    appId: 'terminal',
    label: 'Terminal',
    icon: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <rect width="32" height="32" rx="7" fill="#1e1e2e" />
        <path d="M8 22L14 16L8 10" stroke="#a6e3a1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="16" y1="22" x2="24" y2="22" stroke="#a6e3a1" strokeWidth="2.5" strokeLinecap="round" />
      </svg>
    ),
    defaultSize: { width: 680, height: 420 },
  },
  {
    appId: 'filemanager',
    label: 'Files',
    icon: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <rect width="32" height="32" rx="7" fill="#89b4fa" />
        <path d="M6 10C6 8.9 6.9 8 8 8H13L15 11H24C25.1 11 26 11.9 26 13V22C26 23.1 25.1 24 24 24H8C6.9 24 6 23.1 6 22V10Z" fill="white" fillOpacity="0.9" />
      </svg>
    ),
    defaultSize: { width: 800, height: 520 },
  },
  {
    appId: 'settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <rect width="32" height="32" rx="7" fill="#6c7086" />
        <circle cx="16" cy="16" r="5" stroke="white" strokeWidth="2" fill="none" />
        <g stroke="white" strokeWidth="2" strokeLinecap="round">
          <line x1="16" y1="4" x2="16" y2="8" />
          <line x1="16" y1="24" x2="16" y2="28" />
          <line x1="4" y1="16" x2="8" y2="16" />
          <line x1="24" y1="16" x2="28" y2="16" />
          <line x1="7.5" y1="7.5" x2="10.3" y2="10.3" />
          <line x1="21.7" y1="21.7" x2="24.5" y2="24.5" />
          <line x1="7.5" y1="24.5" x2="10.3" y2="21.7" />
          <line x1="21.7" y1="10.3" x2="24.5" y2="7.5" />
        </g>
      </svg>
    ),
    defaultSize: { width: 600, height: 450 },
  },
];

export function DesktopIcons() {
  const openWindow = useWindowStore((s) => s.openWindow);

  const handleDoubleClick = useCallback(
    (icon: DesktopIcon) => {
      openWindow(icon.appId, icon.label, { size: icon.defaultSize });
    },
    [openWindow],
  );

  return (
    <div
      className="absolute grid gap-1 p-4"
      style={{
        top: 'var(--menubar-height)',
        left: 0,
        zIndex: 'var(--z-desktop-icons)',
        gridTemplateColumns: '80px',
        gridAutoRows: '80px',
      }}
    >
      {icons.map((icon) => (
        <button
          key={icon.appId}
          className="flex flex-col items-center justify-center gap-1 rounded-lg p-1"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 120ms',
          }}
          onDoubleClick={() => handleDoubleClick(icon)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
          aria-label={`Open ${icon.label}`}
        >
          <div className="w-10 h-10">{icon.icon}</div>
          <span
            style={{
              fontSize: '11px',
              color: 'var(--color-text-primary)',
              fontFamily: 'var(--font-system)',
              textShadow: '0 1px 3px rgba(0,0,0,0.6)',
              lineHeight: 1.2,
            }}
          >
            {icon.label}
          </span>
        </button>
      ))}
    </div>
  );
}
