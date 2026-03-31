import { useState, useEffect } from 'react';
import { useSettingsStore } from '../../stores/settingsStore.ts';

const WALLPAPERS = [
  {
    name: 'Sequoia',
    value: 'radial-gradient(ellipse at 75% 85%, #F5872A 0%, #D4692A 8%, #8B6E35 16%, #3E8F4A 26%, #1A9068 36%, #0D7B7A 46%, #0B5A6E 56%, #142D50 68%, #2A1F5C 80%, #3C2068 90%, #281548 100%)',
    lightValue: 'radial-gradient(ellipse at 75% 85%, #FDCFA1 0%, #F4BC90 8%, #D6CC94 16%, #96D8A6 26%, #7AD4B8 36%, #78C8C8 46%, #82BCD2 56%, #94B4D8 68%, #B4A4D8 80%, #C8B0E0 90%, #BAA4D6 100%)',
  },
  {
    name: 'Midnight',
    value: 'radial-gradient(1.5px 1.5px at 20% 30%, rgba(255,255,255,0.3) 0%, transparent 100%), radial-gradient(1px 1px at 40% 70%, rgba(200,220,255,0.2) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 70% 25%, rgba(255,255,255,0.25) 0%, transparent 100%), radial-gradient(1px 1px at 85% 65%, rgba(200,220,255,0.15) 0%, transparent 100%), radial-gradient(1px 1px at 55% 85%, rgba(255,255,255,0.2) 0%, transparent 100%), radial-gradient(1.5px 1.5px at 10% 80%, rgba(255,255,255,0.18) 0%, transparent 100%), radial-gradient(1px 1px at 92% 45%, rgba(200,220,255,0.22) 0%, transparent 100%), radial-gradient(ellipse at 30% 70%, rgba(25,35,80,0.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, #0d0f1e 0%, #0a0c18 25%, #080a14 50%, #060810 75%, #04060c 100%)',
  },
  {
    name: 'Aurora',
    value: 'radial-gradient(ellipse at 50% 0%, rgba(0,255,135,0.22) 0%, transparent 55%), radial-gradient(ellipse at 70% 25%, rgba(0,212,255,0.18) 0%, transparent 45%), radial-gradient(ellipse at 35% 45%, rgba(191,90,242,0.14) 0%, transparent 40%), radial-gradient(ellipse at 55% 65%, rgba(0,255,135,0.08) 0%, transparent 35%), linear-gradient(180deg, #051510 0%, #082018 25%, #0a281e 45%, #082018 65%, #051510 85%, #030d0a 100%)',
  },
  {
    name: 'Sunset',
    value: 'radial-gradient(ellipse at 50% 120%, #F08030 0%, #E05828 12%, #D04028 22%, #B03040 34%, #803058 48%, #552560 60%, #351B50 72%, #1A1035 85%, #0E0A20 100%)',
  },
  {
    name: 'Ocean',
    value: 'radial-gradient(ellipse at 50% -20%, rgba(32,178,210,0.2) 0%, transparent 50%), radial-gradient(ellipse at 30% 40%, rgba(15,80,130,0.25) 0%, transparent 45%), linear-gradient(180deg, #1A6B8A 0%, #125878 15%, #0E4868 30%, #0A3858 45%, #082C48 60%, #052038 75%, #031828 88%, #020E1A 100%)',
  },
  {
    name: 'Forest',
    value: 'radial-gradient(ellipse at 55% 15%, rgba(180,200,50,0.1) 0%, transparent 45%), radial-gradient(ellipse at 40% 55%, rgba(45,106,79,0.3) 0%, transparent 45%), linear-gradient(170deg, #1E4D2B 0%, #184225 15%, #123A1E 30%, #0E3018 45%, #0A2612 60%, #081E0E 75%, #05160A 88%, #030E06 100%)',
  },
  {
    name: 'Slate',
    value: 'radial-gradient(ellipse at 50% 0%, rgba(55,60,75,0.4) 0%, transparent 65%), linear-gradient(170deg, #2C3038 0%, #262930 20%, #212428 40%, #1C1F24 60%, #181B1F 80%, #14171A 100%)',
  },
];

const ACCENT_COLORS = [
  { name: 'Blue', value: '#0A84FF' },
  { name: 'Purple', value: '#BF5AF2' },
  { name: 'Green', value: '#34C759' },
  { name: 'Pink', value: '#FF2D55' },
  { name: 'Orange', value: '#FF9F0A' },
  { name: 'Teal', value: '#64D2FF' },
];

const TECH_STACK = [
  { label: 'React', color: '#61DAFB' },
  { label: 'TypeScript', color: '#3178C6' },
  { label: 'Vite', color: '#646CFF' },
  { label: 'Zustand', color: '#443E38' },
  { label: 'Tailwind', color: '#06B6D4' },
];

type Section = 'general' | 'appearance' | 'notifications' | 'about';

const sidebarItems: { id: Section; label: string; iconBg: string; icon: React.ReactNode }[] = [
  {
    id: 'general',
    label: 'General',
    iconBg: '#8E8E93',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
        <path d="M8 0a1 1 0 011 1v1.07A5.5 5.5 0 0112.93 6H14a1 1 0 110 2h-1.07A5.5 5.5 0 019 11.93V14a1 1 0 11-2 0v-2.07A5.5 5.5 0 013.07 8H2a1 1 0 010-2h1.07A5.5 5.5 0 017 2.07V1a1 1 0 011-1zm0 4.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7zM8 6a2 2 0 110 4 2 2 0 010-4z" />
      </svg>
    ),
  },
  {
    id: 'appearance',
    label: 'Appearance',
    iconBg: '#5856D6',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="5.5" stroke="white" strokeWidth="1.5" />
        <path d="M8 2.5v11" stroke="white" strokeWidth="1.5" />
        <path d="M8 2.5C5.8 2.5 2.5 5.2 2.5 8s3.3 5.5 5.5 5.5" fill="white" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: 'notifications',
    label: 'Notifications',
    iconBg: '#FF3B30',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="white">
        <path d="M8 1a5 5 0 00-5 5v3.5L2 11h12l-1-1.5V6a5 5 0 00-5-5z" />
        <path d="M6.5 12a1.5 1.5 0 003 0" fill="white" />
      </svg>
    ),
  },
  {
    id: 'about',
    label: 'About',
    iconBg: '#636366',
    icon: (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="1.5" />
        <circle cx="8" cy="5.5" r="1" fill="white" />
        <path d="M8 8v3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

export function Settings() {
  const { wallpaper, theme, accentColor, setWallpaper, setTheme, setAccentColor } = useSettingsStore();
  const [section, setSection] = useState<Section>('appearance');
  const [uptime, setUptime] = useState(0);

  const currentWallpaper = wallpaper || WALLPAPERS[0].value;

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setUptime(Math.floor((Date.now() - start) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}h ${m}m ${s}s`;
    if (m > 0) return `${m}m ${s}s`;
    return `${s}s`;
  };

  return (
    <div className="flex h-full" style={{ fontFamily: 'var(--font-system)', fontSize: '13px' }}>
      {/* Sidebar */}
      <div
        className="flex flex-col shrink-0"
        style={{
          width: '210px',
          padding: '10px 10px',
          borderRight: '0.5px solid var(--color-border)',
          background: 'var(--color-bg-input)',
          gap: '2px',
        }}
      >
        {/* Search bar (decorative) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '5px 8px',
            margin: '2px 2px 10px',
            borderRadius: '6px',
            background: 'var(--color-bg-input)',
            color: 'var(--color-text-tertiary)',
            fontSize: '12px',
          }}
        >
          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="6.5" cy="6.5" r="5" />
            <path d="M10.5 10.5l3.5 3.5" strokeLinecap="round" />
          </svg>
          Search
        </div>

        {sidebarItems.map((item, i) => (
          <div key={item.id}>
            {/* Visual separator before About */}
            {i === sidebarItems.length - 1 && (
              <div style={{ height: '1px', background: 'var(--color-border)', margin: '6px 8px' }} />
            )}
            <button
              className="flex items-center gap-2.5 text-left rounded-lg w-full"
              style={{
                color: section === item.id ? '#ffffff' : 'var(--color-text-primary)',
                background: section === item.id ? 'var(--color-accent)' : 'transparent',
                fontWeight: section === item.id ? 500 : 400,
                fontSize: '13px',
                border: 'none',
                cursor: 'default',
                transition: 'background 100ms, color 100ms',
                padding: '5px 8px',
              }}
              onClick={() => setSection(item.id)}
            >
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: item.iconBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {item.icon}
              </div>
              {item.label}
            </button>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto" style={{ padding: '20px 24px', background: 'transparent' }}>
        {section === 'appearance' && (
          <div className="flex flex-col gap-5" style={{ maxWidth: '480px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              Appearance
            </h2>

            {/* Theme toggle */}
            <SettingsGroup title="Theme">
              <div className="flex items-center justify-between" style={{ padding: '2px 0' }}>
                <div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginTop: '2px' }}>
                    Switch between dark and light mode
                  </div>
                </div>
                <div className="flex" style={{ gap: '8px' }}>
                  {(['dark', 'light'] as const).map((t) => (
                    <button
                      key={t}
                      className="flex flex-col items-center gap-1.5"
                      style={{ border: 'none', background: 'none', cursor: 'default' }}
                      onClick={() => setTheme(t)}
                    >
                      <div
                        style={{
                          width: '56px',
                          height: '38px',
                          borderRadius: '8px',
                          background: t === 'dark'
                            ? 'linear-gradient(180deg, #2a2a2a 0%, #1a1a1a 100%)'
                            : 'linear-gradient(180deg, #f0f0f0 0%, #e0e0e0 100%)',
                          border: theme === t
                            ? '2px solid var(--color-accent)'
                            : '1px solid var(--color-border)',
                          transition: 'border 150ms',
                        }}
                      />
                      <span style={{
                        fontSize: '10px',
                        color: theme === t ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                        fontWeight: theme === t ? 600 : 400,
                        textTransform: 'capitalize',
                      }}>
                        {t}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </SettingsGroup>

            {/* Accent Color */}
            <SettingsGroup title="Accent Color">
              <div className="flex" style={{ gap: '10px', padding: '2px 0' }}>
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.name}
                    className="rounded-full flex items-center justify-center"
                    title={c.name}
                    style={{
                      width: '26px',
                      height: '26px',
                      background: c.value,
                      border: 'none',
                      cursor: 'default',
                      boxShadow: accentColor === c.value
                        ? `0 0 0 2px var(--color-bg-surface-solid), 0 0 0 4px ${c.value}`
                        : 'inset 0 1px 2px rgba(0,0,0,0.2)',
                      transition: 'box-shadow 150ms',
                    }}
                    onClick={() => setAccentColor(c.value)}
                    aria-label={`${c.name} accent color`}
                  >
                    {accentColor === c.value && (
                      <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7.5L5.5 10L11 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </SettingsGroup>

            {/* Wallpaper */}
            <SettingsGroup title="Wallpaper">
              <div className="grid grid-cols-4 gap-2.5" style={{ padding: '2px 0' }}>
                {WALLPAPERS.map((wp) => {
                  const displayValue = (theme === 'light' && wp.lightValue) ? wp.lightValue : wp.value;
                  const isSelected = currentWallpaper === wp.value || currentWallpaper === wp.lightValue;
                  return (
                  <button
                    key={wp.name}
                    className="rounded-lg overflow-hidden relative"
                    style={{
                      height: '56px',
                      background: displayValue,
                      border: isSelected
                        ? '2.5px solid var(--color-accent)'
                        : '1px solid var(--color-border)',
                      opacity: isSelected ? 1 : 0.75,
                      transition: 'opacity 150ms, border-color 150ms, transform 150ms',
                      cursor: 'default',
                    }}
                    onClick={() => setWallpaper(wp.value)}
                    aria-label={`${wp.name} wallpaper`}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '3px',
                        left: '0',
                        right: '0',
                        textAlign: 'center',
                        fontSize: '9px',
                        color: 'white',
                        textShadow: '0 1px 4px rgba(0,0,0,0.9)',
                        fontWeight: 600,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {wp.name}
                    </span>
                  </button>
                  );
                })}
              </div>
            </SettingsGroup>
          </div>
        )}

        {(section === 'general' || section === 'notifications') && (
          <div className="flex flex-col gap-5" style={{ maxWidth: '480px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              {section === 'general' ? 'General' : 'Notifications'}
            </h2>
            <SettingsGroup>
              <div className="flex flex-col items-center" style={{ padding: '28px 0', gap: '10px' }}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="var(--color-text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {section === 'general' ? (
                    <>
                      <circle cx="14" cy="14" r="5" />
                      <path d="M14 3v3M14 22v3M3 14h3M22 14h3M5.6 5.6l2.1 2.1M20.3 20.3l2.1 2.1M5.6 22.4l2.1-2.1M20.3 7.7l2.1-2.1" />
                    </>
                  ) : (
                    <>
                      <path d="M14 4a7 7 0 00-7 7v5l-1.5 2h17L21 16V11a7 7 0 00-7-7z" />
                      <path d="M11 22a3 3 0 006 0" />
                    </>
                  )}
                </svg>
                <div style={{ color: 'var(--color-text-tertiary)', fontSize: '13px' }}>
                  Coming soon
                </div>
              </div>
            </SettingsGroup>
          </div>
        )}

        {section === 'about' && (
          <div className="flex flex-col gap-5" style={{ maxWidth: '420px' }}>
            {/* Hero */}
            <div className="flex flex-col items-center gap-2" style={{ padding: '12px 0 8px' }}>
              <svg width="52" height="62" viewBox="0 0 17 20" fill="var(--color-text-primary)" style={{ opacity: 0.8 }}>
                <path d="M13.784 10.286c-.027-2.617 2.136-3.874 2.232-3.935-1.214-1.776-3.105-2.02-3.778-2.047-1.608-.163-3.14.947-3.956.947-.816 0-2.078-.922-3.414-.898-1.757.026-3.377 1.022-4.282 2.596-1.825 3.168-.467 7.862 1.312 10.434.87 1.258 1.906 2.672 3.268 2.622 1.312-.053 1.808-.849 3.394-.849 1.586 0 2.032.849 3.42.822 1.41-.024 2.306-1.282 3.172-2.543.998-1.459 1.41-2.87 1.436-2.943-.032-.013-2.757-1.058-2.784-4.197l-.02-.01zM11.147 2.842C11.874 1.96 12.366.768 12.234-.41c-1.016.041-2.248.677-2.977 1.532-.654.756-1.226 1.964-1.072 3.124 1.134.088 2.29-.576 2.962-1.404z" />
              </svg>
              <div style={{ fontSize: '24px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                RahulOS
              </div>
              <div style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                Version 1.0.0
              </div>
            </div>

            {/* System info */}
            <SettingsGroup title="System Information">
              <div className="flex flex-col" style={{ gap: '10px', padding: '2px 0' }}>
                <SettingsRow label="Built by" value="Rahul Mehta" />
                <SettingsRow label="Chip" value="Apple M-Series Virtual" />
                <SettingsRow label="Memory" value="16 GB" />
                <SettingsRow label="Storage" value="256 GB SSD" />
                <SettingsRow label="Uptime" value={formatUptime(uptime)} accent />
              </div>
            </SettingsGroup>

            {/* Tech stack */}
            <SettingsGroup title="Tech Stack">
              <div className="flex flex-wrap" style={{ gap: '6px', padding: '2px 0' }}>
                {TECH_STACK.map((t) => (
                  <span
                    key={t.label}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '3px 10px',
                      borderRadius: '12px',
                      fontSize: '11px',
                      fontWeight: 500,
                      background: `${t.color}18`,
                      color: t.color,
                      border: `0.5px solid ${t.color}30`,
                    }}
                  >
                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.color }} />
                    {t.label}
                  </span>
                ))}
              </div>
            </SettingsGroup>

            {/* Links */}
            <SettingsGroup title="Links">
              <div className="flex flex-col" style={{ gap: '8px', padding: '2px 0' }}>
                <a
                  href="https://github.com/rahulmehta25"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: '13px',
                    textDecoration: 'none',
                  }}
                >
                  <span>GitHub</span>
                  <span style={{ color: 'var(--color-accent)', fontSize: '12px' }}>rahulmehta25</span>
                </a>
                <a
                  href="https://github.com/rahulmehta25/RahulOS"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between"
                  style={{
                    color: 'var(--color-text-primary)',
                    fontSize: '13px',
                    textDecoration: 'none',
                  }}
                >
                  <span>Source Code</span>
                  <span style={{ color: 'var(--color-accent)', fontSize: '12px' }}>View on GitHub</span>
                </a>
              </div>
            </SettingsGroup>
          </div>
        )}
      </div>
    </div>
  );
}

function SettingsGroup({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: 'var(--color-bg-hover)',
        borderRadius: '12px',
        padding: '14px 16px',
        border: '0.5px solid var(--color-border)',
      }}
    >
      {title && (
        <div style={{
          fontWeight: 500,
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.03em',
        }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

function SettingsRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between items-center" style={{ fontSize: '13px' }}>
      <span style={{ color: 'var(--color-text-secondary)' }}>{label}</span>
      <span style={{
        color: accent ? 'var(--color-accent)' : 'var(--color-text-primary)',
        fontWeight: 400,
        fontVariantNumeric: accent ? 'tabular-nums' : undefined,
      }}>
        {value}
      </span>
    </div>
  );
}
