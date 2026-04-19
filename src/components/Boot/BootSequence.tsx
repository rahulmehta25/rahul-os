import { useEffect, useState, useRef, useCallback } from 'react';
import { posthog } from '../../lib/posthog';

const POST_LINES = [
  'RahulOS BIOS v1.0.0',
  'Copyright (c) 2026 Rahul Mehta',
  '',
  'Initializing system...',
  'CPU: Apple M-Series Virtual Core @ 3.2GHz',
  'Memory test: 16384 MB OK',
  'Detecting storage devices...',
  '  /dev/sda1 — RahulOS Root (256GB SSD)',
  '  /dev/sdb1 — Projects Volume (mounted)',
  'Network adapter: eth0 — connected',
  'GPU: Virtual Graphics Adapter — OK',
  '',
  'Loading kernel modules...',
  '  [OK] filesystem.ko',
  '  [OK] windowmanager.ko',
  '  [OK] compositor.ko',
  '  [OK] dock.ko',
  '',
  'Starting RahulOS kernel...',
];

interface BootSequenceProps {
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [phase, setPhase] = useState<'post' | 'splash' | 'fade-out'>('post');
  const [splashProgress, setSplashProgress] = useState(0);
  const [flashLine, setFlashLine] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // POST phase: typing effect with line-by-line reveal
  useEffect(() => {
    if (phase !== 'post') return;

    const lineDelay = 1500 / POST_LINES.length;
    const timer = setInterval(() => {
      setVisibleLines((prev) => {
        const next = prev + 1;
        // Trigger brightness flash for this line
        setFlashLine(next - 1);
        setTimeout(() => setFlashLine(-1), 60);

        if (next >= POST_LINES.length) {
          clearInterval(timer);
          setTimeout(() => setPhase('splash'), 300);
        }
        return next;
      });
    }, lineDelay);

    return () => clearInterval(timer);
  }, [phase]);

  // Splash phase: progress bar animation
  useEffect(() => {
    if (phase !== 'splash') return;

    const start = performance.now();
    const duration = 500;
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      setSplashProgress(progress);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Start fade-out to transition to login
        setTimeout(() => setPhase('fade-out'), 200);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  // Fade-out phase: call onComplete after fade
  useEffect(() => {
    if (phase !== 'fade-out') return;
    const variant = posthog.getFeatureFlag?.('rahulos-boot-animation-variant') ?? 'classic';
    posthog.capture?.('boot_animation_played', { variant });
    const timer = setTimeout(onComplete, 250);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  // Auto-scroll POST text
  const scrollToBottom = useCallback(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [visibleLines, scrollToBottom]);

  return (
    <div
      className="fixed inset-0"
      style={{
        zIndex: 'var(--z-boot)',
        background: '#000000',
        opacity: phase === 'fade-out' ? 0 : 1,
        transition: phase === 'fade-out' ? 'opacity 200ms ease' : 'none',
      }}
    >
      {phase === 'post' && (
        <>
          {/* CRT vignette effect */}
          <div className="boot-vignette" />

          {/* POST text */}
          <div
            ref={containerRef}
            className="boot-screen-flicker"
            style={{
              position: 'absolute',
              inset: 0,
              padding: '24px',
              overflow: 'hidden',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              lineHeight: '1.7',
              color: '#33FF33',
            }}
          >
            {POST_LINES.slice(0, visibleLines).map((line, i) => (
              <div
                key={i}
                className="boot-line-appear"
                style={{
                  opacity: line === '' ? 0 : 1,
                  textShadow:
                    i === flashLine
                      ? '0 0 12px #33FF33, 0 0 24px #33FF33'
                      : '0 0 6px rgba(51, 255, 51, 0.35)',
                  transition: 'text-shadow 60ms ease',
                }}
              >
                {line || '\u00A0'}
              </div>
            ))}
            {visibleLines < POST_LINES.length && (
              <span className="boot-cursor" />
            )}
          </div>

          {/* Scanline overlay */}
          <div className="boot-scanlines" />
        </>
      )}

      {(phase === 'splash' || phase === 'fade-out') && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{ background: '#000000' }}
        >
          {/* Apple logo */}
          <svg
            width="56"
            height="68"
            viewBox="0 0 17 20"
            fill="#f5f5f7"
            className="boot-logo-appear"
          >
            <path d="M13.784 10.286c-.027-2.617 2.136-3.874 2.232-3.935-1.214-1.776-3.105-2.02-3.778-2.047-1.608-.163-3.14.947-3.956.947-.816 0-2.078-.922-3.414-.898-1.757.026-3.377 1.022-4.282 2.596-1.825 3.168-.467 7.862 1.312 10.434.87 1.258 1.906 2.672 3.268 2.622 1.312-.053 1.808-.849 3.394-.849 1.586 0 2.032.849 3.42.822 1.41-.024 2.306-1.282 3.172-2.543.998-1.459 1.41-2.87 1.436-2.943-.032-.013-2.757-1.058-2.784-4.197l-.02-.01zM11.147 2.842C11.874 1.96 12.366.768 12.234-.41c-1.016.041-2.248.677-2.977 1.532-.654.756-1.226 1.964-1.072 3.124 1.134.088 2.29-.576 2.962-1.404z" />
          </svg>

          {/* Progress bar */}
          <div
            style={{
              marginTop: '28px',
              width: '200px',
              height: '3px',
              borderRadius: '1.5px',
              background: 'rgba(255, 255, 255, 0.15)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${splashProgress * 100}%`,
                height: '100%',
                borderRadius: '1.5px',
                background: '#f5f5f7',
                transition: 'none',
              }}
            />
          </div>
        </div>
      )}

      <style>{`
        .boot-cursor {
          display: inline-block;
          width: 8px;
          height: 16px;
          background: #33FF33;
          animation: boot-blink 0.7s step-end infinite;
          vertical-align: text-bottom;
          box-shadow: 0 0 8px rgba(51, 255, 51, 0.5);
        }

        .boot-scanlines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            rgba(0, 0, 0, 0.12) 2px,
            rgba(0, 0, 0, 0.12) 4px
          );
          z-index: 10;
        }

        .boot-screen-flicker {
          animation: crt-flicker 0.1s infinite alternate;
        }

        .boot-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 11;
          background: radial-gradient(
            ellipse at center,
            transparent 60%,
            rgba(0, 0, 0, 0.45) 100%
          );
        }

        .boot-line-appear {
          animation: boot-line-in 80ms ease-out;
        }

        .boot-logo-appear {
          animation: boot-logo-in 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
        }

        @keyframes crt-flicker {
          from { opacity: 0.97; }
          to { opacity: 1.0; }
        }

        @keyframes boot-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        @keyframes boot-line-in {
          from { opacity: 0; transform: translateY(2px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes boot-logo-in {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 0.9; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
