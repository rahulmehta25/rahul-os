import { useEffect, useState, useRef, useCallback } from 'react';
import { useWindowStore } from '../../stores/windowStore.ts';
import { useModalStore } from '../../stores/modalStore.ts';
import { appRegistry } from '../../apps/registry.tsx';
import { RahulOSMark } from '../shared/RahulOSMark.tsx';

type MenuId = 'apple' | 'app' | 'File' | 'Edit' | 'View' | 'Window' | 'Help' | null;

export function MenuBar() {
  const [time, setTime] = useState(new Date());
  const [openMenu, setOpenMenu] = useState<MenuId>(null);
  const menuBarRef = useRef<HTMLDivElement>(null);
  const openWindow = useWindowStore((s) => s.openWindow);
  const activeWindowId = useWindowStore((s) => s.activeWindowId);
  const windows = useWindowStore((s) => s.windows);
  const openModal = useModalStore((s) => s.openModal);

  const activeWindow = activeWindowId ? windows[activeWindowId] : null;
  const activeAppName = activeWindow?.title ?? 'RahulOS';

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Close on click outside
  useEffect(() => {
    if (!openMenu) return;
    const handleClick = (e: MouseEvent) => {
      if (menuBarRef.current && !menuBarRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('pointerdown', handleClick);
    return () => document.removeEventListener('pointerdown', handleClick);
  }, [openMenu]);

  // Close on Escape
  useEffect(() => {
    if (!openMenu) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [openMenu]);

  const handleOpenApp = useCallback(
    (appId: string) => {
      const manifest = appRegistry[appId];
      if (!manifest) return;
      openWindow(appId, manifest.name, {
        size: manifest.defaultSize,
        minSize: manifest.minSize,
      });
      setOpenMenu(null);
    },
    [openWindow],
  );

  const handleMenuClick = useCallback((id: MenuId) => {
    setOpenMenu((prev) => (prev === id ? null : id));
  }, []);

  const handleMenuHover = useCallback((id: MenuId) => {
    setOpenMenu((prev) => (prev !== null ? id : prev));
  }, []);

  const closeMenu = useCallback(() => setOpenMenu(null), []);

  const handleSleep = useCallback(() => {
    setOpenMenu(null);
    const overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;inset:0;background:#000;z-index:99999;opacity:0;transition:opacity 0.6s ease;cursor:pointer';
    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      overlay.style.opacity = '0.85';
    });
    const wake = () => {
      overlay.style.opacity = '0';
      overlay.addEventListener('transitionend', () => overlay.remove());
    };
    overlay.addEventListener('click', wake);
    overlay.addEventListener('keydown', wake);
    setTimeout(wake, 3000);
  }, []);

  const handleRestart = useCallback(() => {
    setOpenMenu(null);
    sessionStorage.removeItem('rahulos-booted');
    window.location.reload();
  }, []);

  const handleShutDown = useCallback(() => {
    setOpenMenu(null);
    const overlay = document.createElement('div');
    overlay.style.cssText =
      'position:fixed;inset:0;background:#000;z-index:99999;opacity:0;transition:opacity 1s ease;display:flex;align-items:center;justify-content:center';
    const text = document.createElement('div');
    text.textContent = 'You can close this tab.';
    text.style.cssText =
      'color:#a1a1a6;font-family:var(--font-system);font-size:15px;font-weight:400;letter-spacing:-0.014em;opacity:0;transition:opacity 1.5s ease 0.8s';
    overlay.appendChild(text);
    document.body.appendChild(overlay);
    requestAnimationFrame(() => {
      overlay.style.opacity = '1';
      text.style.opacity = '1';
    });
  }, []);

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
      data-menubar-root
      className="fixed top-0 left-0 right-0 flex items-center justify-between select-none"
      style={{
        height: 'var(--menubar-height)',
        background: 'var(--color-bg-menubar)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderBottom: '0.5px solid var(--color-border)',
        boxShadow: 'var(--shadow-menubar)',
        zIndex: 'var(--z-menubar)',
        fontFamily: 'var(--font-system)',
        fontSize: 'var(--text-md)',
        fontWeight: 'var(--weight-regular)',
        letterSpacing: 'var(--tracking-snug)',
        color: 'var(--color-text-primary)',
        paddingLeft: '8px',
        paddingRight: '10px',
        animation: 'chrome-fade 400ms ease both',
      }}
    >
      <div className="flex items-center" style={{ height: '100%' }} ref={menuBarRef} data-menubar>
        <MenuBarButton
          isOpen={openMenu === 'apple'}
          onClick={() => handleMenuClick('apple')}
          onMouseEnter={() => handleMenuHover('apple')}
        >
          <RahulOSMark size={13} />
        </MenuBarButton>

        {openMenu === 'apple' && (
          <MenuDropdown left={0}>
            <MenuItem
              label="About This Computer"
              onClick={() => { openModal('about'); closeMenu(); }}
            />
            <MenuSeparator />
            <MenuItem
              label="System Settings..."
              shortcut="&#8984;,"
              onClick={() => handleOpenApp('settings')}
            />
            <MenuSeparator />
            <MenuItem label="Sleep" onClick={handleSleep} />
            <MenuItem label="Restart..." onClick={handleRestart} />
            <MenuItem label="Shut Down..." onClick={handleShutDown} />
          </MenuDropdown>
        )}

        {/* Active app name */}
        <MenuBarButton
          bold
          isOpen={openMenu === 'app'}
          onClick={() => handleMenuClick('app')}
          onMouseEnter={() => handleMenuHover('app')}
        >
          {activeAppName}
        </MenuBarButton>

        {openMenu === 'app' && (
          <AppMenuDropdown appName={activeAppName} onClose={closeMenu} openModal={openModal} />
        )}

        {/* Standard menus */}
        {(['File', 'Edit', 'View', 'Window', 'Help'] as const).map((label) => (
          <MenuBarButton
            key={label}
            isOpen={openMenu === label}
            onClick={() => handleMenuClick(label)}
            onMouseEnter={() => handleMenuHover(label)}
          >
            {label}
          </MenuBarButton>
        ))}

        {openMenu === 'File' && (
          <StandardMenuDropdown menuId="File">
            <MenuItem label="New Window" shortcut="&#8984;N" onClick={closeMenu} />
            <MenuItem label="New Tab" shortcut="&#8984;T" onClick={closeMenu} />
            <MenuSeparator />
            <MenuItem label="Close Window" shortcut="&#8984;W" onClick={closeMenu} />
          </StandardMenuDropdown>
        )}

        {openMenu === 'Edit' && (
          <StandardMenuDropdown menuId="Edit">
            <MenuItem label="Undo" shortcut="&#8984;Z" onClick={closeMenu} />
            <MenuItem label="Redo" shortcut="&#8679;&#8984;Z" onClick={closeMenu} />
            <MenuSeparator />
            <MenuItem label="Cut" shortcut="&#8984;X" onClick={closeMenu} />
            <MenuItem label="Copy" shortcut="&#8984;C" onClick={closeMenu} />
            <MenuItem label="Paste" shortcut="&#8984;V" onClick={closeMenu} />
            <MenuItem label="Select All" shortcut="&#8984;A" onClick={closeMenu} />
          </StandardMenuDropdown>
        )}

        {openMenu === 'View' && (
          <StandardMenuDropdown menuId="View">
            <MenuItem label="as Icons" shortcut="&#8984;1" onClick={closeMenu} />
            <MenuItem label="as List" shortcut="&#8984;2" onClick={closeMenu} />
            <MenuSeparator />
            <MenuItemDisabled label="Show Tab Bar" />
            <MenuItemDisabled label="Show All Tabs" />
          </StandardMenuDropdown>
        )}

        {openMenu === 'Window' && (
          <StandardMenuDropdown menuId="Window">
            <MenuItem label="Minimize" shortcut="&#8984;M" onClick={closeMenu} />
            <MenuItem label="Zoom" onClick={closeMenu} />
            <MenuSeparator />
            <MenuItemDisabled label="Bring All to Front" />
          </StandardMenuDropdown>
        )}

        {openMenu === 'Help' && (
          <StandardMenuDropdown menuId="Help">
            <MenuItemDisabled label="RahulOS Help" />
            <MenuSeparator />
            <MenuItem
              label="About RahulOS"
              onClick={() => { openModal('about'); closeMenu(); }}
            />
          </StandardMenuDropdown>
        )}
      </div>

      <div
        className="flex items-center"
        style={{
          height: '100%',
          gap: '2px',
          color: 'var(--color-text-primary)',
        }}
      >
        <VoiceHintButton />
        <StatusButton label="Control Center">
          <ControlCenterIcon />
        </StatusButton>
        <StatusButton label="Wi-Fi: Connected">
          <WifiIcon />
        </StatusButton>
        <StatusButton label="Battery: 100%">
          <span className="flex items-center" style={{ gap: '4px' }}>
            <BatteryIcon />
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 400, fontVariantNumeric: 'tabular-nums' }}>100%</span>
          </span>
        </StatusButton>
        <StatusButton label={dateStr}>
          <div className="flex items-center" style={{ gap: '8px', fontSize: 'var(--text-sm)', padding: '0 4px', fontVariantNumeric: 'tabular-nums' }}>
            <span style={{ fontWeight: 400 }}>{dateStr}</span>
            <span style={{ fontWeight: 500 }}>{formatted}</span>
          </div>
        </StatusButton>
      </div>
    </div>
  );
}

// --- Subcomponents ---

function MenuBarButton({
  children,
  bold,
  isOpen,
  onClick,
  onMouseEnter,
}: {
  children: React.ReactNode;
  bold?: boolean;
  isOpen: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className="flex items-center border-none cursor-default"
      style={{
        height: '100%',
        padding: '0 11px',
        background: isOpen ? 'var(--color-bg-active)' : hovered ? 'var(--color-bg-hover)' : 'transparent',
        borderRadius: '5px',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-system)',
        fontSize: 'var(--text-md)',
        letterSpacing: 'var(--tracking-snug)',
        fontWeight: bold ? 590 : 400,
        lineHeight: 1,
        transition: 'background 60ms ease',
      }}
      onClick={onClick}
      onMouseEnter={() => { setHovered(true); onMouseEnter(); }}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

function MenuDropdown({ children, left }: { children: React.ReactNode; left: number }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 'var(--menubar-height)',
        left,
        width: 220,
        background: 'var(--color-bg-surface)',
        backdropFilter: 'var(--glass-blur)',
        WebkitBackdropFilter: 'var(--glass-blur)',
        borderRadius: 'var(--radius-context-menu)',
        border: '0.5px solid var(--color-border-active)',
        boxShadow: 'var(--shadow-context-menu)',
        padding: '6px 0',
        zIndex: 9999,
        animation: 'chrome-rise-sm var(--rise-chrome) both',
      }}
    >
      {children}
    </div>
  );
}

function StandardMenuDropdown({ menuId, children }: { menuId: string; children: React.ReactNode }) {
  const buttonRef = useMenuBarButtonRef(menuId);
  const left = buttonRef ?? 0;

  return <MenuDropdown left={left}>{children}</MenuDropdown>;
}

function AppMenuDropdown({
  appName,
  onClose,
  openModal,
}: {
  appName: string;
  onClose: () => void;
  openModal: (modal: 'about' | null) => void;
}) {
  const buttonRef = useMenuBarButtonRef('app');
  const left = buttonRef ?? 0;

  return (
    <MenuDropdown left={left}>
      <MenuItem
        label={`About ${appName}`}
        onClick={() => { openModal('about'); onClose(); }}
      />
      <MenuSeparator />
      <MenuItemDisabled label={`Hide ${appName}`} shortcut="&#8984;H" />
      <MenuItemDisabled label="Hide Others" shortcut="&#8997;&#8984;H" />
      <MenuItem label="Show All" onClick={onClose} />
      <MenuSeparator />
      <MenuItem
        label={`Quit ${appName}`}
        shortcut="&#8984;Q"
        onClick={onClose}
      />
    </MenuDropdown>
  );
}

/** Calculates the left offset of a menu bar button by its id/label for dropdown positioning */
function useMenuBarButtonRef(menuId: string): number | null {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    // Find the button in the menu bar by matching text content or data attribute
    const menuBar = document.querySelector('[data-menubar]');
    if (!menuBar) return;
    const buttons = menuBar.querySelectorAll<HTMLButtonElement>('button');
    // Map: apple=0, app=1, File=2, Edit=3, View=4, Window=5, Help=6
    const order = ['apple', 'app', 'File', 'Edit', 'View', 'Window', 'Help'];
    const idx = order.indexOf(menuId);
    if (idx >= 0 && buttons[idx]) {
      const rect = buttons[idx].getBoundingClientRect();
      const parentRect = menuBar.getBoundingClientRect();
      setLeft(rect.left - parentRect.left);
    }
  }, [menuId]);

  return left;
}

function MenuItem({ label, shortcut, onClick }: { label: string; shortcut?: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      className="w-full text-left"
      style={{
        color: hovered ? '#ffffff' : 'var(--color-text-primary)',
        background: hovered ? 'var(--color-accent)' : 'transparent',
        borderRadius: hovered ? 6 : 0,
        margin: hovered ? '0 4px' : 0,
        width: hovered ? 'calc(100% - 8px)' : '100%',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: 'none',
        cursor: 'default',
        fontFamily: 'var(--font-system)',
        fontSize: 'var(--text-md)',
        letterSpacing: 'var(--tracking-snug)',
        lineHeight: '22px',
        padding: '4px 14px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <span>{label}</span>
      {shortcut && (
        <span style={{ fontSize: '12px', opacity: hovered ? 0.8 : 0.5, marginLeft: '16px' }}>
          {shortcut}
        </span>
      )}
    </button>
  );
}

function MenuItemDisabled({ label, shortcut }: { label: string; shortcut?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'var(--font-system)',
        fontSize: 'var(--text-md)',
        letterSpacing: 'var(--tracking-snug)',
        lineHeight: '22px',
        padding: '4px 14px',
        color: 'var(--color-text-tertiary)',
        cursor: 'default',
      }}
    >
      <span>{label}</span>
      {shortcut && (
        <span style={{ fontSize: '12px', opacity: 0.5, marginLeft: '16px' }}>
          {shortcut}
        </span>
      )}
    </div>
  );
}

function MenuSeparator() {
  return (
    <div style={{ height: 0.5, background: 'var(--color-border)', margin: '5px 10px' }} />
  );
}

function StatusButton({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      className="flex items-center border-none cursor-default"
      style={{
        height: '22px',
        padding: '0 8px',
        background: hovered ? 'var(--color-bg-hover)' : 'transparent',
        borderRadius: '5px',
        color: 'var(--color-text-primary)',
        transition: 'background 80ms ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </button>
  );
}

function VoiceHintButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="button"
      title="Voice commands (Cmd+K)"
      aria-label="Open voice commands"
      className="flex items-center border-none"
      style={{
        height: '22px',
        padding: '0 8px',
        gap: '5px',
        background: hovered ? 'var(--color-bg-hover)' : 'transparent',
        borderRadius: '5px',
        color: 'var(--color-text-primary)',
        fontFamily: 'var(--font-system)',
        fontSize: 'var(--text-xs)',
        fontWeight: 'var(--weight-medium)',
        letterSpacing: 'var(--tracking-snug)',
        cursor: 'pointer',
        transition: 'background 80ms ease',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => window.dispatchEvent(new Event('rahulos:toggle-voice'))}
    >
      <MicIcon />
      <span>Voice</span>
      <kbd
        style={{
          fontFamily: 'var(--font-system)',
          fontSize: '10px',
          fontWeight: 500,
          color: 'var(--color-text-secondary)',
          letterSpacing: '0.04em',
        }}
      >
        ⌘K
      </kbd>
    </button>
  );
}

function MicIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      style={{ display: 'block', opacity: 0.9 }}
    >
      <rect x="5.5" y="1.5" width="5" height="8" rx="2.5" />
      <path d="M3.5 7.5a4.5 4.5 0 009 0" />
      <path d="M8 12v2.5" />
    </svg>
  );
}


function ControlCenterIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="currentColor"
      style={{ display: 'block', opacity: 0.85 }}
    >
      <circle cx="5" cy="5" r="2.2" />
      <circle cx="11" cy="5" r="2.2" />
      <circle cx="5" cy="11" r="2.2" />
      <circle cx="11" cy="11" r="2.2" />
    </svg>
  );
}

function WifiIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: 'block', opacity: 0.85 }}
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
      width="20"
      height="10"
      viewBox="0 0 25 12"
      fill="none"
      style={{ display: 'block', opacity: 0.85 }}
    >
      <rect
        x="0.5"
        y="0.5"
        width="20"
        height="11"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1"
      />
      <rect
        x="2"
        y="2"
        width="17"
        height="8"
        rx="1.2"
        fill="#32D74B"
        opacity="0.9"
      />
      <path
        d="M22 4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}
