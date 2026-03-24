import { useCallback, useRef, useEffect } from 'react';
import type { Position, Size } from '../stores/windowStore.ts';

type ResizeDirection =
  | 'n' | 's' | 'e' | 'w'
  | 'ne' | 'nw' | 'se' | 'sw';

interface UseResizeOptions {
  windowRef: React.RefObject<HTMLDivElement | null>;
  initialPosition: Position;
  initialSize: Size;
  minSize: Size;
  onResizeEnd: (position: Position, size: Size) => void;
  enabled?: boolean;
}

export function useResize({
  windowRef,
  initialPosition,
  initialSize,
  minSize,
  onResizeEnd,
  enabled = true,
}: UseResizeOptions) {
  const isResizing = useRef(false);
  const direction = useRef<ResizeDirection>('se');
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });
  const onResizeEndRef = useRef(onResizeEnd);
  onResizeEndRef.current = onResizeEnd;

  const posRef = useRef(initialPosition);
  posRef.current = initialPosition;
  const sizeRef = useRef(initialSize);
  sizeRef.current = initialSize;

  const compute = useCallback((dx: number, dy: number) => {
    const dir = direction.current;
    let newWidth = startSize.current.width;
    let newHeight = startSize.current.height;
    let translateX = 0;
    let translateY = 0;
    let newX = startPos.current.x;
    let newY = startPos.current.y;

    if (dir.includes('e')) newWidth = Math.max(minSize.width, startSize.current.width + dx);
    if (dir.includes('s')) newHeight = Math.max(minSize.height, startSize.current.height + dy);
    if (dir.includes('w')) {
      const proposedWidth = startSize.current.width - dx;
      if (proposedWidth >= minSize.width) {
        newWidth = proposedWidth;
        translateX = dx;
        newX = startPos.current.x + dx;
      }
    }
    if (dir.includes('n')) {
      const proposedHeight = startSize.current.height - dy;
      if (proposedHeight >= minSize.height) {
        newHeight = proposedHeight;
        translateY = dy;
        newY = startPos.current.y + dy;
      }
    }

    return { newWidth, newHeight, translateX, translateY, newX, newY };
  }, [minSize]);

  useEffect(() => {
    const handleMove = (e: PointerEvent) => {
      if (!isResizing.current || !windowRef.current) return;

      const dx = e.clientX - startMouse.current.x;
      const dy = e.clientY - startMouse.current.y;
      const { newWidth, newHeight, translateX, translateY } = compute(dx, dy);

      const el = windowRef.current;
      el.style.width = `${newWidth}px`;
      el.style.height = `${newHeight}px`;
      el.style.transform = `translate(${translateX}px, ${translateY}px)`;
      el.style.willChange = 'transform';
    };

    const handleUp = (e: PointerEvent) => {
      if (!isResizing.current || !windowRef.current) return;
      isResizing.current = false;

      const dx = e.clientX - startMouse.current.x;
      const dy = e.clientY - startMouse.current.y;
      const { newWidth, newHeight, newX, newY } = compute(dx, dy);

      windowRef.current.style.transform = '';
      windowRef.current.style.width = '';
      windowRef.current.style.height = '';
      windowRef.current.style.willChange = '';
      onResizeEndRef.current({ x: newX, y: newY }, { width: newWidth, height: newHeight });
    };

    document.addEventListener('pointermove', handleMove);
    document.addEventListener('pointerup', handleUp);
    return () => {
      document.removeEventListener('pointermove', handleMove);
      document.removeEventListener('pointerup', handleUp);
    };
  }, [windowRef, compute]);

  const handlePointerDown = useCallback(
    (dir: ResizeDirection) => (e: React.PointerEvent) => {
      if (!enabled || !windowRef.current) return;
      e.stopPropagation();
      e.preventDefault();

      isResizing.current = true;
      direction.current = dir;
      startMouse.current = { x: e.clientX, y: e.clientY };
      startPos.current = { ...posRef.current };
      startSize.current = { ...sizeRef.current };
    },
    [enabled, windowRef],
  );

  const cursorMap: Record<ResizeDirection, string> = {
    n: 'ns-resize',
    s: 'ns-resize',
    e: 'ew-resize',
    w: 'ew-resize',
    ne: 'nesw-resize',
    sw: 'nesw-resize',
    nw: 'nwse-resize',
    se: 'nwse-resize',
  };

  const directions: ResizeDirection[] = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'];

  const resizeHandles = directions.map((dir) => {
    const style: React.CSSProperties = {
      position: 'absolute',
      zIndex: 1,
      cursor: cursorMap[dir],
      touchAction: 'none',
    };

    const thickness = 6;

    if (dir === 'n') Object.assign(style, { top: -thickness / 2, left: thickness, right: thickness, height: thickness });
    if (dir === 's') Object.assign(style, { bottom: -thickness / 2, left: thickness, right: thickness, height: thickness });
    if (dir === 'e') Object.assign(style, { right: -thickness / 2, top: thickness, bottom: thickness, width: thickness });
    if (dir === 'w') Object.assign(style, { left: -thickness / 2, top: thickness, bottom: thickness, width: thickness });
    if (dir === 'nw') Object.assign(style, { top: -thickness / 2, left: -thickness / 2, width: thickness * 2, height: thickness * 2 });
    if (dir === 'ne') Object.assign(style, { top: -thickness / 2, right: -thickness / 2, width: thickness * 2, height: thickness * 2 });
    if (dir === 'sw') Object.assign(style, { bottom: -thickness / 2, left: -thickness / 2, width: thickness * 2, height: thickness * 2 });
    if (dir === 'se') Object.assign(style, { bottom: -thickness / 2, right: -thickness / 2, width: thickness * 2, height: thickness * 2 });

    return {
      key: dir,
      props: {
        style,
        onPointerDown: handlePointerDown(dir),
      },
    };
  });

  return { resizeHandles };
}
