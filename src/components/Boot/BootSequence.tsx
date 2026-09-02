import { useEffect, useState, useRef, useCallback } from 'react';
import { posthog } from '../../lib/posthog';
import { RahulOSMark } from '../shared/RahulOSMark.tsx';

const POST_LINES = [
  'RahulOS BIOS v1.0.0',
  'Copyright (c) 2026 Rahul Mehta',
  '',
  'Initializing system...',
  'CPU: Virtual Core @ 3.2GHz',
  'Memory test: 16384 MB OK',
  'Detecting storage devices...',
  '  /dev/sda1: RahulOS Root (256GB SSD)',
  '  /dev/sdb1: Projects Volume (mounted)',
  'Network adapter: eth0 connected',
  'GPU: Virtual Graphics Adapter OK',
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

  useEffect(() => {
    if (phase !== 'post') return;

    const lineDelay = 1500 / POST_LINES.length;
    const timer = setInterval(() => {
      setVisibleLines((prev) => {
        const next = prev + 1;
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
        setTimeout(() => setPhase('fade-out'), 200);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'fade-out') return;
    const variant = posthog.getFeatureFlag?.('rahulos-boot-animation-variant') ?? 'classic';
    posthog.capture?.('boot_animation_played', { variant });
    const timer = setTimeout(onComplete, 250);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

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
          <div className="boot-vignette" />

          <div
            ref={containerRef}
            className="boot-screen-flicker"
            style={{
              position: 'absolute',
              inset: 0,
              padding: '32px 36px',
              overflow: 'hidden',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: '1.75',
              letterSpacing: '0.01em',
              color: '#5CFF6A',
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
                      ? '0 0 12px #5CFF6A, 0 0 24px #5CFF6A'
                      : '0 0 6px rgba(92, 255, 106, 0.28)',
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

          <div className="boot-scanlines" />
        </>
      )}

      {(phase === 'splash' || phase === 'fade-out') && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-center"
          style={{ background: '#000000' }}
        >
          <div className="boot-logo-appear">
            <RahulOSMark size={56} variant="splash" />
          </div>

          <div
            style={{
              marginTop: '36px',
              width: '168px',
              height: '3px',
              borderRadius: '2px',
              background: 'rgba(255, 255, 255, 0.12)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${splashProgress * 100}%`,
                height: '100%',
                borderRadius: '2px',
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
          width: 7px;
          height: 15px;
          background: #5CFF6A;
          animation: boot-blink 0.7s step-end infinite;
          vertical-align: text-bottom;
          box-shadow: 0 0 8px rgba(92, 255, 106, 0.45);
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
            transparent 58%,
            rgba(0, 0, 0, 0.5) 100%
          );
        }

        .boot-line-appear {
          animation: boot-line-in 80ms ease-out;
        }

        .boot-logo-appear {
          animation: boot-logo-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
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
          from { opacity: 0; transform: scale(0.92); }
          to { opacity: 0.92; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
