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
        <button
          className="w-3 h-3 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: isActive || hovered
              ? 'var(--color-close)'
              : 'var(--color-traffic-inactive)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Close window"
        >
          {hovered && (
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1.5 1.5L6.5 6.5M6.5 1.5L1.5 6.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          )}
        </button>

        <button
          className="w-3 h-3 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: isActive || hovered
              ? 'var(--color-minimize)'
              : 'var(--color-traffic-inactive)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onMinimize();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Minimize window"
        >
          {hovered && (
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1.5 4H6.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          )}
        </button>

        <button
          className="w-3 h-3 rounded-full flex items-center justify-center transition-colors"
          style={{
            background: isActive || hovered
              ? 'var(--color-maximize)'
              : 'var(--color-traffic-inactive)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onMaximize();
          }}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label="Maximize window"
        >
          {hovered && (
            <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
              <path d="M1.5 2.5L4 0.5L6.5 2.5M1.5 5.5L4 7.5L6.5 5.5" stroke="rgba(0,0,0,0.5)" strokeWidth="1.0" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      {/* Title */}
      <div
        className="flex-1 text-center truncate text-xs font-medium pointer-events-none"
        style={{
          color: isActive
            ? 'var(--color-text-primary)'
            : 'var(--color-text-tertiary)',
          paddingRight: '68px',
        }}
      >
        {title}
      </div>
    </div>
  );
}
