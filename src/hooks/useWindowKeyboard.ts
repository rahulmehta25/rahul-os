import { useEffect } from 'react';
import { useWindowStore } from '../stores/windowStore.ts';

export function useWindowKeyboard() {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const state = useWindowStore.getState();
      const visibleWindows = Object.values(state.windows)
        .filter((w) => w.status !== 'minimized')
        .sort((a, b) => a.zIndex - b.zIndex);

      if (visibleWindows.length === 0) return;

      if (e.key === 'Escape') {
        if (state.activeWindowId) {
          closeWindow(state.activeWindowId);
        }
        return;
      }

      if (e.key === 'Tab' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        // Only intercept Tab if it's not inside an input/textarea/contenteditable
        const target = e.target as HTMLElement;
        const isEditable =
          target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable;
        if (isEditable) return;

        e.preventDefault();
        const currentIdx = visibleWindows.findIndex((w) => w.id === state.activeWindowId);
        const nextIdx = e.shiftKey
          ? (currentIdx - 1 + visibleWindows.length) % visibleWindows.length
          : (currentIdx + 1) % visibleWindows.length;
        const nextWindow = visibleWindows[nextIdx];
        focusWindow(nextWindow.id);

        // Focus the window's DOM element
        const el = document.querySelector(`[aria-label="${nextWindow.title}"][role="dialog"]`) as HTMLElement;
        el?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeWindow, focusWindow]);
}
