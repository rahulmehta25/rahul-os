import { useCallback, useRef, useState, useMemo } from 'react';
import { useWindowStore } from '../../stores/windowStore.ts';
import {
  TerminalIcon,
  FinderIcon,
  TextEditIcon,
  SafariIcon,
  SettingsIcon,
  SnakeIcon,
} from '../shared/AppIcons.tsx';

interface DockApp {
  id: string;
  name: string;
  icon: React.ReactNode;
  defaultSize?: { width: number; height: number };
}

/* --- App definitions ------------------------------------------------------ */

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
  {
    id: 'snake',
    name: 'Snake',
    icon: <SnakeIcon />,
    defaultSize: { width: 420, height: 480 },
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

/* --- Magnification engine ------------------------------------------------- */

const BASE_SIZE = 48;
const MAX_SIZE = 72;        // 1.5x at closest
const INFLUENCE_PX = 180;   // pixel radius of the magnification effect
const SIGMA = INFLUENCE_PX / 2.5;

/**
 * Gaussian falloff for dock magnification.
 * Returns a scale factor (1.0 to MAX_SIZE/BASE_SIZE) based on pixel distance
 * from the cursor to the icon center.
 */
function getScaleForDistance(pxDistance: number): number {
  if (pxDistance > INFLUENCE_PX) return 1.0;
  const gaussian = Math.exp(-(pxDistance * pxDistance) / (2 * SIGMA * SIGMA));
  const maxScale = MAX_SIZE / BASE_SIZE;
  return 1.0 + (maxScale - 1.0) * gaussian;
}

/* --- Dock item ------------------------------------------------------------ */

interface DockItemProps {
  app: DockApp;
  scale: number;
  hasOpenWindows: boolean;
  isBouncing: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onClick: () => void;
}

function DockItem({
  app,
  scale,
  hasOpenWindows,
  isBouncing,
  isHovered,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: DockItemProps) {
  const size = BASE_SIZE * scale;
  const isScaling = scale > 1.01;

  return (
    <div
      className="dock-item"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        width: size,
        height: size,
        transition: isScaling
          ? 'width 80ms ease-out, height 80ms ease-out'
          : 'width 300ms ease-out, height 300ms ease-out',
      }}
    >
      {/* Tooltip */}
      <div
        className="dock-tooltip"
        style={{
          opacity: isHovered ? 1 : 0,
          transform: isHovered
            ? 'translateX(-50%) translateY(0)'
            : 'translateX(-50%) translateY(6px)',
          pointerEvents: 'none',
        }}
      >
        {app.name}
        <div className="dock-tooltip-arrow" />
      </div>

      <button
        className={`dock-icon-btn${isBouncing ? ' dock-bouncing' : ''}`}
        style={{
          width: size,
          height: size,
          transition: isScaling
            ? 'width 80ms ease-out, height 80ms ease-out'
            : 'width 300ms ease-out, height 300ms ease-out',
        }}
        onClick={onClick}
        aria-label={`Open ${app.name}`}
      >
        <div className="dock-icon-inner">
          {app.icon}
          <div className="dock-icon-reflection" />
        </div>
      </button>

      {/* Running indicator dot */}
      <div
        className="dock-indicator"
        style={{ opacity: hasOpenWindows ? 1 : 0 }}
      />
    </div>
  );
}

/* --- Main Dock component -------------------------------------------------- */

export function Dock() {
  const { windows, openWindow, focusWindow, restoreWindow } = useWindowStore();
  const [bouncing, setBouncing] = useState<string | null>(null);
  const [mouseXPx, setMouseXPx] = useState<number | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const allApps = useMemo(() => [...dockApps, ...utilityApps], []);
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
      }, 800);
    },
    [windowList, openWindow, focusWindow, restoreWindow],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      setMouseXPx(e.clientX);
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    setMouseXPx(null);
    setHoveredId(null);
  }, []);

  const getIconScale = useCallback(
    (appId: string): number => {
      if (mouseXPx === null) return 1.0;
      const el = iconRefs.current.get(appId);
      if (!el) return 1.0;
      const rect = el.getBoundingClientRect();
      const iconCenterX = rect.left + rect.width / 2;
      return getScaleForDistance(Math.abs(mouseXPx - iconCenterX));
    },
    [mouseXPx],
  );

  const setIconRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) {
        iconRefs.current.set(id, el);
      }
    },
    [],
  );

  // Suppress lint: allApps is used for iconRefs setup
  void allApps;

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
        {dockApps.map((app) => (
          <div key={app.id} ref={setIconRef(app.id)} className="dock-item-wrapper">
            <DockItem
              app={app}
              scale={getIconScale(app.id)}
              hasOpenWindows={windowList.some((w) => w.appId === app.id)}
              isBouncing={bouncing === app.id}
              isHovered={hoveredId === app.id}
              onMouseEnter={() => setHoveredId(app.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleClick(app)}
            />
          </div>
        ))}

        {/* Separator */}
        <div className="dock-separator" />

        {/* Utility icons */}
        {utilityApps.map((app) => (
          <div key={app.id} ref={setIconRef(app.id)} className="dock-item-wrapper">
            <DockItem
              app={app}
              scale={getIconScale(app.id)}
              hasOpenWindows={windowList.some((w) => w.appId === app.id)}
              isBouncing={bouncing === app.id}
              isHovered={hoveredId === app.id}
              onMouseEnter={() => setHoveredId(app.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleClick(app)}
            />
          </div>
        ))}
      </div>

      <style>{`
        .dock-container {
          position: fixed;
          bottom: var(--dock-margin);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: flex-end;
          gap: 2px;
          padding: 4px 8px;
          background: rgba(40, 40, 40, 0.45);
          backdrop-filter: blur(30px) saturate(180%);
          -webkit-backdrop-filter: blur(30px) saturate(180%);
          border-radius: 18px;
          border: 0.5px solid rgba(255, 255, 255, 0.08);
          box-shadow:
            inset 0 0.5px 0 0 rgba(255, 255, 255, 0.15),
            0 8px 40px rgba(0, 0, 0, 0.35),
            0 2px 8px rgba(0, 0, 0, 0.2);
        }

        [data-theme='light'] .dock-container {
          background: rgba(246, 246, 246, 0.55);
          border: 0.5px solid rgba(255, 255, 255, 0.6);
          box-shadow:
            inset 0 0.5px 0 0 rgba(255, 255, 255, 0.8),
            0 0 0 0.5px rgba(0, 0, 0, 0.06),
            0 8px 32px rgba(0, 0, 0, 0.1),
            0 2px 8px rgba(0, 0, 0, 0.05);
        }

        .dock-item-wrapper {
          display: flex;
          align-items: flex-end;
          justify-content: center;
        }

        .dock-item {
          position: relative;
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
          flex-shrink: 0;
        }

        /* --- Tooltip --- */

        .dock-tooltip {
          position: absolute;
          top: -36px;
          left: 50%;
          transform: translateX(-50%) translateY(6px);
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(30, 30, 30, 0.88);
          backdrop-filter: blur(20px) saturate(1.5);
          -webkit-backdrop-filter: blur(20px) saturate(1.5);
          border: 0.5px solid rgba(255, 255, 255, 0.12);
          color: #f5f5f7;
          font-size: 12px;
          font-weight: 500;
          line-height: 1.3;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease, transform 0.15s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
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
          border-top: 5px solid rgba(30, 30, 30, 0.88);
        }

        [data-theme='light'] .dock-tooltip {
          background: rgba(40, 40, 40, 0.85);
        }

        [data-theme='light'] .dock-tooltip-arrow {
          border-top-color: rgba(40, 40, 40, 0.85);
        }

        /* --- Icon button --- */

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
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
          transform-origin: bottom center;
        }

        .dock-icon-btn:hover {
          filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.35));
        }

        .dock-icon-btn:active {
          filter: brightness(0.88) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .dock-icon-btn:focus-visible {
          box-shadow: 0 0 0 2px rgba(10, 132, 255, 0.6);
        }

        /* Glass reflection overlay on each icon */
        .dock-icon-inner {
          width: 100%;
          height: 100%;
          position: relative;
          border-radius: 22%;
          overflow: hidden;
        }

        .dock-icon-reflection {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 50%;
          border-radius: 22% 22% 0 0;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.18) 0%,
            rgba(255, 255, 255, 0.06) 40%,
            transparent 100%
          );
          pointer-events: none;
        }

        /* --- Running indicator --- */

        .dock-indicator {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          margin-top: 3px;
          background: #ffffff;
          box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
          transition: opacity 0.2s ease;
          flex-shrink: 0;
        }

        [data-theme='light'] .dock-indicator {
          background: rgba(60, 60, 60, 0.75);
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
        }

        /* --- Separator --- */

        .dock-separator {
          width: 1px;
          height: 32px;
          background: rgba(255, 255, 255, 0.15);
          margin: 0 6px;
          align-self: center;
          flex-shrink: 0;
          border-radius: 0.5px;
        }

        [data-theme='light'] .dock-separator {
          background: rgba(0, 0, 0, 0.1);
        }

        /* --- Bounce animation: 3 bounces with decreasing amplitude, 800ms --- */

        .dock-bouncing {
          animation: dock-bounce 800ms ease-in-out;
        }

        @keyframes dock-bounce {
          0%   { transform: translateY(0); }
          15%  { transform: translateY(-20px); }
          30%  { transform: translateY(0); }
          45%  { transform: translateY(-10px); }
          60%  { transform: translateY(0); }
          75%  { transform: translateY(-5px); }
          90%  { transform: translateY(0); }
          100% { transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
