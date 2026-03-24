import { useEffect, useState } from 'react';

export function MenuBar() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const formatted = time.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div
      className="fixed top-0 left-0 right-0 flex items-center justify-between px-4 select-none"
      style={{
        height: 'var(--menubar-height)',
        background: 'var(--color-bg-menubar)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border)',
        zIndex: 'var(--z-menubar)',
        fontSize: '13px',
        fontWeight: 500,
      }}
    >
      {/* Left: Logo */}
      <div className="flex items-center gap-4">
        <span className="font-bold" style={{ color: 'var(--color-text-primary)' }}>
          RahulOS
        </span>
      </div>

      {/* Right: Status icons + Clock */}
      <div className="flex items-center gap-3" style={{ color: 'var(--color-text-secondary)' }}>
        {/* Wi-Fi icon (decorative) */}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12.55a11 11 0 0 1 14.08 0" />
          <path d="M1.42 9a16 16 0 0 1 21.16 0" />
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
          <circle cx="12" cy="20" r="1" fill="currentColor" />
        </svg>

        {/* Battery (always 100%) */}
        <div className="flex items-center gap-0.5">
          <svg width="18" height="14" viewBox="0 0 24 14" fill="none">
            <rect x="0.5" y="0.5" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1" />
            <rect x="2" y="2" width="17" height="10" rx="1" fill="currentColor" opacity="0.7" />
            <rect x="21" y="4" width="2.5" height="6" rx="1" fill="currentColor" opacity="0.5" />
          </svg>
        </div>

        <span>{dateStr}</span>
        <span className="font-medium" style={{ color: 'var(--color-text-primary)' }}>
          {formatted}
        </span>
      </div>
    </div>
  );
}
