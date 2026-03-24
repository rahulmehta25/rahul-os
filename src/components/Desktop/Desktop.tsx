import { Suspense, useEffect, useRef } from 'react';
import { useWindowStore } from '../../stores/windowStore.ts';
import { useSettingsStore } from '../../stores/settingsStore.ts';
import { useNotificationStore } from '../../stores/notificationStore.ts';
import { Window } from '../Window/Window.tsx';
import { MenuBar } from './MenuBar.tsx';
import { Dock } from './Dock.tsx';
import { DesktopIcons } from './DesktopIcons.tsx';
import { ContextMenu } from './ContextMenu.tsx';
import { NotificationCenter } from '../Notifications/NotificationCenter.tsx';
import { appRegistry } from '../../apps/registry.tsx';

function AppLoader({ appId, windowId, appProps }: { appId: string; windowId: string; appProps?: Record<string, unknown> }) {
  const manifest = appRegistry[appId];
  if (!manifest) {
    return (
      <div
        className="flex items-center justify-center h-full"
        style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '14px' }}
      >
        {appId} — coming soon
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

function WindowManager() {
  const windows = useWindowStore((s) => s.windows);

  return (
    <>
      {Object.values(windows).map((win) => (
        <Window key={win.id} state={win}>
          <AppLoader appId={win.appId} windowId={win.id} appProps={win.appProps} />
        </Window>
      ))}
    </>
  );
}

const DEFAULT_WALLPAPER = 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)';

export function Desktop() {
  const wallpaper = useSettingsStore((s) => s.wallpaper);
  const windows = useWindowStore((s) => s.windows);
  const push = useNotificationStore((s) => s.push);
  const notifsFired = useRef(false);
  const terminalHintFired = useRef(false);

  useEffect(() => {
    if (notifsFired.current) return;
    notifsFired.current = true;

    // Welcome notification after 2s
    setTimeout(() => {
      push({
        title: 'Welcome to RahulOS',
        body: 'Explore the desktop, open apps from the dock, or right-click for options.',
        duration: 6000,
      });
    }, 2000);

    // Projects hint after 60s
    setTimeout(() => {
      push({
        title: 'Check out the Projects folder',
        body: 'Open Files from the dock to browse project showcases.',
        duration: 5000,
      });
    }, 60000);
  }, [push]);

  // Terminal hint on first terminal open
  useEffect(() => {
    if (terminalHintFired.current) return;
    const hasTerminal = Object.values(windows).some((w) => w.appId === 'terminal');
    if (hasTerminal) {
      terminalHintFired.current = true;
      push({
        title: 'Terminal Tip',
        body: 'Try "help" to see available commands, or "projects" to browse work.',
        duration: 5000,
      });
    }
  }, [windows, push]);

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      role="application"
      aria-label="RahulOS Desktop"
      style={{
        background: wallpaper || DEFAULT_WALLPAPER,
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
    </div>
  );
}
