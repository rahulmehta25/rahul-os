import { create } from 'zustand';

interface SettingsStore {
  wallpaper: string;
  theme: 'dark' | 'light';
  accentColor: string;
  hasCompletedBoot: boolean;
  fontSize: 'small' | 'medium' | 'large';

  setWallpaper: (path: string) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setAccentColor: (color: string) => void;
  markBootComplete: () => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  wallpaper: '',
  theme: 'dark',
  accentColor: '#89b4fa',
  hasCompletedBoot: false,
  fontSize: 'medium',

  setWallpaper: (wallpaper) => set({ wallpaper }),
  setTheme: (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    set({ theme });
  },
  setAccentColor: (accentColor) => {
    document.documentElement.style.setProperty('--color-accent', accentColor);
    set({ accentColor });
  },
  markBootComplete: () => set({ hasCompletedBoot: true }),
}));
