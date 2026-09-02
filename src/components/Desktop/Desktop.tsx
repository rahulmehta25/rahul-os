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
import { VoiceOverlay } from '../Voice/VoiceOverlay.tsx';
import { AboutModal } from '../../apps/AboutThisComputer/About.tsx';
import { appRegistry } from '../../apps/registry.tsx';
import { useWindowKeyboard } from '../../hooks/useWindowKeyboard.ts';
import { DEFAULT_WALLPAPER, SEQUOIA_DARK, SEQUOIA_LIGHT } from '../../styles/wallpapers.ts';

function AppLoader({ appId, windowId, appProps }: { appId: string; windowId: string; appProps?: Record<string, unknown> }) {
  const manifest = appRegistry[appId];
  if (!manifest) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '14px' }}
      >
        {appId}: coming soon
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
        body: 'Open apps from the Dock, or press Cmd+K for voice.',
        duration: 6000,
      });
    }, 2000);

    const t2 = setTimeout(() => {
      push({
        title: 'Projects',
        body: 'Open Files from the Dock to browse work.',
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
        title: 'Terminal',
        body: 'Type help for commands, or projects to browse work.',
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
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.04,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 38%, transparent 42%, rgba(0,0,0,0.22) 100%)',
        }}
      />

      <MenuBar />

      <DesktopIcons />

      <WindowManager />

      <Dock />

      <ContextMenu />

      <NotificationCenter />

      <VoiceOverlay />

      {activeModal === 'about' && <AboutModal />}
    </div>
  );
}
