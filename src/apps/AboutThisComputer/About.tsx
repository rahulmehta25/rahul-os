import { useEffect, useState } from 'react';
import { useWindowStore } from '../../stores/windowStore.ts';

const TECH_STACK = [
  { name: 'React', color: '#61dafb' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'Zustand', color: '#f9e2af' },
  { name: 'Vite', color: '#bd34fe' },
  { name: 'Tailwind', color: '#38bdf8' },
];

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

export function About() {
  const [uptime, setUptime] = useState('0s');
  const windowCount = useWindowStore((s) => Object.keys(s.windows).length);

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime(formatUptime(Date.now() - bootTime));
    }, 1000);
    setUptime(formatUptime(Date.now() - bootTime));
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-4 p-6"
      style={{ fontFamily: 'var(--font-system)' }}
    >
      {/* Logo */}
      <div
        style={{
          fontSize: '28px',
          fontWeight: 700,
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.5px',
        }}
      >
        RahulOS
      </div>

      <div style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
        Version 1.0
      </div>

      <div style={{ color: 'var(--color-text-tertiary)', fontSize: '12px' }}>
        Built by Rahul Mehta
      </div>

      {/* Tech stack badges */}
      <div className="flex flex-wrap justify-center gap-2 mt-1">
        {TECH_STACK.map((tech) => (
          <span
            key={tech.name}
            className="px-2.5 py-1 rounded-full"
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: tech.color,
              background: `${tech.color}15`,
              border: `1px solid ${tech.color}30`,
            }}
          >
            {tech.name}
          </span>
        ))}
      </div>

      {/* Links */}
      <div className="flex gap-4 mt-1">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'var(--color-accent)',
              fontSize: '12px',
              textDecoration: 'none',
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* Stats */}
      <div
        className="flex gap-6 mt-2 px-4 py-2.5 rounded-lg"
        style={{
          background: 'var(--color-bg-input)',
          border: '1px solid var(--color-border)',
        }}
      >
        <div className="text-center">
          <div style={{ color: 'var(--color-text-tertiary)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Uptime
          </div>
          <div style={{ color: 'var(--color-text-primary)', fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 500, marginTop: '2px' }}>
            {uptime}
          </div>
        </div>
        <div className="text-center">
          <div style={{ color: 'var(--color-text-tertiary)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Windows
          </div>
          <div style={{ color: 'var(--color-text-primary)', fontSize: '13px', fontFamily: 'var(--font-mono)', fontWeight: 500, marginTop: '2px' }}>
            {windowCount}
          </div>
        </div>
      </div>
    </div>
  );
}
