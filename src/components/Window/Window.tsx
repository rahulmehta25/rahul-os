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

const OPAQUE_APPS = new Set(['terminal', 'snake']);

export function Window({ state, children }: WindowProps) {
  const windowRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const closeWindow = useWindowStore((s) => s.closeWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const minimizeWindow = useWindowStore((s) => s.minimizeWindow);
  const maximizeWindow = useWindowStore((s) => s.maximizeWindow);
  const updatePosition = useWindowStore((s) => s.updatePosition);
  const updateSize = useWindowStore((s) => s.updateSize);
  const isActive = useWindowStore((s) => s.activeWindowId === state.id);

  const isMaximized = state.status === 'maximized';
  const isMinimized = state.status === 'minimized';
  const isOpaque = OPAQUE_APPS.has(state.appId);

  const [mounted, setMounted] = useState(false);
  const [opened, setOpened] = useState(false);
  const [closing, setClosing] = useState(false);
  const [visuallyHidden, setVisuallyHidden] = useState(false);
  const [animatingMinimize, setAnimatingMinimize] = useState(false);
  const [animatingRestore, setAnimatingRestore] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const prevStatusRef = useRef(state.status);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setMounted(true));
    });
    const timer = setTimeout(() => setOpened(true), 300);
    return () => clearTimeout(timer);
  }, []);

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

  useEffect(() => {
    return () => { if (closeTimerRef.current) clearTimeout(closeTimerRef.current); };
  }, []);

  const handleClose = useCallback(() => {
    setClosing(true);
    closeTimerRef.current = setTimeout(() => closeWindow(state.id), 150);
  }, [closeWindow, state.id]);

  if (isMinimized && visuallyHidden && !animatingMinimize) return null;

  const animStyle: React.CSSProperties = {};

  if (closing) {
    animStyle.transform = 'translateY(8px)';
    animStyle.opacity = 0;
    animStyle.transition = 'transform 160ms ease-in, opacity 160ms ease-in';
    animStyle.pointerEvents = 'none';
  } else if (animatingMinimize) {
    animStyle.transform = 'scale(0.3) translateY(calc(100vh - 100%))';
    animStyle.opacity = 0;
    animStyle.transition = 'transform 300ms cubic-bezier(0.4, 0, 1, 1), opacity 300ms cubic-bezier(0.4, 0, 1, 1)';
    animStyle.pointerEvents = 'none';
  } else if (animatingRestore) {
    animStyle.transform = 'scale(0.3) translateY(calc(100vh - 100%))';
    animStyle.opacity = 0;
    animStyle.transition = 'transform 300ms cubic-bezier(0, 0, 0.2, 1), opacity 300ms cubic-bezier(0, 0, 0.2, 1)';
  } else if (transitioning) {
    animStyle.transition = 'left 300ms cubic-bezier(0.22, 1, 0.36, 1), top 300ms cubic-bezier(0.22, 1, 0.36, 1), width 300ms cubic-bezier(0.22, 1, 0.36, 1), height 300ms cubic-bezier(0.22, 1, 0.36, 1), border-radius 300ms cubic-bezier(0.22, 1, 0.36, 1)';
  } else if (!mounted) {
    animStyle.transform = 'translateY(8px)';
    animStyle.opacity = 0;
  }

  if (mounted && !closing && !animatingMinimize && !animatingRestore && !transitioning) {
    if (!opened) {
      animStyle.transform = 'translateY(0)';
      animStyle.opacity = 1;
      animStyle.transition = 'transform 280ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms cubic-bezier(0.22, 1, 0.36, 1)';
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
        background: isOpaque
          ? '#161616'
          : isActive
            ? 'var(--color-bg-surface)'
            : 'var(--color-bg-surface-inactive)',
        boxShadow: isMaximized
          ? 'none'
          : isActive
            ? 'var(--shadow-window-active)'
            : 'var(--shadow-window)',
        border: isMaximized ? 'none' : '0.5px solid var(--color-border-active)',
        backdropFilter: isOpaque ? 'none' : 'var(--glass-blur)',
        WebkitBackdropFilter: isOpaque ? 'none' : 'var(--glass-blur)',
        outline: 'none',
        overflow: 'hidden',
        ...animStyle,
      }}
      onPointerDown={handleFocus}
    >
      {!isMaximized && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            boxShadow: 'var(--glass-highlight)',
            zIndex: 3,
          }}
        />
      )}

      <TitleBar
        title={state.title}
        appId={state.appId}
        isActive={isActive}
        onClose={handleClose}
        onMinimize={() => minimizeWindow(state.id)}
        onMaximize={() => maximizeWindow(state.id)}
        onDragPointerDown={dragHandleProps.onPointerDown as (e: React.PointerEvent) => void}
      />

      <div
        className="flex-1 overflow-hidden"
        style={{
          minHeight: 0,
          backgroundColor: isOpaque
            ? '#161616'
            : 'var(--color-bg-surface-solid)',
        }}
      >
        {children}
      </div>

      {!isMaximized &&
        resizeHandles.map((handle) => (
          <div key={handle.key} {...handle.props} />
        ))}
    </div>
  );
}
