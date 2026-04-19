import { useState, useEffect, useCallback } from 'react';
import { ConversationProvider } from '@elevenlabs/react';
import { useSettingsStore } from './stores/settingsStore.ts';
import { Desktop } from './components/Desktop/Desktop.tsx';
import { MobileFallback } from './components/Mobile/MobileFallback.tsx';
import { BootSequence } from './components/Boot/BootSequence.tsx';
import { LoginScreen } from './components/Boot/LoginScreen.tsx';
import { EffectsLayer } from './components/Effects/EffectsLayer.tsx';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);

  return isMobile;
}

type Phase = 'boot' | 'login' | 'desktop';

function getInitialPhase(): Phase {
  if (sessionStorage.getItem('rahulos-booted') === '1') return 'desktop';
  return 'boot';
}

export default function App() {
  const isMobile = useIsMobile();
  const [phase, setPhase] = useState<Phase>(getInitialPhase);
  const markBootComplete = useSettingsStore((s) => s.markBootComplete);

  const handleBootComplete = useCallback(() => {
    setPhase('login');
  }, []);

  const handleLogin = useCallback(() => {
    sessionStorage.setItem('rahulos-booted', '1');
    markBootComplete();
    setPhase('desktop');
  }, [markBootComplete]);

  if (isMobile) return <MobileFallback />;

  if (phase === 'boot') return <BootSequence onComplete={handleBootComplete} />;
  if (phase === 'login') return <LoginScreen onLogin={handleLogin} />;

  return (
    <ConversationProvider>
      <Desktop />
      <EffectsLayer />
    </ConversationProvider>
  );
}
