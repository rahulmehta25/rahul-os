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
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Granular selectors: actions are stable refs in Zustand, won't trigger re-renders.
  // Only isActive (derived boolean) triggers re-render when focus changes.
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const maximizeWindow = useWindowStore((s) => s.maximizeWindow);
  const updatePosition = useWindowStore((s) => s.updatePosition);
  const updateSize = useWindowStore((s) => s.updateSize);
  const isActive = useWindowStore((s) => s.activeWindowId === state.id);

  const isMaximized = state.status === 'maximized';
  const isMinimized = state.status === 'minimized';

  // Animation states
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [visuallyHidden, setVisuallyHidden] = useState(false);
  const [animatingMinimize, setAnimatingMinimize] = useState(false);
  const [animatingRestore, setAnimatingRestore] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const prevStatusRef = useRef(state.status);

  // Opening animation: mount with scale(0.9)/opacity(0), then animate in
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setMounted(true));
    });
  }, []);

  // Handle minimize animation
  useEffect(() => {
    const prevStatus = prevStatusRef.current;
    prevStatusRef.current = state.status;

    if (state.status === 'minimized' && prevStatus !== 'minimized') {
      setAnimatingMinimize(true);
      setAnimatingRestore(false);
      const timer = setTimeout(() => {
        setVisuallyHidden(true);
        setAnimatingMinimize(false);
      }, 300);
      return () => clearTimeout(timer);
    }

    if (state.status !== 'minimized' && prevStatus === 'minimized') {
      setVisuallyHidden(false);
      setAnimatingRestore(true);
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
    if (
      (state.status === 'maximized' && prevStatus === 'normal') ||
      (state.status === 'normal' && prevStatus === 'maximized')
    ) {
      setTransitioning(true);
      const timer = setTimeout(() => setTransitioning(false), 300);
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

  // Cleanup close timer on unmount
  useEffect(() => {
    return () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); };
  }, []);

  // Close with animation
  const handleClose = useCallback(() => {
    setClosing(true);
    closeTimerRef.current = setTimeout(() => closeWindow(state.id), 150);
  }, [closeWindow, state.id]);

  // Don't render if visually hidden (minimize animation completed)
  if (isMinimized && visuallyHidden && !animatingMinimize) return null;

  // Build inline style based on animation state
  const animStyle: React.CSSProperties = {};

  if (closing) {
    // Close animation: scale down slightly, fade out
    animStyle.transform = 'scale(0.95)';
    animStyle.opacity = 0;
    animStyle.transition = 'transform 150ms ease-in, opacity 150ms ease-in';
    animStyle.pointerEvents = 'none';
  } else if (animatingMinimize) {
    // Minimize animation: scale to 0.3, slide toward dock, fade
    animStyle.transform = 'scale(0.3) translateY(calc(100vh - 100%))';
    animStyle.opacity = 0;
    animStyle.transition = 'transform 300ms cubic-bezier(0.4, 0, 1, 1), opacity 300ms cubic-bezier(0.4, 0, 1, 1)';
    animStyle.pointerEvents = 'none';
  } else if (animatingRestore) {
    // Restore from minimize: start position (will animate away next frame)
    animStyle.transform = 'scale(0.3) translateY(calc(100vh - 100%))';
    animStyle.opacity = 0;
    animStyle.transition = 'transform 300ms cubic-bezier(0, 0, 0.2, 1), opacity 300ms cubic-bezier(0, 0, 0.2, 1)';
  } else if (transitioning) {
    // Maximize/restore transition
    animStyle.transition = 'left 300ms cubic-bezier(0.25, 0.1, 0.25, 1), top 300ms cubic-bezier(0.25, 0.1, 0.25, 1), width 300ms cubic-bezier(0.25, 0.1, 0.25, 1), height 300ms cubic-bezier(0.25, 0.1, 0.25, 1), border-radius 300ms cubic-bezier(0.25, 0.1, 0.25, 1)';
  } else if (!mounted) {
    // Opening animation: start small and transparent
    animStyle.transform = 'scale(0.9)';
    animStyle.opacity = 0;
  }

  // When mounted and not in any special animation, ensure normal state with transition for opening
  if (mounted && !closing && !animatingMinimize && !animatingRestore && !transitioning) {
    animStyle.transform = animStyle.transform || 'scale(1)';
    animStyle.opacity = animStyle.opacity ?? 1;
    // Only apply opening transition briefly
    if (!animStyle.transition) {
      animStyle.transition = 'transform 200ms ease-out, opacity 200ms ease-out';
    }
  }

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
        background: state.appId === 'terminal' || state.appId === 'snake'
          ? '#1e1e1e'
          : 'var(--color-bg-surface)',
        boxShadow: isActive
          ? 'var(--shadow-window-active)'
          : 'var(--shadow-window)',
        border: '0.5px solid var(--color-border)',
        backdropFilter: (state.appId === 'terminal' || state.appId === 'snake') ? 'none' : 'blur(40px) saturate(1.8)',
        WebkitBackdropFilter: (state.appId === 'terminal' || state.appId === 'snake') ? 'none' : 'blur(40px) saturate(1.8)',
        outline: 'none',
        overflow: 'hidden',
        ...animStyle,
      }}
      onPointerDown={handleFocus}
    >
      <TitleBar
        title={state.title}
        isActive={isActive}
        onClose={handleClose}
        onMinimize={() => minimizeWindow(state.id)}
        onMaximize={() => maximizeWindow(state.id)}
        onDragPointerDown={dragHandleProps.onPointerDown as (e: React.PointerEvent) => void}
      />

      {/* Content area — solid bg behind vibrancy for readability */}
      <div
        className="flex-1 overflow-hidden"
        style={{
          minHeight: 0,
          backgroundColor: state.appId === 'terminal'
            ? '#1e1e1e'
            : 'var(--color-bg-surface-solid)',
        }}
      >
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
