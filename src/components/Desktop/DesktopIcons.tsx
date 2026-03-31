import { useCallback, useState } from 'react';
import { useWindowStore } from '../../stores/windowStore.ts';
import { TerminalIcon, FinderIcon, SettingsIcon } from '../shared/AppIcons.tsx';

interface DesktopIcon {
  appId: string;
  label: string;
  icon: React.ReactNode;
  defaultSize?: { width: number; height: number };
}

const icons: DesktopIcon[] = [
  {
    appId: 'terminal',
    label: 'Terminal',
    icon: <TerminalIcon />,
    defaultSize: { width: 680, height: 420 },
  },
  {
    appId: 'filemanager',
    label: 'Files',
    icon: <FinderIcon />,
    defaultSize: { width: 800, height: 520 },
  },
  {
    appId: 'settings',
    label: 'Settings',
    icon: <SettingsIcon />,
    defaultSize: { width: 600, height: 450 },
  },
];

export function DesktopIcons() {
  const openWindow = useWindowStore((s) => s.openWindow);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleDoubleClick = useCallback(
    (icon: DesktopIcon) => {
      openWindow(icon.appId, icon.label, { size: icon.defaultSize });
    },
    [openWindow],
  );

  const handleClick = useCallback(
    (e: React.MouseEvent, appId: string) => {
      e.stopPropagation();
      setSelectedId(appId);
    },
    [],
  );

  const handleDesktopClick = useCallback(() => {
    setSelectedId(null);
  }, []);

  return (
    <div
      className="absolute"
      style={{
        top: 'calc(var(--menubar-height) + 16px)',
        left: '16px',
        zIndex: 'var(--z-desktop-icons)',
        display: 'grid',
        gridTemplateColumns: '86px',
        gridAutoRows: '90px',
      }}
      onClick={handleDesktopClick}
    >
      {icons.map((icon) => {
        const isSelected = selectedId === icon.appId;

        return (
          <button
            key={icon.appId}
            className="flex flex-col items-center justify-start gap-1 rounded-lg"
            style={{
              width: '86px',
              paddingTop: '6px',
              paddingBottom: '4px',
              background: isSelected ? 'rgba(10, 132, 255, 0.25)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 100ms',
              outline: 'none',
            }}
            onClick={(e) => handleClick(e, icon.appId)}
            onDoubleClick={() => handleDoubleClick(icon)}
            aria-label={`Open ${icon.label}`}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                flexShrink: 0,
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.35)) drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
                borderRadius: '13px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {icon.icon}
              {/* Glass highlight overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '13px',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
            <span
              style={{
                fontSize: '11px',
                color: 'white',
                fontFamily: 'var(--font-system)',
                fontWeight: 500,
                textShadow: '0 1px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.5), 0 2px 12px rgba(0,0,0,0.3)',
                lineHeight: 1.2,
                maxWidth: '76px',
                textAlign: 'center',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                wordBreak: 'break-word',
              }}
            >
              {icon.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
