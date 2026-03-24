import { useEffectsStore } from '../../stores/effectsStore';
import { GlitchEffect } from './GlitchEffect';
import { MatrixRain } from './MatrixRain';

export function EffectsLayer() {
  const activeEffect = useEffectsStore((s) => s.activeEffect);

  if (!activeEffect) return null;

  if (activeEffect === 'kernelPanic') return <GlitchEffect />;
  if (activeEffect === 'matrix') return <MatrixRain />;

  return null;
}
