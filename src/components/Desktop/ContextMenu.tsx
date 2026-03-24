import { useEffect, useCallback, useState } from 'react';
import { useWindowStore } from '../../stores/windowStore.ts';

interface MenuPosition {
  x: number;
  y: number;
}

export function ContextMenu() {
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const openWindow = useWindowStore((s) => s.openWindow);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Only show on the desktop surface, not on windows or dock
    if (target.closest('[role="dialog"]') || target.closest('[aria-label="Open"]') || target.closest('button')) {
      return;
    }
    e.preventDefault();
    setPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleClose = useCallback(() => {
    setPosition(null);
  }, []);

  useEffect(() => {
    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('click', handleClose);
    window.addEventListener('scroll', handleClose);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('click', handleClose);
      window.removeEventListener('scroll', handleClose);
    };
  }, [handleContextMenu, handleClose]);

  if (!position) return null;

  const items = [
    {
      label: 'New Folder',
      action: () => {
        // Placeholder for filesystem integration
        handleClose();
      },
    },
    { type: 'separator' as const },
    {
      label: 'Change Wallpaper',
      action: () => {
        openWindow('settings', 'Settings', { size: { width: 600, height: 450 } });
        handleClose();
      },
    },
    {
      label: 'About RahulOS',
      action: () => {
        openWindow('about', 'About This Computer', {
          size: { width: 420, height: 380 },
          minSize: { width: 360, height: 320 },
        });
        handleClose();
      },
    },
  ];

  // Clamp position so menu doesn't overflow viewport
  const menuWidth = 200;
  const menuHeight = items.length * 32;
  const x = Math.min(position.x, window.innerWidth - menuWidth - 8);
  const y = Math.min(position.y, window.innerHeight - menuHeight - 8);

  return (
    <div
      className="fixed"
      style={{
        left: x,
        top: y,
        zIndex: 'var(--z-context-menu)',
        animation: 'ctx-menu-in 0.12s ease-out',
      }}
    >
      <div
        className="py-1 rounded-lg overflow-hidden"
        style={{
          width: `${menuWidth}px`,
          background: 'var(--color-bg-surface-solid)',
          border: '1px solid var(--color-border-active)',
          boxShadow: 'var(--shadow-context-menu)',
          fontFamily: 'var(--font-system)',
          fontSize: '13px',
        }}
      >
        {items.map((item, i) => {
          if ('type' in item && item.type === 'separator') {
            return (
              <div
                key={`sep-${i}`}
                className="my-1"
                style={{ borderTop: '1px solid var(--color-border)' }}
              />
            );
          }
          return (
            <button
              key={item.label}
              className="w-full text-left px-3 py-1.5"
              style={{
                color: 'var(--color-text-primary)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'block',
                transition: 'background 80ms',
              }}
              onClick={item.action}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--color-accent)';
                e.currentTarget.style.color = 'var(--color-text-inverse)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--color-text-primary)';
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes ctx-menu-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
