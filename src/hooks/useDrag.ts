import { useCallback, useRef, useEffect } from 'react';
import type { Position } from '../stores/windowStore.ts';

interface UseDragOptions {
  windowRef: React.RefObject<HTMLDivElement | null>;
  initialPosition: Position;
  onDragEnd: (position: Position) => void;
  onDragStart?: () => void;
  enabled?: boolean;
}

export function useDrag({
  windowRef,
  initialPosition,
  onDragEnd,
  onDragStart,
  enabled = true,
}: UseDragOptions) {
  const isDragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const onDragEndRef = useRef(onDragEnd);
  onDragEndRef.current = onDragEnd;

  // Keep startPos in sync with latest position from props
  const posRef = useRef(initialPosition);
  posRef.current = initialPosition;

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      if (!windowRef.current) return;

      const dx = e.clientX - startMouse.current.x;
      const dy = e.clientY - startMouse.current.y;

      windowRef.current.style.transform = `translate(${dx}px, ${dy}px)`;
      windowRef.current.style.willChange = 'transform';
    };

    const handleUp = (e: PointerEvent) => {
      if (!isDragging.current || !windowRef.current) return;
      isDragging.current = false;
      try { (e.target as HTMLElement).releasePointerCapture(e.pointerId); } catch { /* already released */ }

      const dx = e.clientX - startMouse.current.x;
      const dy = e.clientY - startMouse.current.y;
      const finalX = startPos.current.x + dx;
      const finalY = Math.max(28, startPos.current.y + dy);

      windowRef.current.style.transform = '';
      windowRef.current.style.willChange = '';
      onDragEndRef.current({ x: finalX, y: finalY });
    };

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
    return () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
    };
  }, [windowRef]);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!enabled || !windowRef.current) return;
      if (e.button !== 0) return;

      isDragging.current = true;
      startMouse.current = { x: e.clientX, y: e.clientY };
      startPos.current = { ...posRef.current };
      (e.target as HTMLElement).setPointerCapture(e.pointerId);

      onDragStart?.();
    },
    [enabled, onDragStart, windowRef],
  );

  return {
    dragHandleProps: {
      onPointerDown: handlePointerDown,
      style: { cursor: enabled ? 'default' : 'default', touchAction: 'none' as const },
    },
  };
}
