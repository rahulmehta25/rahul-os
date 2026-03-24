import { useEffect, useState, useRef, useCallback } from 'react';
import { useWindowStore } from '../../stores/windowStore.ts';
import { useModalStore } from '../../stores/modalStore.ts';
import { appRegistry } from '../../apps/registry.tsx';

export function MenuBar() {
  const [time, setTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const openWindow = useWindowStore((s) => s.openWindow);
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const windows = useWindowStore((s) => s.windows);
  const openModal = useModalStore((s) => s.openModal);

  const activeWindow = activeWindowId ? windows[activeWindowId] : null;
  const activeAppName = activeWindow?.title ?? null;

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('pointerdown', handleClick);
    return () => document.removeEventListener('pointerdown', handleClick);
  }, [menuOpen]);

  const handleOpenApp = useCallback(
    (appId: string) => {
      const manifest = appRegistry[appId];
      if (!manifest) return;
      openWindow(appId, manifest.name, {
        size: manifest.defaultSize,
        minSize: manifest.minSize,
      });
      setMenuOpen(false);
    },
    [openWindow],
  );

  const formatted = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className="fixed top-0 left-0 right-0 flex items-center justify-between select-none"
      style={{
        height: 'var(--menubar-height)',
        background: 'rgba(0, 0, 0, 0.25)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderBottom: '1px solid var(--color-border)',
        zIndex: 'var(--z-menubar)',
        fontFamily: 'var(--font-system)',
        fontSize: '13px',
        color: 'var(--color-text-primary)',
        paddingLeft: '8px',
        paddingRight: '12px',
      }}
    >
      {/* Left side: Logo + active app name */}
      <div className="flex items-center" style={{ height: '100%' }} ref={menuRef}>
        <button
          className="flex items-center border-none cursor-default"
          style={{
            height: '100%',
            padding: '0 10px',
            gap: '6px',
            background: menuOpen ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
            borderRadius: '4px',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-system)',
            fontSize: '13px',
            fontWeight: 600,
            lineHeight: 1,
          }}
          onClick={() => setMenuOpen((v) => !v)}
          onMouseEnter={(e) => {
            if (!menuOpen) e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
          onMouseLeave={(e) => {
            if (!menuOpen) e.currentTarget.style.background = 'transparent';
          }}
        >
          <AppleIcon />
          <span>RahulOS</span>
        </button>

        {activeAppName && (
          <span
            style={{
              marginLeft: '16px',
              fontWeight: 400,
              fontSize: '13px',
              color: 'var(--color-text-primary)',
              opacity: 0.9,
            }}
          >
            {activeAppName}
          </span>
        )}

        {menuOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'var(--menubar-height)',
              left: 4,
              minWidth: 220,
              background: 'rgba(30, 30, 30, 0.85)',
              backdropFilter: 'blur(30px)',
              WebkitBackdropFilter: 'blur(30px)',
              borderRadius: 6,
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              padding: '4px 0',
              zIndex: 9999,
            }}
          >
            <MenuItem
              label="About This Computer"
              onClick={() => { openModal('about'); setMenuOpen(false); }}
            />
            <MenuItem
              label="Settings"
              onClick={() => handleOpenApp('settings')}
            />
            <div
              style={{
                height: 1,
                background: 'rgba(255, 255, 255, 0.1)',
                margin: '4px 8px',
              }}
            />
            <MenuItem
              label="Sleep"
              onClick={() => {
                // eslint-disable-next-line no-console
                console.log('RahulOS is sleeping... Sweet dreams!');
                setMenuOpen(false);
              }}
            />
          </div>
        )}
      </div>

      {/* Right side: Status icons + Date/Time */}
      <div
        className="flex items-center"
        style={{
          height: '100%',
          gap: '16px',
          color: 'var(--color-text-primary)',
        }}
      >
        {/* Control Center: 2x2 dot grid */}
        <ControlCenterIcon />

        {/* Wi-Fi icon */}
        <WifiIcon />

        {/* Battery icon + percentage */}
        <div className="flex items-center" style={{ gap: '5px' }}>
          <BatteryIcon />
          <span style={{ fontSize: '12px', fontWeight: 400 }}>100%</span>
        </div>

        {/* Date and Time */}
        <div className="flex items-center" style={{ gap: '6px' }}>
          <span style={{ fontWeight: 400 }}>{dateStr}</span>
          <span style={{ fontWeight: 600 }}>{formatted}</span>
        </div>
      </div>
    </div>
  );
}

function AppleIcon() {
  return (
    <svg
      width="13"
      height="15"
      viewBox="0 0 17 20"
      fill="currentColor"
      style={{ display: 'block' }}
    >
      <path d="M13.784 10.286c-.027-2.617 2.136-3.874 2.232-3.935-1.214-1.776-3.105-2.02-3.778-2.047-1.608-.163-3.14.947-3.956.947-.816 0-2.078-.922-3.414-.898-1.757.026-3.377 1.022-4.282 2.596-1.825 3.168-.467 7.862 1.312 10.434.87 1.258 1.906 2.672 3.268 2.622 1.312-.053 1.808-.849 3.394-.849 1.586 0 2.032.849 3.42.822 1.41-.024 2.306-1.282 3.172-2.543.998-1.459 1.41-2.87 1.436-2.943-.032-.013-2.757-1.058-2.784-4.197l-.02-.01zM11.147 2.842C11.874 1.96 12.366.768 12.234-.41c-1.016.041-2.248.677-2.977 1.532-.654.756-1.226 1.964-1.072 3.124 1.134.088 2.29-.576 2.962-1.404z" />
    </svg>
  );
}

function ControlCenterIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="currentColor"
      style={{ display: 'block', opacity: 0.9 }}
    >
      <circle cx="5" cy="5" r="2.4" />
      <circle cx="11" cy="5" r="2.4" />
      <circle cx="5" cy="11" r="2.4" />
      <circle cx="11" cy="11" r="2.4" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', opacity: 0.9 }}
    >
      <path d="M1.5 7.5a13 13 0 0 1 17 0" />
      <path d="M5 11a8.5 8.5 0 0 1 10 0" />
      <path d="M8.3 14.3a4.2 4.2 0 0 1 3.4 0" />
      <circle cx="10" cy="17" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  );
}

function BatteryIcon() {
  return (
    <svg
      width="22"
      height="11"
      viewBox="0 0 25 12"
      fill="none"
      style={{ display: 'block', opacity: 0.9 }}
    >
      {/* Battery body outline */}
      <rect
        x="0.5"
        y="0.5"
        width="20"
        height="11"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1"
      />
      {/* Fill (100%) */}
      <rect
        x="2"
        y="2"
        width="17"
        height="8"
        rx="1.2"
        fill="currentColor"
        opacity="0.85"
      />
      {/* Battery nub */}
      <path
        d="M22 4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

function MenuItem({ label, onClick }: { label: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className="w-full text-left"
      style={{
        color: 'var(--color-text-primary)',
        background: hovered ? 'rgba(59, 130, 246, 0.7)' : 'transparent',
        borderRadius: hovered ? 4 : 0,
        margin: hovered ? '0 4px' : 0,
        width: hovered ? 'calc(100% - 8px)' : '100%',
        display: 'block',
        border: 'none',
        cursor: 'default',
        fontFamily: 'var(--font-system)',
        fontSize: '13px',
        lineHeight: '20px',
        padding: '2px 10px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
