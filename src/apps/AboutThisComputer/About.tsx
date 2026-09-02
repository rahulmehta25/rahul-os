import { useEffect, useState, useCallback } from 'react';
import { useWindowStore } from '../../stores/windowStore.ts';
import { useModalStore } from '../../stores/modalStore.ts';
import { RahulOSMark } from '../../components/shared/RahulOSMark.tsx';

const TECH_STACK = ['React', 'TypeScript', 'Zustand', 'Vite', 'Tailwind'];

const LINKS = [
  { label: 'GitHub', href: 'https://github.com/rahulmehta25' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/rahulmehta25' },
  { label: 'Portfolio', href: 'https://www.rahul-mehta.me' },
  { label: 'Email', href: 'mailto:rahulmehta2500@gmail.com' },
];

const bootTime = Date.now();

function formatUptime(ms: number): string {
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

export function AboutModal() {
  const [uptime, setUptime] = useState('0s');
  const windowCount = useWindowStore((s) => Object.keys(s.windows).length);
  const closeModal = useModalStore((s) => s.closeModal);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(formatUptime(Date.now() - bootTime));
    }, 1000);
    setUptime(formatUptime(Date.now() - bootTime));
    return () => clearInterval(interval);
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    },
    [closeModal],
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 'var(--z-modal)',
        background: 'var(--color-bg-overlay)',
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        animation: 'chrome-fade 220ms ease-out',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) closeModal();
      }}
    >
      <div
        className="relative flex flex-col items-center"
        style={{
          fontFamily: 'var(--font-system)',
          background: 'var(--color-bg-surface)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          border: '0.5px solid var(--color-border-active)',
          boxShadow: 'var(--shadow-window-active)',
          width: '400px',
          padding: '36px 32px 28px',
          borderRadius: '18px',
          animation: 'chrome-rise var(--rise-panel) both',
          gap: '8px',
        }}
      >
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            boxShadow: 'var(--glass-highlight)',
          }}
        />

        <button
          onClick={closeModal}
          className="absolute top-3 right-3 rounded-full flex items-center justify-center"
          style={{
            width: '18px',
            height: '18px',
            background: 'var(--color-bg-active)',
            color: 'var(--color-text-tertiary)',
            border: 'none',
            cursor: 'pointer',
            fontSize: '12px',
            lineHeight: 1,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-close)'; e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-bg-active)'; e.currentTarget.style.color = 'var(--color-text-tertiary)'; }}
          aria-label="Close"
        >
          ×
        </button>

        <div style={{ color: 'var(--color-text-primary)', marginBottom: '4px' }}>
          <RahulOSMark size={36} variant="splash" />
        </div>

        <div
          style={{
            fontSize: 'var(--text-xl)',
            fontWeight: 500,
            letterSpacing: 'var(--tracking-tight)',
            color: 'var(--color-text-primary)',
          }}
        >
          RahulOS
        </div>

        <div
          className="label-quiet"
          style={{ marginTop: '2px' }}
        >
          Version 1.0
        </div>

        <div style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginTop: '4px' }}>
          Built by Rahul Mehta
        </div>

        <div className="flex flex-wrap justify-center" style={{ gap: '8px', marginTop: '20px' }}>
          {TECH_STACK.map((tech) => (
            <span key={tech} className="chip-quiet">
              {tech}
            </span>
          ))}
        </div>

        <div className="flex" style={{ gap: '18px', marginTop: '16px' }}>
          {LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--color-accent)',
                fontSize: 'var(--text-sm)',
                textDecoration: 'none',
                letterSpacing: 'var(--tracking-snug)',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div
          className="flex"
          style={{
            gap: '28px',
            marginTop: '20px',
            padding: '12px 20px',
            borderRadius: '12px',
            background: 'var(--color-bg-input)',
            border: '0.5px solid var(--color-border)',
          }}
        >
          <div className="text-center">
            <div className="label-quiet">Uptime</div>
            <div style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', fontWeight: 500, marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
              {uptime}
            </div>
          </div>
          <div className="text-center">
            <div className="label-quiet">Windows</div>
            <div style={{ color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-mono)', fontWeight: 500, marginTop: '4px', fontVariantNumeric: 'tabular-nums' }}>
              {windowCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function About() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full"
      style={{ fontFamily: 'var(--font-system)', gap: '8px', padding: '24px' }}
    >
      <RahulOSMark size={36} variant="splash" />
      <div style={{ fontSize: 'var(--text-xl)', fontWeight: 500, letterSpacing: 'var(--tracking-tight)', color: 'var(--color-text-primary)' }}>
        RahulOS
      </div>
      <div className="label-quiet">Version 1.0</div>
    </div>
  );
}
