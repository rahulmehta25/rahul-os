import { lazy, type ComponentType } from 'react';

export interface AppManifest {
  id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: ComponentType<any>;
  defaultSize: { width: number; height: number };
  minSize: { width: number; height: number };
  allowMultiple?: boolean;
  showInDock?: boolean;
  showOnDesktop?: boolean;
}

const LazyTerminal = lazy(() =>
  import('./Terminal/Terminal').then((m) => ({ default: m.Terminal })),
);

const LazySettings = lazy(() =>
  import('./Settings/Settings').then((m) => ({ default: m.Settings })),
);

const LazySnake = lazy(() =>
  import('./Snake/Snake').then((m) => ({ default: m.Snake })),
);

const LazyAbout = lazy(() =>
  import('./AboutThisComputer/About').then((m) => ({ default: m.About })),
);

const LazyFileManager = lazy(() =>
  import('./FileManager/FileManager').then((m) => ({ default: m.FileManager })),
);

const LazyTextEditor = lazy(() =>
  import('./TextEditor/TextEditor').then((m) => ({ default: m.TextEditor })),
);

const LazyBrowser = lazy(() =>
  import('./Browser/Browser').then((m) => ({ default: m.Browser })),
);

export const appRegistry: Record<string, AppManifest> = {
  terminal: {
    id: 'terminal',
    name: 'Terminal',
    component: LazyTerminal,
    defaultSize: { width: 680, height: 420 },
    minSize: { width: 400, height: 300 },
    allowMultiple: true,
    showInDock: true,
    showOnDesktop: false,
  },
  settings: {
    id: 'settings',
    name: 'Settings',
    component: LazySettings,
    defaultSize: { width: 600, height: 450 },
    minSize: { width: 400, height: 300 },
    allowMultiple: false,
    showInDock: true,
    showOnDesktop: false,
  },
  snake: {
    id: 'snake',
    name: 'Snake',
    component: LazySnake,
    defaultSize: { width: 420, height: 480 },
    minSize: { width: 320, height: 380 },
    allowMultiple: false,
    showInDock: true,
    showOnDesktop: false,
  },
  about: {
    id: 'about',
    name: 'About This Mac',
    component: LazyAbout,
    defaultSize: { width: 500, height: 340 },
    minSize: { width: 400, height: 300 },
    allowMultiple: false,
    showInDock: false,
    showOnDesktop: false,
  },
  filemanager: {
    id: 'filemanager',
    name: 'Files',
    component: LazyFileManager,
    defaultSize: { width: 800, height: 520 },
    minSize: { width: 500, height: 350 },
    allowMultiple: true,
    showInDock: true,
    showOnDesktop: true,
  },
  texteditor: {
    id: 'texteditor',
    name: 'TextEdit',
    component: LazyTextEditor,
    defaultSize: { width: 700, height: 500 },
    minSize: { width: 400, height: 300 },
    allowMultiple: true,
    showInDock: true,
    showOnDesktop: false,
  },
  browser: {
    id: 'browser',
    name: 'Safari',
    component: LazyBrowser,
    defaultSize: { width: 900, height: 600 },
    minSize: { width: 500, height: 400 },
    allowMultiple: true,
    showInDock: true,
    showOnDesktop: false,
  },
};
