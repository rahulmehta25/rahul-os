import { create } from 'zustand';
import { appRegistry } from '../apps/registry.tsx';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface WindowState {
  id: string;
  appId: string;
  title: string;
  position: Position;
  size: Size;
  minSize: Size;
  zIndex: number;
  status: 'normal' | 'minimized' | 'maximized';
  preMaximizeBounds: { position: Position; size: Size } | null;
  appProps?: Record<string, unknown>;
}

interface WindowStore {
  windows: Record<string, WindowState>;
  zIndexCounter: number;
  activeWindowId: string | null;

  openWindow: (
    appId: string,
    title: string,
    options?: {
      size?: Size;
      minSize?: Size;
      position?: Position;
      appProps?: Record<string, unknown>;
    },
  ) => string;
  closeWindow: (windowId: string) => void;
  focusWindow: (windowId: string) => void;
  minimizeWindow: (windowId: string) => void;
  maximizeWindow: (windowId: string) => void;
  restoreWindow: (windowId: string) => void;
  updatePosition: (windowId: string, position: Position) => void;
  updateSize: (windowId: string, size: Size) => void;
  setTitle: (windowId: string, title: string) => void;
}

let windowCounter = 0;

const cascadeOffset = (index: number): Position => ({
  x: 80 + (index % 8) * 30,
  y: 60 + (index % 8) * 30,
});

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: {},
  zIndexCounter: 100,
  activeWindowId: null,

  openWindow: (appId, title, options = {}) => {
    // If allowMultiple is false, focus existing instance instead of opening a new one
    const manifest = appRegistry[appId];
    if (manifest && manifest.allowMultiple === false) {
      const existing = Object.values(get().windows).find((w) => w.appId === appId);
      if (existing) {
        // Restore if minimized, then focus
        if (existing.status === 'minimized') {
          get().restoreWindow(existing.id);
        } else {
          get().focusWindow(existing.id);
        }
        return existing.id;
      }
    }

    const id = `${appId}-${++windowCounter}`;
    const zIndex = get().zIndexCounter + 1;
    const position = options.position ?? cascadeOffset(windowCounter);
    const size = options.size ?? { width: 680, height: 420 };
    const minSize = options.minSize ?? { width: 320, height: 240 };

    set((state) => ({
      windows: {
        ...state.windows,
        [id]: {
          id,
          appId,
          title,
          position,
          size,
          minSize,
          zIndex,
          status: 'normal',
          preMaximizeBounds: null,
          appProps: options.appProps,
        },
      },
      zIndexCounter: zIndex,
      activeWindowId: id,
    }));

    return id;
  },

  closeWindow: (windowId) => {
    set((state) => {
      const { [windowId]: _, ...rest } = state.windows;
      const windowIds = Object.keys(rest);
      let activeWindowId: string | null = null;
      if (windowIds.length > 0) {
        activeWindowId = windowIds.reduce((a, b) =>
          rest[a].zIndex > rest[b].zIndex ? a : b,
        );
      }
      return { windows: rest, activeWindowId };
    });
  },

  focusWindow: (windowId) => {
    const state = get();
    if (state.activeWindowId === windowId) return;
    const win = state.windows[windowId];
    if (!win || win.status === 'minimized') return;

    const zIndex = state.zIndexCounter + 1;
    set({
      windows: {
        ...state.windows,
        [windowId]: { ...win, zIndex },
      },
      zIndexCounter: zIndex,
      activeWindowId: windowId,
    });
  },

  minimizeWindow: (windowId) => {
    set((state) => {
      const win = state.windows[windowId];
      if (!win) return state;

      const updated = { ...state.windows, [windowId]: { ...win, status: 'minimized' as const } };
      const visibleIds = Object.keys(updated).filter(
        (id) => updated[id].status !== 'minimized',
      );
      let activeWindowId: string | null = null;
      if (visibleIds.length > 0) {
        activeWindowId = visibleIds.reduce((a, b) =>
          updated[a].zIndex > updated[b].zIndex ? a : b,
        );
      }
      return { windows: updated, activeWindowId };
    });
  },

  maximizeWindow: (windowId) => {
    set((state) => {
      const win = state.windows[windowId];
      if (!win) return state;

      if (win.status === 'maximized') {
        return {
          windows: {
            ...state.windows,
            [windowId]: {
              ...win,
              status: 'normal',
              position: win.preMaximizeBounds?.position ?? win.position,
              size: win.preMaximizeBounds?.size ?? win.size,
              preMaximizeBounds: null,
            },
          },
        };
      }

      const menubarH = 28;
      const dockH = 64 + 8;
      return {
        windows: {
          ...state.windows,
          [windowId]: {
            ...win,
            status: 'maximized',
            preMaximizeBounds: { position: win.position, size: win.size },
            position: { x: 0, y: menubarH },
            size: {
              width: window.innerWidth,
              height: window.innerHeight - menubarH - dockH,
            },
          },
        },
      };
    });
  },

  restoreWindow: (windowId) => {
    const state = get();
    const win = state.windows[windowId];
    if (!win) return;

    const zIndex = state.zIndexCounter + 1;
    set({
      windows: {
        ...state.windows,
        [windowId]: {
          ...win,
          status: 'normal',
          zIndex,
          position: win.preMaximizeBounds?.position ?? win.position,
          size: win.preMaximizeBounds?.size ?? win.size,
          preMaximizeBounds: null,
        },
      },
      zIndexCounter: zIndex,
      activeWindowId: windowId,
    });
  },

  updatePosition: (windowId, position) => {
    set((state) => {
      const win = state.windows[windowId];
      if (!win) return state;
      return {
        windows: { ...state.windows, [windowId]: { ...win, position } },
      };
    });
  },

  updateSize: (windowId, size) => {
    set((state) => {
      const win = state.windows[windowId];
      if (!win) return state;
      return {
        windows: { ...state.windows, [windowId]: { ...win, size } },
      };
    });
  },

  setTitle: (windowId, title) => {
    set((state) => {
      const win = state.windows[windowId];
      if (!win) return state;
      return {
        windows: { ...state.windows, [windowId]: { ...win, title } },
      };
    });
  },
}));
