import { useEffect, useState } from 'react';

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
  const [phase, setPhase] = useState<'post' | 'splash'>('post');

  useEffect(() => {
    if (phase !== 'post') return;

    const lineDelay = 1500 / POST_LINES.length;
    const timer = setInterval(() => {
      setVisibleLines((prev) => {
        const next = prev + 1;
        if (next >= POST_LINES.length) {
          clearInterval(timer);
          setTimeout(() => setPhase('splash'), 200);
        }
        return next;
      });
    }, lineDelay);

    return () => clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== 'splash') return;
    const timer = setTimeout(onComplete, 500);
    return () => clearTimeout(timer);
  }, [phase, onComplete]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 'var(--z-boot)',
        background: '#0a0a0a',
      }}
    >
      {phase === 'post' && (
        <div
          className="w-full h-full p-6 overflow-hidden"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            lineHeight: '1.6',
            color: '#33ff33',
          }}
        >
          {POST_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} style={{ opacity: line === '' ? 0 : 1 }}>
              {line || '\u00A0'}
            </div>
          ))}
          {visibleLines < POST_LINES.length && (
            <span
              style={{
                display: 'inline-block',
                width: '8px',
                height: '14px',
                background: '#33ff33',
                animation: 'blink-cursor 0.8s step-end infinite',
              }}
            />
          )}
        </div>
      )}

      {phase === 'splash' && (
        <div className="flex flex-col items-center gap-4" style={{ animation: 'fade-in 0.3s ease' }}>
          <div
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: '#cdd6f4',
              fontFamily: 'var(--font-system)',
              letterSpacing: '-0.5px',
            }}
          >
            RahulOS
          </div>
          <div
            style={{
              width: '24px',
              height: '24px',
              border: '2px solid rgba(255,255,255,0.2)',
              borderTopColor: '#89b4fa',
              borderRadius: '50%',
              animation: 'spin 0.6s linear infinite',
            }}
          />
        </div>
      )}

      <style>{`
        @keyframes blink-cursor {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
