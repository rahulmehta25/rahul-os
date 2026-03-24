import { useEffect, useState, useRef } from 'react';
import { useEffectsStore } from '../../stores/effectsStore';

const PANIC_LINES = [
  'KERNEL PANIC - NOT SYNCING: Attempted to kill init!',
  '',
  'CPU: 0 PID: 1 Comm: init Not tainted 6.1.0-rahulos #1',
  'Hardware name: RahulOS Virtual Machine',
  'Call Trace:',
  '  <TASK>',
  '  dump_stack_lvl+0x49/0x63',
  '  dump_stack+0x10/0x16',
  '  panic+0x114/0x2c5',
  '  do_exit.cold+0x63/0x99',
  '  do_group_exit+0x2d/0x90',
  '  __x64_sys_exit_group+0x14/0x20',
  '  do_syscall_64+0x5c/0x90',
  '  entry_SYSCALL_64_after_hwframe+0x63/0xcd',
  '  </TASK>',
  '',
  'Kernel Offset: 0x1e000000 from 0xffffffff81000000',
  'CR2: 0000000000000000',
  '---[ end Kernel panic - not syncing: Attempted to kill init! ]---',
  '',
  'RahulOS filesystem destroyed.',
  'All portfolio projects: DELETED',
  'Resume: GONE',
  'GitHub contributions: ZEROED',
  '',
  '...just kidding.',
  '',
  'Rebooting in 1s...',
];

type Phase = 'glitch' | 'panic' | 'fadeout' | 'reboot';

export function GlitchEffect() {
  const clearEffect = useEffectsStore((s) => s.clearEffect);
  const [phase, setPhase] = useState<Phase>('glitch');
  const [visiblePanicLines, setVisiblePanicLines] = useState(0);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Phase transitions
  useEffect(() => {
    if (phase === 'glitch') {
      phaseTimerRef.current = setTimeout(() => setPhase('panic'), 2000);
    } else if (phase === 'panic') {
      phaseTimerRef.current = setTimeout(() => setPhase('fadeout'), 3000);
    } else if (phase === 'fadeout') {
      phaseTimerRef.current = setTimeout(() => setPhase('reboot'), 1000);
    } else if (phase === 'reboot') {
      clearEffect();
      sessionStorage.removeItem('rahulos-booted');
      window.location.reload();
    }
    return () => clearTimeout(phaseTimerRef.current);
  }, [phase, clearEffect]);

  // Panic text scroll
  useEffect(() => {
    if (phase !== 'panic') return;
    const interval = setInterval(() => {
      setVisiblePanicLines((prev) => {
        if (prev >= PANIC_LINES.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [phase]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        pointerEvents: 'all',
      }}
    >
      {/* Glitch phase */}
      {phase === 'glitch' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            animation: 'glitch-jitter 0.1s infinite',
            filter: 'invert(1) hue-rotate(180deg)',
            mixBlendMode: 'difference',
            background: 'rgba(255, 0, 0, 0.05)',
          }}
        >
          {/* Scanlines */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, rgba(0,0,0,0.15) 1px, transparent 1px, transparent 3px)',
              animation: 'scanline-scroll 0.5s linear infinite',
              pointerEvents: 'none',
            }}
          />
          {/* Color split */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              animation: 'color-split 0.15s infinite',
              background: 'transparent',
              boxShadow: 'inset 3px 0 rgba(255,0,0,0.3), inset -3px 0 rgba(0,255,255,0.3)',
            }}
          />
          {/* Random blocks */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              animation: 'glitch-block 0.2s infinite',
              opacity: 0.7,
            }}
          />
        </div>
      )}

      {/* Kernel panic phase */}
      {phase === 'panic' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#000',
            padding: '24px',
            overflow: 'hidden',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#fff',
          }}
        >
          {PANIC_LINES.slice(0, visiblePanicLines).map((line, i) => (
            <div key={i} style={{ whiteSpace: 'pre' }}>
              {line || '\u00A0'}
            </div>
          ))}
          <span
            style={{
              display: 'inline-block',
              width: '8px',
              height: '14px',
              background: '#fff',
              animation: 'blink-cursor 0.5s step-end infinite',
            }}
          />
        </div>
      )}

      {/* Fade to black */}
      {phase === 'fadeout' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: '#000',
            animation: 'fade-in 0.3s ease',
          }}
        />
      )}

      <style>{`
        @keyframes glitch-jitter {
          0% { transform: translate(0, 0) skewX(0deg); }
          10% { transform: translate(-3px, 1px) skewX(-1deg); }
          20% { transform: translate(3px, -2px) skewX(1deg); }
          30% { transform: translate(-2px, 3px) skewX(-0.5deg); }
          40% { transform: translate(4px, -1px) skewX(2deg); }
          50% { transform: translate(-1px, 2px) skewX(-2deg); }
          60% { transform: translate(2px, -3px) skewX(1.5deg); }
          70% { transform: translate(-4px, 1px) skewX(-1.5deg); }
          80% { transform: translate(1px, -2px) skewX(0.5deg); }
          90% { transform: translate(-3px, 3px) skewX(-1deg); }
          100% { transform: translate(0, 0) skewX(0deg); }
        }
        @keyframes scanline-scroll {
          from { transform: translateY(0); }
          to { transform: translateY(3px); }
        }
        @keyframes color-split {
          0% { box-shadow: inset 3px 0 rgba(255,0,0,0.3), inset -3px 0 rgba(0,255,255,0.3); }
          33% { box-shadow: inset -2px 0 rgba(255,0,0,0.4), inset 4px 0 rgba(0,255,255,0.2); }
          66% { box-shadow: inset 4px 0 rgba(255,0,0,0.2), inset -2px 0 rgba(0,255,255,0.4); }
          100% { box-shadow: inset 3px 0 rgba(255,0,0,0.3), inset -3px 0 rgba(0,255,255,0.3); }
        }
        @keyframes glitch-block {
          0% { clip-path: inset(10% 0 85% 0); }
          10% { clip-path: inset(45% 0 30% 0); }
          20% { clip-path: inset(80% 0 5% 0); }
          30% { clip-path: inset(20% 0 60% 0); }
          40% { clip-path: inset(60% 0 25% 0); }
          50% { clip-path: inset(5% 0 90% 0); }
          60% { clip-path: inset(70% 0 15% 0); }
          70% { clip-path: inset(30% 0 50% 0); }
          80% { clip-path: inset(90% 0 2% 0); }
          90% { clip-path: inset(15% 0 70% 0); }
          100% { clip-path: inset(10% 0 85% 0); }
        }
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
