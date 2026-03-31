import { useEffect, useCallback, useState } from 'react';
import { useWindowStore } from '../../stores/windowStore.ts';
import { useFilesystemStore } from '../../stores/filesystemStore.ts';
import { useModalStore } from '../../stores/modalStore.ts';

interface MenuPosition {
  x: number;
  y: number;
}

export function ContextMenu() {
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const openWindow = useWindowStore((s) => s.openWindow);
  const createDirectory = useFilesystemStore((s) => s.createDirectory);
  const getNode = useFilesystemStore((s) => s.getNode);
  const openModal = useModalStore((s) => s.openModal);

  const handleContextMenu = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('[role="dialog"]') ||
      target.closest('[aria-label="Open"]') ||
      target.closest('button') ||
      target.closest('.dock-container') ||
      target.closest('[data-menubar-root]')
    ) {
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
        const desktopPath = '/home/rahul/Desktop';
        if (!getNode(desktopPath)) {
          createDirectory(desktopPath);
        }
        let name = 'Untitled Folder';
        let counter = 1;
        while (getNode(`${desktopPath}/${name}`)) {
          counter++;
          name = `Untitled Folder ${counter}`;
        }
        createDirectory(`${desktopPath}/${name}`);
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
        openModal('about');
        handleClose();
      },
    },
  ];

  const menuWidth = 220;
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
        animation: 'ctx-menu-in 0.1s ease-out',
      }}
    >
      <div
        className="py-1 overflow-hidden"
        style={{
          width: `${menuWidth}px`,
          background: 'var(--color-bg-surface)',
          backdropFilter: 'blur(40px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.8)',
          border: '0.5px solid var(--color-border-active)',
          borderRadius: 'var(--radius-context-menu)',
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
                style={{ borderTop: '0.5px solid var(--color-border)', margin: '4px 0' }}
              />
            );
          }
          return (
            <ContextMenuItem
              key={item.label}
              label={item.label}
              onClick={item.action}
            />
          );
        })}
      </div>

      <style>{`
        @keyframes ctx-menu-in {
          from {
            opacity: 0;
            transform: scale(0.96);
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

function ContextMenuItem({ label, onClick }: { label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className="w-full text-left"
      style={{
        color: hovered ? '#ffffff' : 'var(--color-text-primary)',
        background: hovered ? 'var(--color-accent)' : 'transparent',
        borderRadius: hovered ? 4 : 0,
        margin: hovered ? '0 4px' : 0,
        width: hovered ? 'calc(100% - 8px)' : '100%',
        display: 'block',
        border: 'none',
        cursor: 'default',
        fontFamily: 'var(--font-system)',
        fontSize: '13px',
        lineHeight: '22px',
        padding: '1px 10px',
        transition: 'background 60ms ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
