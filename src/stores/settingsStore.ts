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
  wallpaper: 'radial-gradient(ellipse at 75% 85%, #F5872A 0%, #D4692A 8%, #8B6E35 16%, #3E8F4A 26%, #1A9068 36%, #0D7B7A 46%, #0B5A6E 56%, #142D50 68%, #2A1F5C 80%, #3C2068 90%, #281548 100%)',
  theme: 'dark',
  accentColor: '#0A84FF',
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
