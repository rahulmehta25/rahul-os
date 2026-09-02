import { useCallback, useState } from 'react';
import { useWindowStore } from '../../stores/windowStore.ts';
import { appRegistry } from '../../apps/registry.tsx';
import { AppIcon } from '../shared/AppIcons.tsx';

const DESKTOP_APP_IDS = ['terminal', 'filemanager', 'browser', 'visitorboard', 'settings'];

export function DesktopIcons() {
  const openWindow = useWindowStore((s) => s.openWindow);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const icons = DESKTOP_APP_IDS.flatMap((id) => {
    const manifest = appRegistry[id];
    if (!manifest) return [];
    return [{ appId: manifest.id, label: manifest.name, defaultSize: manifest.defaultSize }];
  });

  const handleDoubleClick = useCallback(
    (appId: string, label: string, defaultSize?: { width: number; height: number }) => {
      openWindow(appId, label, { size: defaultSize });
    },
    [openWindow],
  );

  const handleClick = useCallback((e: React.MouseEvent, appId: string) => {
    e.stopPropagation();
    setSelectedId(appId);
  }, []);

  const handleDesktopClick = useCallback(() => {
    setSelectedId(null);
  }, []);

  return (
    <div
      className="absolute"
      style={{
        top: 'calc(var(--menubar-height) + 20px)',
        left: '20px',
        zIndex: 'var(--z-desktop-icons)',
        display: 'grid',
        gridTemplateColumns: '88px',
        gridAutoRows: '96px',
        gap: '4px',
      }}
      onClick={handleDesktopClick}
    >
      {icons.map((icon) => {
        const isSelected = selectedId === icon.appId;

        return (
          <button
            key={icon.appId}
            className="flex flex-col items-center justify-start"
            style={{
              width: '88px',
              paddingTop: '8px',
              paddingBottom: '6px',
              background: isSelected ? 'rgba(255, 255, 255, 0.14)' : 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'background 120ms ease',
              outline: 'none',
              borderRadius: '10px',
            }}
            onClick={(e) => handleClick(e, icon.appId)}
            onDoubleClick={() => handleDoubleClick(icon.appId, icon.label, icon.defaultSize)}
            aria-label={`Open ${icon.label}`}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                flexShrink: 0,
                filter: 'drop-shadow(0 6px 12px rgba(0,0,0,0.32)) drop-shadow(0 1px 2px rgba(0,0,0,0.2))',
                borderRadius: '14px',
                overflow: 'hidden',
                position: 'relative',
                boxShadow: isSelected ? '0 0 0 2px rgba(255, 255, 255, 0.55)' : 'none',
              }}
            >
              <AppIcon appId={icon.appId} />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '13px',
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 50%)',
                  pointerEvents: 'none',
                }}
              />
            </div>
            <span
              style={{
                marginTop: '5px',
                fontSize: 'var(--text-xs)',
                color: 'white',
                fontFamily: 'var(--font-system)',
                fontWeight: 500,
                letterSpacing: '0.01em',
                textShadow: '0 1px 3px rgba(0,0,0,0.75), 0 0 10px rgba(0,0,0,0.35)',
                lineHeight: 1.2,
                maxWidth: '84px',
                textAlign: 'center',
                padding: '1px 6px',
                borderRadius: '4px',
                background: isSelected ? 'rgba(255, 255, 255, 0.18)' : 'transparent',
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
