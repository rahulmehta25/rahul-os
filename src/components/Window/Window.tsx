import { useCallback, useRef } from 'react';
import { useWindowStore } from '../../stores/windowStore.ts';
import type { WindowState } from '../../stores/windowStore.ts';
import { useDrag } from '../../hooks/useDrag.ts';
import { useResize } from '../../hooks/useResize.ts';
import { TitleBar } from './TitleBar.tsx';

interface WindowProps {
  state: WindowState;
  children: React.ReactNode;
}

export function Window({ state, children }: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const {
    closeWindow,
    focusWindow,
    minimizeWindow,
    maximizeWindow,
    updatePosition,
    updateSize,
    activeWindowId,
  } = useWindowStore();

  const isActive = activeWindowId === state.id;
  const isMaximized = state.status === 'maximized';

  const handleDragEnd = useCallback(
    (position: { x: number; y: number }) => {
      updatePosition(state.id, position);
    },
    [state.id, updatePosition],
  );

  const handleFocus = useCallback(() => {
    focusWindow(state.id);
  }, [state.id, focusWindow]);

  const { dragHandleProps } = useDrag({
    windowRef,
    initialPosition: state.position,
    onDragEnd: handleDragEnd,
    onDragStart: handleFocus,
    enabled: !isMaximized,
  });

  const handleResizeEnd = useCallback(
    (position: { x: number; y: number }, size: { width: number; height: number }) => {
      updatePosition(state.id, position);
      updateSize(state.id, size);
    },
    [state.id, updatePosition, updateSize],
  );

  const { resizeHandles } = useResize({
    windowRef,
    initialPosition: state.position,
    initialSize: state.size,
    minSize: state.minSize,
    onResizeEnd: handleResizeEnd,
    enabled: !isMaximized,
  });

  if (state.status === 'minimized') return null;

  return (
    <div
      ref={windowRef}
      className="absolute flex flex-col"
      role="dialog"
      aria-label={state.title}
      style={{
        left: state.position.x,
        top: state.position.y,
        width: state.size.width,
        height: state.size.height,
        zIndex: state.zIndex,
        borderRadius: isMaximized ? 0 : 'var(--radius-window)',
        background: 'var(--color-bg-surface)',
        boxShadow: isActive
          ? 'var(--shadow-window-active)'
          : 'var(--shadow-window)',
        border: `1px solid ${isActive ? 'var(--color-border-active)' : 'var(--color-border)'}`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        outline: 'none',
        overflow: 'hidden',
      }}
      onPointerDown={handleFocus}
    >
      <TitleBar
        title={state.title}
        isActive={isActive}
        onClose={() => closeWindow(state.id)}
        onMinimize={() => minimizeWindow(state.id)}
        onMaximize={() => maximizeWindow(state.id)}
        onDragPointerDown={dragHandleProps.onPointerDown as (e: React.PointerEvent) => void}
      />

      {/* Content area */}
      <div className="flex-1 overflow-hidden" style={{ minHeight: 0 }}>
        {children}
      </div>

      {/* Resize handles */}
      {!isMaximized &&
        resizeHandles.map((handle) => (
          <div key={handle.key} {...handle.props} />
        ))}
    </div>
  );
}
