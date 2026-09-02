import { useCallback, useState } from 'react';
import { AppIcon } from '../shared/AppIcons.tsx';

interface TitleBarProps {
  title: string;
  appId: string;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onDragPointerDown: (e: React.PointerEvent) => void;
}

export function TitleBar({
  title,
  appId,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onDragPointerDown,
}: TitleBarProps) {
  const [hovered, setHovered] = useState(false);
  const showGlyphs = hovered;

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onMaximize();
    },
    [onMaximize],
  );

  const lightFill = (activeColor: string) =>
    isActive || hovered ? activeColor : 'var(--color-traffic-inactive)';

  const trafficLightShadow =
    isActive || hovered
      ? 'inset 0 -0.5px 0.5px rgba(0,0,0,0.22), inset 0 0.5px 0.5px rgba(255,255,255,0.28)'
      : 'none';

  return (
    <div
      className="flex items-center shrink-0 select-none"
      style={{
        height: 'var(--titlebar-height)',
        background: isActive
          ? 'var(--color-bg-titlebar)'
          : 'var(--color-bg-titlebar-inactive)',
        borderBottom: '0.5px solid var(--color-border)',
        borderRadius: 'var(--radius-window) var(--radius-window) 0 0',
        touchAction: 'none',
      }}
      onDoubleClick={handleDoubleClick}
      onPointerDown={onDragPointerDown}
    >
      <div
        className="flex items-center shrink-0"
        style={{ paddingLeft: '12px', paddingRight: '8px', gap: '8px', height: '100%' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <TrafficLight
          color={lightFill('var(--color-close)')}
          shadow={trafficLightShadow}
          label="Close window"
          onClick={onClose}
        >
          {showGlyphs && (
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <path
                d="M0.5 0.5L5.5 5.5M5.5 0.5L0.5 5.5"
                stroke="#4D0000"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </TrafficLight>

        <TrafficLight
          color={lightFill('var(--color-minimize)')}
          shadow={trafficLightShadow}
          label="Minimize window"
          onClick={onMinimize}
        >
          {showGlyphs && (
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <path
                d="M1 3H5"
                stroke="#995700"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </TrafficLight>

        <TrafficLight
          color={lightFill('var(--color-maximize)')}
          shadow={trafficLightShadow}
          label="Maximize window"
          onClick={onMaximize}
        >
          {showGlyphs && (
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <path
                d="M0.5 2V0.5H2"
                stroke="#006500"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5.5 4V5.5H4"
                stroke="#006500"
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </TrafficLight>
      </div>

      <div
        className="flex-1 flex items-center justify-center min-w-0 pointer-events-none"
        style={{ marginRight: '68px', gap: '6px' }}
      >
        <div
          style={{
            width: '14px',
            height: '14px',
            flexShrink: 0,
            borderRadius: '3.5px',
            overflow: 'hidden',
            opacity: isActive ? 1 : 0.72,
            background: 'rgba(255,255,255,0.1)',
            boxShadow: '0 0 0 0.5px rgba(255,255,255,0.22)',
          }}
        >
          <AppIcon appId={appId} />
        </div>
        <div
          className="truncate"
          style={{
            color: isActive
              ? 'var(--color-text-primary)'
              : 'var(--color-text-tertiary)',
            fontSize: 'var(--text-sm)',
            fontWeight: 'var(--weight-medium)',
            fontFamily: 'var(--font-system)',
            letterSpacing: 'var(--tracking-snug)',
            lineHeight: 1,
          }}
        >
          {title}
        </div>
      </div>
    </div>
  );
}

function TrafficLight({
  color,
  shadow,
  label,
  onClick,
  children,
}: {
  color: string;
  shadow: string;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      className="rounded-full flex items-center justify-center"
      style={{
        width: '12px',
        height: '12px',
        background: color,
        transition: 'background 100ms ease, filter 100ms ease',
        boxShadow: shadow,
        padding: 0,
        border: 'none',
        cursor: 'default',
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerDown={(e) => e.stopPropagation()}
      aria-label={label}
    >
      {children}
    </button>
  );
}
