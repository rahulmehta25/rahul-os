import { create } from 'zustand';

export type EffectType = 'matrix' | 'kernelPanic' | null;

interface EffectsStore {
  activeEffect: EffectType;
  triggerEffect: (effect: EffectType) => void;
  clearEffect: () => void;
}

export const useEffectsStore = create<EffectsStore>((set) => ({
  activeEffect: null,
  triggerEffect: (effect) => set({ activeEffect: effect }),
  clearEffect: () => set({ activeEffect: null }),
}));
