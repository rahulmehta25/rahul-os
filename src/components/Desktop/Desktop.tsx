import { Suspense, useEffect, useRef } from 'react';
import { useWindowStore } from '../../stores/windowStore.ts';
import { useShallow } from 'zustand/react/shallow';
import { useSettingsStore } from '../../stores/settingsStore.ts';
import { useNotificationStore } from '../../stores/notificationStore.ts';
import { useModalStore } from '../../stores/modalStore.ts';
import { Window } from '../Window/Window.tsx';
import { MenuBar } from './MenuBar.tsx';
import { Dock } from './Dock.tsx';
import { DesktopIcons } from './DesktopIcons.tsx';
import { ContextMenu } from './ContextMenu.tsx';
import { NotificationCenter } from '../Notifications/NotificationCenter.tsx';
import { AboutModal } from '../../apps/AboutThisComputer/About.tsx';
import { appRegistry } from '../../apps/registry.tsx';
import { useWindowKeyboard } from '../../hooks/useWindowKeyboard.ts';

function AppLoader({ appId, windowId, appProps }: { appId: string; windowId: string; appProps?: Record<string, unknown> }) {
  const manifest = appRegistry[appId];
  if (!manifest) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '14px' }}
      >
        {appId} - coming soon
      </div>
    );
  }

  const AppComponent = manifest.component;
  return (
    <Suspense
      fallback={
        <div
          className="flex items-center justify-center h-full"
          style={{ color: 'var(--color-text-tertiary)', fontFamily: 'var(--font-mono)', fontSize: '13px' }}
        >
          Loading...
        </div>
      }
    >
      <AppComponent windowId={windowId} {...appProps} />
    </Suspense>
  );
}

// Each window subscribes to only its own state, preventing cross-window re-renders
function WindowContainer({ windowId }: { windowId: string }) {
  const win = useWindowStore((s) => s.windows[windowId]);
  if (!win) return null;
  return (
    <Window state={win}>
      <AppLoader appId={win.appId} windowId={win.id} appProps={win.appProps} />
    </Window>
  );
}

// Only re-renders when windows are added or removed, not on position/size/focus changes
function WindowManager() {
  const windowIds = useWindowStore(useShallow((s) => Object.keys(s.windows)));

  return (
    <>
      {windowIds.map((id) => (
        <WindowContainer key={id} windowId={id} />
      ))}
    </>
  );
}

const SEQUOIA_DARK = 'radial-gradient(ellipse at 75% 85%, #F5872A 0%, #D4692A 8%, #8B6E35 16%, #3E8F4A 26%, #1A9068 36%, #0D7B7A 46%, #0B5A6E 56%, #142D50 68%, #2A1F5C 80%, #3C2068 90%, #281548 100%)';
const SEQUOIA_LIGHT = 'radial-gradient(ellipse at 75% 85%, #FDCFA1 0%, #F4BC90 8%, #D6CC94 16%, #96D8A6 26%, #7AD4B8 36%, #78C8C8 46%, #82BCD2 56%, #94B4D8 68%, #B4A4D8 80%, #C8B0E0 90%, #BAA4D6 100%)';
const DEFAULT_WALLPAPER = SEQUOIA_DARK;

export function Desktop() {
  const wallpaper = useSettingsStore((s) => s.wallpaper);
  const theme = useSettingsStore((s) => s.theme);
  // Derived boolean: only re-renders Desktop when a terminal is first opened, not on every window change
  const hasTerminal = useWindowStore((s) =>
    Object.values(s.windows).some((w) => w.appId === 'terminal'),
  );
  const push = useNotificationStore((s) => s.push);
  const activeModal = useModalStore((s) => s.activeModal);
  const notifsFired = useRef(false);
  const terminalHintFired = useRef(false);

  useWindowKeyboard();

  useEffect(() => {
    if (notifsFired.current) return;
    notifsFired.current = true;

    const t1 = setTimeout(() => {
      push({
        title: 'Welcome to RahulOS',
        body: 'Explore the desktop, open apps from the dock, or right-click for options.',
        duration: 6000,
      });
    }, 2000);

    const t2 = setTimeout(() => {
      push({
        title: 'Check out the Projects folder',
        body: 'Open Files from the dock to browse project showcases.',
        duration: 5000,
      });
    }, 60000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [push]);

  // Terminal hint on first terminal open
  useEffect(() => {
    if (terminalHintFired.current) return;
    if (hasTerminal) {
      terminalHintFired.current = true;
      push({
        title: 'Terminal Tip',
        body: 'Try "help" to see available commands, or "projects" to browse work.',
        duration: 5000,
      });
    }
  }, [hasTerminal, push]);

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      role="application"
      aria-label="RahulOS Desktop"
      style={{
        background: theme === 'light' && (!wallpaper || wallpaper === SEQUOIA_DARK)
          ? SEQUOIA_LIGHT
          : (wallpaper || DEFAULT_WALLPAPER),
      }}
    >
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <MenuBar />

      <DesktopIcons />

      <WindowManager />

      <Dock />

      <ContextMenu />

      <NotificationCenter />

      {activeModal === 'about' && <AboutModal />}
    </div>
  );
}
