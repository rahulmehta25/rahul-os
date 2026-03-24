import { useCallback, useState } from 'react';
import { useWindowStore } from '../../stores/windowStore.ts';

interface DockApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  defaultSize?: { width: number; height: number };
}

const dockApps: DockApp[] = [
  {
    id: 'terminal',
    name: 'Terminal',
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
    id: 'filemanager',
    name: 'Files',
    icon: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <rect width="32" height="32" rx="7" fill="#89b4fa" />
        <path d="M6 10C6 8.9 6.9 8 8 8H13L15 11H24C25.1 11 26 11.9 26 13V22C26 23.1 25.1 24 24 24H8C6.9 24 6 23.1 6 22V10Z" fill="white" fillOpacity="0.9" />
      </svg>
    ),
    defaultSize: { width: 800, height: 520 },
  },
  {
    id: 'texteditor',
    name: 'TextEdit',
    icon: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <rect width="32" height="32" rx="7" fill="#f9e2af" />
        <rect x="8" y="6" width="16" height="20" rx="2" fill="white" fillOpacity="0.9" />
        <line x1="11" y1="11" x2="21" y2="11" stroke="#9ca0b0" strokeWidth="1.5" />
        <line x1="11" y1="15" x2="19" y2="15" stroke="#9ca0b0" strokeWidth="1.5" />
        <line x1="11" y1="19" x2="17" y2="19" stroke="#9ca0b0" strokeWidth="1.5" />
      </svg>
    ),
    defaultSize: { width: 700, height: 500 },
  },
  {
    id: 'browser',
    name: 'Safari',
    icon: (
      <svg viewBox="0 0 32 32" className="w-full h-full">
        <rect width="32" height="32" rx="7" fill="#74c7ec" />
        <circle cx="16" cy="16" r="10" stroke="white" strokeWidth="1.5" fill="none" />
        <polygon points="16,8 20,14 16,20 12,14" fill="white" fillOpacity="0.8" />
        <circle cx="16" cy="16" r="2" fill="white" />
      </svg>
    ),
    defaultSize: { width: 900, height: 600 },
  },
  {
    id: 'settings',
    name: 'Settings',
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

export function Dock() {
  const { windows, openWindow, focusWindow, restoreWindow } = useWindowStore();
  const [bouncing, setBouncing] = useState<string | null>(null);

  const windowList = Object.values(windows);

  const handleClick = useCallback(
    (app: DockApp) => {
      const appWindows = windowList.filter((w) => w.appId === app.id);
      const minimized = appWindows.find((w) => w.status === 'minimized');
      const visible = appWindows.find((w) => w.status !== 'minimized');

      if (minimized) {
        restoreWindow(minimized.id);
        return;
      }
      if (visible) {
        focusWindow(visible.id);
        return;
      }

      // Launch with bounce animation
      setBouncing(app.id);
      setTimeout(() => {
        openWindow(app.id, app.name, {
          size: app.defaultSize,
        });
        setBouncing(null);
      }, 400);
    },
    [windowList, openWindow, focusWindow, restoreWindow],
  );

  return (
    <div
      className="fixed bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-1.5 px-3 py-1.5"
      style={{
        background: 'var(--color-bg-dock)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRadius: 'var(--radius-dock)',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-dock)',
        zIndex: 'var(--z-dock)',
      }}
    >
      {dockApps.map((app) => {
        const hasOpenWindows = windowList.some((w) => w.appId === app.id);
        const isBouncing = bouncing === app.id;

        return (
          <div key={app.id} className="relative group flex flex-col items-center">
            {/* Tooltip */}
            <div
              className="absolute -top-8 px-2 py-0.5 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
              style={{
                background: 'var(--color-bg-surface-solid)',
                color: 'var(--color-text-primary)',
                border: '1px solid var(--color-border)',
                fontSize: '11px',
              }}
            >
              {app.name}
            </div>

            <button
              className="w-11 h-11 rounded-xl transition-transform hover:scale-110 active:scale-95"
              style={{
                animation: isBouncing
                  ? 'dock-bounce 0.4s ease'
                  : undefined,
              }}
              onClick={() => handleClick(app)}
              aria-label={`Open ${app.name}`}
            >
              {app.icon}
            </button>

            {/* Running indicator */}
            {hasOpenWindows && (
              <div
                className="w-1 h-1 rounded-full mt-0.5"
                style={{ background: 'var(--color-text-secondary)' }}
              />
            )}
          </div>
        );
      })}

      <style>{`
        @keyframes dock-bounce {
          0%, 100% { transform: translateY(0); }
          25% { transform: translateY(-12px); }
          50% { transform: translateY(0); }
          75% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
