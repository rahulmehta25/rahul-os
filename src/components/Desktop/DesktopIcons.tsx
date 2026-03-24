import { useCallback, useState } from 'react';
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
      <svg viewBox="0 0 32 32" width="56" height="56">
        <defs>
          <linearGradient id="grad-terminal" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2a2a3e" />
            <stop offset="100%" stopColor="#1e1e2e" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="7" fill="url(#grad-terminal)" />
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
      <svg viewBox="0 0 32 32" width="56" height="56">
        <defs>
          <linearGradient id="grad-files" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9dc4fc" />
            <stop offset="100%" stopColor="#89b4fa" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="7" fill="url(#grad-files)" />
        <path d="M6 10C6 8.9 6.9 8 8 8H13L15 11H24C25.1 11 26 11.9 26 13V22C26 23.1 25.1 24 24 24H8C6.9 24 6 23.1 6 22V10Z" fill="white" fillOpacity="0.9" />
      </svg>
    ),
    defaultSize: { width: 800, height: 520 },
  },
  {
    appId: 'settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 32 32" width="56" height="56">
        <defs>
          <linearGradient id="grad-settings" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c8096" />
            <stop offset="100%" stopColor="#6c7086" />
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="7" fill="url(#grad-settings)" />
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
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDoubleClick = useCallback(
    (icon: DesktopIcon) => {
      openWindow(icon.appId, icon.label, { size: icon.defaultSize });
    },
    [openWindow],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent, appId: string) => {
      e.stopPropagation();
      setSelectedId(appId);
    },
    [],
  );

  const handleDesktopClick = useCallback(() => {
    setSelectedId(null);
  }, []);

  return (
    <div
      className="absolute"
      style={{
        top: 'calc(var(--menubar-height) + 16px)',
        left: '16px',
        zIndex: 'var(--z-desktop-icons)',
        display: 'grid',
        gridTemplateColumns: '90px',
        gridAutoRows: '90px',
      }}
      onClick={handleDesktopClick}
    >
      {icons.map((icon) => {
        const isSelected = selectedId === icon.appId;

        return (
          <button
            key={icon.appId}
            className="flex flex-col items-center justify-start gap-1.5 rounded-lg"
            style={{
              width: '90px',
              paddingTop: '8px',
              paddingBottom: '4px',
              background: isSelected ? 'rgba(137, 180, 250, 0.2)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 120ms',
              outline: 'none',
            }}
            onClick={(e) => handleClick(e, icon.appId)}
            onDoubleClick={() => handleDoubleClick(icon)}
            aria-label={`Open ${icon.label}`}
          >
            <div style={{ width: '56px', height: '56px', flexShrink: 0 }}>
              {icon.icon}
            </div>
            <span
              style={{
                fontSize: '11px',
                color: 'white',
                fontFamily: 'var(--font-system)',
                textShadow: '0 1px 3px rgba(0,0,0,0.7), 0 0px 6px rgba(0,0,0,0.4)',
                lineHeight: 1.2,
                maxWidth: '76px',
                textAlign: 'center',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                wordBreak: 'break-word',
              }}
            >
              {icon.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
