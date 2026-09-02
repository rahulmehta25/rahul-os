import { useCallback, useRef, useState, useMemo } from 'react';
import { useWindowStore } from '../../stores/windowStore.ts';
import { appRegistry } from '../../apps/registry.tsx';
import { AppIcon } from '../shared/AppIcons.tsx';

interface DockApp {
  id: string;
  name: string;
  defaultSize?: { width: number; height: number };
}

const DOCK_APP_IDS = ['terminal', 'filemanager', 'texteditor', 'browser', 'visitorboard', 'snake'];
const UTILITY_APP_IDS = ['settings'];

function appsFromIds(ids: string[]): DockApp[] {
  return ids.flatMap((id) => {
    const manifest = appRegistry[id];
    if (!manifest) return [];
    return [
      {
        id: manifest.id,
        name: manifest.name,
        defaultSize: manifest.defaultSize,
      },
    ];
  });
}

const BASE_SIZE = 48;
const MAX_SIZE = 72;
const INFLUENCE_PX = 180;
const SIGMA = INFLUENCE_PX / 2.5;

function getScaleForDistance(pxDistance: number): number {
  if (pxDistance > INFLUENCE_PX) return 1.0;
  const gaussian = Math.exp(-(pxDistance * pxDistance) / (2 * SIGMA * SIGMA));
  const maxScale = MAX_SIZE / BASE_SIZE;
  return 1.0 + (maxScale - 1.0) * gaussian;
}

interface DockItemProps {
  app: DockApp;
  scale: number;
  hasOpenWindows: boolean;
  isActive: boolean;
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
  isActive,
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
        className={`dock-icon-btn${isBouncing ? ' dock-bouncing' : ''}${isActive ? ' dock-icon-active' : ''}`}
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
          <AppIcon appId={app.id} />
          <div className="dock-icon-reflection" />
        </div>
      </button>

      <div
        className={`dock-indicator${isActive ? ' dock-indicator-active' : ''}`}
        style={{ opacity: hasOpenWindows ? 1 : 0 }}
      />
    </div>
  );
}

export function Dock() {
  const { windows, openWindow, focusWindow, restoreWindow, activeWindowId } = useWindowStore();
  const [bouncing, setBouncing] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [scales, setScales] = useState<Record<string, number>>({});
  const iconRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const dockApps = useMemo(() => appsFromIds(DOCK_APP_IDS), []);
  const utilityApps = useMemo(() => appsFromIds(UTILITY_APP_IDS), []);
  const windowList = Object.values(windows);
  const activeAppId = activeWindowId ? windows[activeWindowId]?.appId : undefined;

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

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const mouseX = e.clientX;
    const next: Record<string, number> = {};
    iconRefs.current.forEach((el, id) => {
      const rect = el.getBoundingClientRect();
      const iconCenterX = rect.left + rect.width / 2;
      next[id] = getScaleForDistance(Math.abs(mouseX - iconCenterX));
    });
    setScales(next);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setScales({});
    setHoveredId(null);
  }, []);

  const setIconRef = useCallback(
    (id: string) => (el: HTMLDivElement | null) => {
      if (el) {
        iconRefs.current.set(id, el);
      } else {
        iconRefs.current.delete(id);
      }
    },
    [],
  );

  return (
    <>
      <div
        className="dock-container"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        role="toolbar"
        aria-label="App dock"
        style={{ zIndex: 'var(--z-dock)' } as React.CSSProperties}
      >
        {dockApps.map((app) => (
          <div key={app.id} ref={setIconRef(app.id)} className="dock-item-wrapper">
            <DockItem
              app={app}
              scale={scales[app.id] ?? 1}
              hasOpenWindows={windowList.some((w) => w.appId === app.id)}
              isActive={activeAppId === app.id}
              isBouncing={bouncing === app.id}
              isHovered={hoveredId === app.id}
              onMouseEnter={() => setHoveredId(app.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleClick(app)}
            />
          </div>
        ))}
        <div className="dock-separator" />
        {utilityApps.map((app) => (
          <div key={app.id} ref={setIconRef(app.id)} className="dock-item-wrapper">
            <DockItem
              app={app}
              scale={scales[app.id] ?? 1}
              hasOpenWindows={windowList.some((w) => w.appId === app.id)}
              isActive={activeAppId === app.id}
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
          gap: 4px;
          padding: 6px 10px 5px;
          background: var(--color-bg-dock);
          backdrop-filter: var(--glass-blur-dock);
          -webkit-backdrop-filter: var(--glass-blur-dock);
          border-radius: var(--radius-dock);
          border: 0.5px solid var(--color-border-active);
          box-shadow: var(--shadow-dock);
          animation: dock-rise 480ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes dock-rise {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
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

        .dock-tooltip {
          position: absolute;
          top: -38px;
          left: 50%;
          transform: translateX(-50%) translateY(6px);
          padding: 5px 11px;
          border-radius: 8px;
          background: var(--color-bg-surface);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border: 0.5px solid var(--color-border-active);
          color: var(--color-text-primary);
          font-size: var(--text-sm);
          font-weight: var(--weight-medium);
          letter-spacing: var(--tracking-snug);
          line-height: 1.3;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s ease, transform 0.15s ease;
          box-shadow: var(--shadow-toast);
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
          border-top: 5px solid var(--color-bg-surface);
        }

        [data-theme='light'] .dock-tooltip-arrow {
          border-top-color: var(--color-bg-surface);
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
          filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.28));
          transform-origin: bottom center;
        }

        .dock-icon-btn:hover {
          filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.32));
        }

        .dock-icon-btn:active {
          filter: brightness(0.88) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
        }

        .dock-icon-btn:focus-visible {
          box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.45);
        }

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
          height: 52%;
          border-radius: 22% 22% 40% 40%;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0.22) 0%,
            rgba(255, 255, 255, 0.06) 42%,
            transparent 100%
          );
          pointer-events: none;
        }

        .dock-indicator {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          margin-top: 3px;
          background: #ffffff;
          box-shadow: 0 0 5px rgba(255, 255, 255, 0.55);
          transition: opacity 0.2s ease, transform 0.2s ease;
          flex-shrink: 0;
        }

        .dock-indicator-active {
          transform: scale(1.15);
        }

        [data-theme='light'] .dock-indicator {
          background: rgba(60, 60, 60, 0.75);
          box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
        }

        .dock-separator {
          width: 1px;
          height: 36px;
          background: var(--color-border-active);
          margin: 0 8px;
          align-self: center;
          flex-shrink: 0;
          border-radius: 1px;
        }

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
