import { useCallback, useEffect, useRef, useState } from 'react';
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
  const isMinimized = state.status === 'minimized';

  // Track minimize animation state
  const [visuallyHidden, setVisuallyHidden] = useState(false);
  const [animatingMinimize, setAnimatingMinimize] = useState(false);
  const [animatingRestore, setAnimatingRestore] = useState(false);
  // Track maximize transition
  const [transitioning, setTransitioning] = useState(false);
  const prevStatusRef = useRef(state.status);

  // Handle minimize animation
  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = state.status;

    if (state.status === 'minimized' && prevStatus !== 'minimized') {
      // Animate out
      setAnimatingMinimize(true);
      setAnimatingRestore(false);
      const timer = setTimeout(() => {
        setVisuallyHidden(true);
        setAnimatingMinimize(false);
      }, 300);
      return () => clearTimeout(timer);
    }

    if (state.status !== 'minimized' && prevStatus === 'minimized') {
      // Animate in (restore from minimize)
      setVisuallyHidden(false);
      setAnimatingRestore(true);
      // Force a reflow before removing the animating class
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setAnimatingRestore(false);
        });
      });
    }
  }, [state.status]);

  // Handle maximize/restore transition
  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    // Detect maximize or restore-from-maximize transitions
    if (
      (state.status === 'maximized' && prevStatus === 'normal') ||
      (state.status === 'normal' && prevStatus === 'maximized')
    ) {
      setTransitioning(true);
      const timer = setTimeout(() => setTransitioning(false), 250);
      return () => clearTimeout(timer);
    }
  }, [state.status]);

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

  // Don't render at all if visually hidden (animation completed)
  if (isMinimized && visuallyHidden && !animatingMinimize) return null;

  return (
    <div
      ref={windowRef}
      className="absolute flex flex-col"
      role="dialog"
      aria-label={state.title}
      tabIndex={0}
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
        // Minimize animation
        ...(animatingMinimize
          ? {
              transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease',
              transform: 'scale(0.1) translateY(calc(100vh - 100%))',
              opacity: 0,
              pointerEvents: 'none' as const,
            }
          : {}),
        // Restore from minimize animation
        ...(animatingRestore
          ? {
              transform: 'scale(0.1) translateY(calc(100vh - 100%))',
              opacity: 0,
              transition: 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1), opacity 300ms ease',
            }
          : {}),
        // Maximize/restore smooth transition
        ...(transitioning
          ? {
              transition: 'left 250ms cubic-bezier(0.4, 0, 0.2, 1), top 250ms cubic-bezier(0.4, 0, 0.2, 1), width 250ms cubic-bezier(0.4, 0, 0.2, 1), height 250ms cubic-bezier(0.4, 0, 0.2, 1), border-radius 250ms cubic-bezier(0.4, 0, 0.2, 1)',
            }
          : {}),
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
