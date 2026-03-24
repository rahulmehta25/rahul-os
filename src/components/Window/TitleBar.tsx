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
        className="flex items-center gap-2 pl-3.5 pr-3 shrink-0"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Close */}
        <button
          className="rounded-full flex items-center justify-center transition-colors"
          style={{
            width: '14px',
            height: '14px',
            background: trafficLightColor('var(--color-close)'),
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Close window"
        >
          {hovered && (
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path
                d="M2 2L7 7M7 2L2 7"
                stroke="rgba(0,0,0,0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        {/* Minimize */}
        <button
          className="rounded-full flex items-center justify-center transition-colors"
          style={{
            width: '14px',
            height: '14px',
            background: trafficLightColor('var(--color-minimize)'),
          }}
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Minimize window"
        >
          {hovered && (
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              <path
                d="M2 4.5H7"
                stroke="rgba(0,0,0,0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>

        {/* Maximize — two diagonal arrows */}
        <button
          className="rounded-full flex items-center justify-center transition-colors"
          style={{
            width: '14px',
            height: '14px',
            background: trafficLightColor('var(--color-maximize)'),
          }}
          onClick={(e) => {
            e.stopPropagation();
            onMaximize();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Maximize window"
        >
          {hovered && (
            <svg width="9" height="9" viewBox="0 0 9 9" fill="none">
              {/* Arrow pointing top-left */}
              <path
                d="M1.5 3.5V1.5H3.5"
                stroke="rgba(0,0,0,0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M1.5 1.5L4 4"
                stroke="rgba(0,0,0,0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Arrow pointing bottom-right */}
              <path
                d="M7.5 5.5V7.5H5.5"
                stroke="rgba(0,0,0,0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.5 7.5L5 5"
                stroke="rgba(0,0,0,0.5)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Title */}
      <div
        className="flex-1 text-center truncate text-sm font-medium pointer-events-none"
        style={{
          color: isActive
            ? 'var(--color-text-primary)'
            : 'var(--color-text-tertiary)',
          marginRight: '72px',
        }}
      >
        {title}
      </div>
    </div>
  );
}
