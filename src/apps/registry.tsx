import { lazy, type ComponentType } from 'react';
import { Settings } from './Settings/Settings';
import { Snake } from './Snake/Snake';
import { About } from './AboutThisComputer/About';

export interface AppManifest {
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
}

function makePlaceholder(label: string, emoji: string): ComponentType<{ windowId: string }> {
  function Placeholder({ windowId }: { windowId: string }) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          color: 'var(--color-text-secondary)',
          fontFamily: 'var(--font-mono)',
          fontSize: '14px',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <span style={{ fontSize: '32px', filter: 'grayscale(1)' }}>{emoji}</span>
        <span>{label} — Coming Soon</span>
        <span style={{ fontSize: '11px', color: 'var(--color-text-tertiary)' }}>{windowId}</span>
      </div>
    );
  }
  Placeholder.displayName = `Placeholder(${label})`;
  return Placeholder;
}

const LazyTerminal = lazy(() =>
  import('./Terminal/Terminal').then((m) => ({ default: m.Terminal })),
);

export const appRegistry: Record<string, AppManifest> = {
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    component: LazyTerminal,
    defaultSize: { width: 680, height: 420 },
    minSize: { width: 400, height: 300 },
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    component: Settings,
    defaultSize: { width: 600, height: 450 },
    minSize: { width: 400, height: 300 },
  },
  snake: {
    id: 'snake',
    name: 'Snake',
    component: Snake,
    defaultSize: { width: 420, height: 480 },
    minSize: { width: 320, height: 380 },
  },
  about: {
    id: 'about',
    name: 'About This Mac',
    component: About,
    defaultSize: { width: 500, height: 340 },
    minSize: { width: 400, height: 300 },
  },
  filemanager: {
    id: 'filemanager',
    name: 'Files',
    component: makePlaceholder('Files', '📁'),
    defaultSize: { width: 800, height: 520 },
    minSize: { width: 500, height: 350 },
  },
  texteditor: {
    id: 'texteditor',
    name: 'TextEdit',
    component: makePlaceholder('TextEdit', '📝'),
    defaultSize: { width: 700, height: 500 },
    minSize: { width: 400, height: 300 },
  },
  browser: {
    id: 'browser',
    name: 'Safari',
    component: makePlaceholder('Safari', '🌐'),
    defaultSize: { width: 900, height: 600 },
    minSize: { width: 500, height: 400 },
  },
};
