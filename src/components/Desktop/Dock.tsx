import { useCallback, useRef, useState } from 'react';
import { useWindowStore } from '../../stores/windowStore.ts';

interface DockApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  defaultSize?: { width: number; height: number };
}

/* ─── macOS Big Sur / Sequoia-style icon SVGs ─────────────────────── */

const TerminalIcon = () => (
  <svg viewBox="0 0 120 120" width="100%" height="100%">
    <defs>
      <linearGradient id="terminal-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3d3d50" />
        <stop offset="100%" stopColor="#1a1a2e" />
      </linearGradient>
      <filter id="terminal-inner">
        <feFlood floodColor="rgba(255,255,255,0.06)" />
        <feComposite in2="SourceGraphic" operator="in" />
        <feOffset dy="1" />
        <feComposite in2="SourceGraphic" operator="atop" />
      </filter>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#terminal-bg)" filter="url(#terminal-inner)" />
    <rect x="1" y="1" width="118" height="118" rx="25" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
    <path d="M30 78L54 56L30 34" stroke="#50fa7b" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    <line x1="60" y1="78" x2="90" y2="78" stroke="#50fa7b" strokeWidth="7" strokeLinecap="round" />
  </svg>
);

const FinderIcon = () => (
  <svg viewBox="0 0 120 120" width="100%" height="100%">
    <defs>
      <linearGradient id="finder-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5eb5f7" />
        <stop offset="100%" stopColor="#1a73e8" />
      </linearGradient>
      <filter id="finder-inner">
        <feFlood floodColor="rgba(255,255,255,0.08)" />
        <feComposite in2="SourceGraphic" operator="in" />
        <feOffset dy="1.5" />
        <feComposite in2="SourceGraphic" operator="atop" />
      </filter>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#finder-bg)" filter="url(#finder-inner)" />
    <rect x="1" y="1" width="118" height="118" rx="25" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    {/* Smiling face silhouette */}
    <ellipse cx="44" cy="50" rx="7" ry="7.5" fill="white" />
    <ellipse cx="76" cy="50" rx="7" ry="7.5" fill="white" />
    <path d="M38 72 Q60 92 82 72" stroke="white" strokeWidth="5" strokeLinecap="round" fill="none" />
    {/* Vertical center line */}
    <line x1="60" y1="38" x2="60" y2="82" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" />
  </svg>
);

const TextEditIcon = () => (
  <svg viewBox="0 0 120 120" width="100%" height="100%">
    <defs>
      <linearGradient id="textedit-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#e8e4dd" />
      </linearGradient>
      <filter id="textedit-shadow">
        <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="rgba(0,0,0,0.12)" />
      </filter>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#textedit-bg)" filter="url(#textedit-shadow)" />
    <rect x="1" y="1" width="118" height="118" rx="25" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="1" />
    {/* Yellow legal pad top */}
    <rect x="16" y="14" width="88" height="10" rx="2" fill="#f5d85e" />
    {/* Text lines */}
    <line x1="24" y1="38" x2="96" y2="38" stroke="#e74c3c" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="24" y1="52" x2="88" y2="52" stroke="#3498db" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="24" y1="66" x2="78" y2="66" stroke="#2ecc71" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="24" y1="80" x2="70" y2="80" stroke="#9b59b6" strokeWidth="3.5" strokeLinecap="round" />
    <line x1="24" y1="94" x2="56" y2="94" stroke="#e67e22" strokeWidth="3.5" strokeLinecap="round" />
    {/* Margin line */}
    <line x1="20" y1="28" x2="20" y2="106" stroke="rgba(231,76,60,0.25)" strokeWidth="1.5" />
  </svg>
);

const SafariIcon = () => (
  <svg viewBox="0 0 120 120" width="100%" height="100%">
    <defs>
      <linearGradient id="safari-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5ac8fa" />
        <stop offset="100%" stopColor="#007aff" />
      </linearGradient>
      <linearGradient id="needle-red" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ff3b30" />
        <stop offset="100%" stopColor="#c0392b" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#safari-bg)" />
    <rect x="1" y="1" width="118" height="118" rx="25" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
    {/* Outer compass ring */}
    <circle cx="60" cy="60" r="40" stroke="white" strokeWidth="2.5" fill="none" />
    {/* Tick marks at N/S/E/W */}
    <line x1="60" y1="22" x2="60" y2="28" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="60" y1="92" x2="60" y2="98" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="22" y1="60" x2="28" y2="60" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    <line x1="92" y1="60" x2="98" y2="60" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
    {/* Compass needle: red upper-right, white lower-left */}
    <polygon points="60,60 48,36 60,60 72,84" fill="url(#needle-red)" />
    <polygon points="60,60 84,48 60,60 36,72" fill="url(#needle-red)" opacity="0.7" />
    <polygon points="60,60 72,84 60,60 48,36" fill="white" opacity="0" />
    <polygon points="60,60 36,72 60,60 84,48" fill="white" opacity="0.8" />
    {/* Red/white diamond needle */}
    <polygon points="60,30 68,60 60,90 52,60" fill="none" />
    <polygon points="60,30 68,60 60,60 52,60" fill="url(#needle-red)" />
    <polygon points="60,90 68,60 60,60 52,60" fill="white" opacity="0.9" />
    {/* Center dot */}
    <circle cx="60" cy="60" r="4" fill="white" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 120 120" width="100%" height="100%">
    <defs>
      <linearGradient id="settings-bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#8e8e93" />
        <stop offset="100%" stopColor="#636366" />
      </linearGradient>
    </defs>
    <rect width="120" height="120" rx="26" fill="url(#settings-bg)" />
    <rect x="1" y="1" width="118" height="118" rx="25" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
    {/* Gear: outer teeth */}
    <g transform="translate(60,60)">
      <path
        d={generateGearPath(34, 28, 10)}
        fill="none"
        stroke="white"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    </g>
    {/* Inner circle */}
    <circle cx="60" cy="60" r="14" stroke="white" strokeWidth="4.5" fill="none" />
  </svg>
);

/** Attempt-free gear path generation: creates a cog with teeth around center (0,0). */
function generateGearPath(outerR: number, innerR: number, teeth: number): string {
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a1 = (Math.PI * 2 * i) / teeth;
    const a2 = (Math.PI * 2 * (i + 0.35)) / teeth;
    const a3 = (Math.PI * 2 * (i + 0.5)) / teeth;
    const a4 = (Math.PI * 2 * (i + 0.85)) / teeth;

    pts.push(`${outerR * Math.cos(a1)},${outerR * Math.sin(a1)}`);
    pts.push(`${outerR * Math.cos(a2)},${outerR * Math.sin(a2)}`);
    pts.push(`${innerR * Math.cos(a3)},${innerR * Math.sin(a3)}`);
    pts.push(`${innerR * Math.cos(a4)},${innerR * Math.sin(a4)}`);
  }
  return `M${pts.join('L')}Z`;
}

/* ─── App definitions ─────────────────────────────────────────────── */

const dockApps: DockApp[] = [
  {
    id: 'terminal',
    name: 'Terminal',
    icon: <TerminalIcon />,
    defaultSize: { width: 680, height: 420 },
  },
  {
    id: 'filemanager',
    name: 'Files',
    icon: <FinderIcon />,
    defaultSize: { width: 800, height: 520 },
  },
  {
    id: 'texteditor',
    name: 'TextEdit',
    icon: <TextEditIcon />,
    defaultSize: { width: 700, height: 500 },
  },
  {
    id: 'browser',
    name: 'Safari',
    icon: <SafariIcon />,
    defaultSize: { width: 900, height: 600 },
  },
];

const utilityApps: DockApp[] = [
  {
    id: 'settings',
    name: 'Settings',
    icon: <SettingsIcon />,
    defaultSize: { width: 600, height: 450 },
  },
];

/* ─── Constants for magnification ─────────────────────────────────── */

const BASE_SIZE = 48;
const MAX_SIZE = 64;
const MAGNIFICATION_RANGE = 3; // how many neighbors to affect

function getScaledSize(distance: number): number {
  if (distance > MAGNIFICATION_RANGE) return BASE_SIZE;
  const ratio = 1 - distance / (MAGNIFICATION_RANGE + 1);
  return BASE_SIZE + (MAX_SIZE - BASE_SIZE) * ratio * ratio;
}

/* ─── Dock item ───────────────────────────────────────────────────── */

interface DockItemProps {
  app: DockApp;
  index: number;
  mouseX: number | null;
  hasOpenWindows: boolean;
  isBouncing: boolean;
  onClick: () => void;
}

function DockItem({ app, index, mouseX, hasOpenWindows, isBouncing, onClick }: DockItemProps) {
  const size =
    mouseX !== null
      ? getScaledSize(Math.abs(mouseX - index))
      : BASE_SIZE;

  return (
    <div
      className="dock-item"
      style={{
        width: size,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        transition: mouseX !== null ? 'width 0.15s ease, height 0.15s ease' : 'width 0.3s ease, height 0.3s ease',
      }}
    >
      {/* Tooltip */}
      <div className="dock-tooltip">
        {app.name}
        <div className="dock-tooltip-arrow" />
      </div>

      <button
        className="dock-icon-btn"
        style={{
          width: size,
          height: size,
          animation: isBouncing ? 'dock-bounce 0.3s ease' : undefined,
          transition: mouseX !== null ? 'width 0.15s ease, height 0.15s ease' : 'width 0.3s ease, height 0.3s ease',
        }}
        onClick={onClick}
        aria-label={`Open ${app.name}`}
      >
        {app.icon}
      </button>

      {/* Running indicator dot */}
      <div
        className="dock-indicator"
        style={{
          opacity: hasOpenWindows ? 1 : 0,
        }}
      />
    </div>
  );
}

/* ─── Main Dock component ─────────────────────────────────────────── */

export function Dock() {
  const { windows, openWindow, focusWindow, restoreWindow } = useWindowStore();
  const [bouncing, setBouncing] = useState<string | null>(null);
  const [mouseX, setMouseX] = useState<number | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);

  const allApps = [...dockApps, ...utilityApps];
  const separatorIndex = dockApps.length; // separator sits after the last app before utilities
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

      setBouncing(app.id);
      setTimeout(() => {
        openWindow(app.id, app.name, {
          size: app.defaultSize,
        });
        setBouncing(null);
      }, 300);
    },
    [windowList, openWindow, focusWindow, restoreWindow],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!dockRef.current) return;
      const rect = dockRef.current.getBoundingClientRect();
      const relX = e.clientX - rect.left;
      const totalItems = allApps.length;
      // Account for separator width (16px) sitting between apps and utilities
      // Items area: padding-left (12px) + items + gaps + separator
      const gapWidth = 4;
      const separatorWidth = 16;
      const paddingLeft = 12;

      // Estimate position: each item is ~BASE_SIZE wide + gap
      const itemSlotWidth = BASE_SIZE + gapWidth;
      let adjustedX = relX - paddingLeft;

      // If past the separator, subtract its width
      const separatorPos = separatorIndex * itemSlotWidth;
      if (adjustedX > separatorPos) {
        adjustedX -= separatorWidth;
      }

      const fractionalIndex = adjustedX / itemSlotWidth;
      setMouseX(Math.max(0, Math.min(totalItems - 1, fractionalIndex)));
    },
    [allApps.length, separatorIndex],
  );

  const handleMouseLeave = useCallback(() => {
    setMouseX(null);
  }, []);

  return (
    <>
      <div
        ref={dockRef}
        className="dock-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ zIndex: 'var(--z-dock)' } as React.CSSProperties}
      >
        {/* App icons */}
        {dockApps.map((app, i) => (
          <DockItem
            key={app.id}
            app={app}
            index={i}
            mouseX={mouseX}
            hasOpenWindows={windowList.some((w) => w.appId === app.id)}
            isBouncing={bouncing === app.id}
            onClick={() => handleClick(app)}
          />
        ))}

        {/* Separator */}
        <div className="dock-separator" />

        {/* Utility icons */}
        {utilityApps.map((app, i) => (
          <DockItem
            key={app.id}
            app={app}
            index={separatorIndex + i}
            mouseX={mouseX}
            hasOpenWindows={windowList.some((w) => w.appId === app.id)}
            isBouncing={bouncing === app.id}
            onClick={() => handleClick(app)}
          />
        ))}
      </div>

      <style>{`
        .dock-container {
          position: fixed;
          bottom: 4px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: flex-end;
          gap: 4px;
          padding: 6px 12px;
          background: rgba(30, 30, 46, 0.65);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-radius: 18px;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-top: 1px solid rgba(255, 255, 255, 0.28);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.4),
            0 2px 8px rgba(0, 0, 0, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        @media (prefers-color-scheme: light) {
          .dock-container {
            background: rgba(239, 241, 245, 0.65);
            border: 1px solid rgba(0, 0, 0, 0.08);
            border-top: 1px solid rgba(255, 255, 255, 0.6);
            box-shadow:
              0 8px 32px rgba(0, 0, 0, 0.12),
              0 2px 8px rgba(0, 0, 0, 0.06),
              inset 0 1px 0 rgba(255, 255, 255, 0.8);
          }
        }

        .dock-item {
          position: relative;
          cursor: pointer;
        }

        .dock-item:hover .dock-tooltip {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }

        .dock-tooltip {
          position: absolute;
          top: -36px;
          left: 50%;
          transform: translateX(-50%) translateY(4px);
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(20, 20, 30, 0.9);
          color: #f0f0f0;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.3;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease, transform 0.15s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          z-index: 10;
        }

        .dock-tooltip-arrow {
          position: absolute;
          bottom: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 5px solid transparent;
          border-right: 5px solid transparent;
          border-top: 5px solid rgba(20, 20, 30, 0.9);
        }

        .dock-icon-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          background: none;
          padding: 0;
          cursor: pointer;
          border-radius: 12px;
          outline: none;
        }

        .dock-icon-btn:active {
          filter: brightness(0.85);
        }

        .dock-icon-btn:focus-visible {
          box-shadow: 0 0 0 2px rgba(88, 166, 255, 0.6);
        }

        .dock-indicator {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          margin-top: 3px;
          background: rgba(255, 255, 255, 0.85);
          box-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
          transition: opacity 0.2s ease;
        }

        @media (prefers-color-scheme: light) {
          .dock-indicator {
            background: rgba(60, 60, 60, 0.7);
            box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
          }
          .dock-tooltip {
            background: rgba(30, 30, 30, 0.85);
          }
          .dock-tooltip-arrow {
            border-top-color: rgba(30, 30, 30, 0.85);
          }
        }

        .dock-separator {
          width: 1px;
          height: 36px;
          background: rgba(255, 255, 255, 0.15);
          margin: 0 6px;
          align-self: center;
          flex-shrink: 0;
          border-radius: 0.5px;
        }

        @media (prefers-color-scheme: light) {
          .dock-separator {
            background: rgba(0, 0, 0, 0.12);
          }
        }

        @keyframes dock-bounce {
          0%, 100% { transform: translateY(0); }
          30% { transform: translateY(-16px); }
          55% { transform: translateY(0); }
          80% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}
