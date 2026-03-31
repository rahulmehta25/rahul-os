import { useCallback, useState } from 'react';

interface TitleBarProps {
  title: string;
  isActive: boolean;
  onClose: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onDragPointerDown: (e: React.PointerEvent) => void;
}

export function TitleBar({
  title,
  isActive,
  onClose,
  onMinimize,
  onMaximize,
  onDragPointerDown,
}: TitleBarProps) {
  const [hovered, setHovered] = useState(false);

  const handleDoubleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onMaximize();
    },
    [onMaximize],
  );

  const trafficLightColor = (activeColor: string) =>
    isActive || hovered ? activeColor : 'var(--color-traffic-inactive)';

  const trafficLightShadow =
    isActive || hovered
      ? 'inset 0 -0.5px 0.5px rgba(0,0,0,0.2)'
      : 'none';

  return (
    <div
      className="flex items-center shrink-0 select-none"
      style={{
        height: 'var(--titlebar-height)',
        background: isActive
          ? 'var(--color-bg-titlebar)'
          : 'var(--color-bg-titlebar-inactive)',
        borderBottom: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-window) var(--radius-window) 0 0',
        touchAction: 'none',
      }}
      onDoubleClick={handleDoubleClick}
      onPointerDown={onDragPointerDown}
    >
      {/* Traffic lights */}
      <div
        className="flex items-center shrink-0"
        style={{ paddingLeft: '14px', paddingRight: '8px', gap: '8px' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Close */}
        <button
          className="rounded-full flex items-center justify-center"
          style={{
            width: '12px',
            height: '12px',
            background: trafficLightColor('var(--color-close)'),
            transition: 'background 100ms ease',
            boxShadow: trafficLightShadow,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Close window"
        >
          {hovered && (
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <path
                d="M0.5 0.5L5.5 5.5M5.5 0.5L0.5 5.5"
                stroke="#4D0000"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        {/* Minimize */}
        <button
          className="rounded-full flex items-center justify-center"
          style={{
            width: '12px',
            height: '12px',
            background: trafficLightColor('var(--color-minimize)'),
            transition: 'background 100ms ease',
            boxShadow: trafficLightShadow,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Minimize window"
        >
          {hovered && (
            <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
              <path
                d="M1 3H5"
                stroke="#995700"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        {/* Maximize */}
        <button
          className="rounded-full flex items-center justify-center"
          style={{
            width: '12px',
            height: '12px',
            background: trafficLightColor('var(--color-maximize)'),
            transition: 'background 100ms ease',
            boxShadow: trafficLightShadow,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onMaximize();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Maximize window"
        >
          {hovered && (
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
        </button>
      </div>

      {/* Title */}
      <div
        className="flex-1 text-center truncate pointer-events-none"
        style={{
          color: isActive
            ? 'var(--color-text-primary)'
            : 'var(--color-text-secondary)',
          fontSize: '13px',
          fontWeight: 600,
          fontFamily: 'var(--font-system)',
          letterSpacing: '-0.01em',
          marginRight: '60px',
        }}
      >
        {title}
      </div>
    </div>
  );
}
