import { useState } from 'react';
import { useSettingsStore } from '../../stores/settingsStore.ts';

const WALLPAPERS = [
  { name: 'Midnight', value: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 30%, #16213e 60%, #0f3460 100%)' },
  { name: 'Aurora', value: 'linear-gradient(135deg, #0f2027 0%, #203a43 40%, #2c5364 100%)' },
  { name: 'Sunset', value: 'linear-gradient(135deg, #2d1b4e 0%, #4a2066 30%, #8b2252 60%, #c74b3f 100%)' },
  { name: 'Ocean', value: 'linear-gradient(135deg, #0a1628 0%, #0d3b66 40%, #1a759f 70%, #168aad 100%)' },
  { name: 'Forest', value: 'linear-gradient(135deg, #0b1a0f 0%, #1a3a2a 30%, #2d6a4f 60%, #40916c 100%)' },
  { name: 'Slate', value: 'linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 50%, #313244 100%)' },
];

const ACCENT_COLORS = [
  { name: 'Blue', value: '#89b4fa' },
  { name: 'Purple', value: '#cba6f7' },
  { name: 'Green', value: '#a6e3a1' },
  { name: 'Pink', value: '#f38ba8' },
  { name: 'Peach', value: '#fab387' },
  { name: 'Teal', value: '#94e2d5' },
];

type Section = 'appearance' | 'about';

export function Settings() {
  const { wallpaper, theme, accentColor, setWallpaper, setTheme, setAccentColor } = useSettingsStore();
  const [section, setSection] = useState<Section>('appearance');

  const currentWallpaper = wallpaper || WALLPAPERS[0].value;

  return (
    <div className="flex h-full" style={{ fontFamily: 'var(--font-system)', fontSize: '13px' }}>
      {/* Sidebar */}
      <div
        className="flex flex-col gap-0.5 p-2 shrink-0"
        style={{
          width: '160px',
          borderRight: '1px solid var(--color-border)',
          background: 'var(--color-bg-hover)',
        }}
      >
        {[
          { id: 'appearance' as Section, label: 'Appearance' },
          { id: 'about' as Section, label: 'About' },
        ].map((item) => (
          <button
            key={item.id}
            className="text-left px-3 py-1.5 rounded"
            style={{
              color: section === item.id ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
              background: section === item.id ? 'var(--color-accent-subtle)' : 'transparent',
              fontWeight: section === item.id ? 500 : 400,
            }}
            onClick={() => setSection(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5">
        {section === 'appearance' && (
          <div className="flex flex-col gap-6">
            {/* Wallpaper */}
            <div>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: '10px',
                }}
              >
                Wallpaper
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {WALLPAPERS.map((wp) => (
                  <button
                    key={wp.name}
                    className="rounded-lg overflow-hidden"
                    style={{
                      height: '60px',
                      background: wp.value,
                      border: currentWallpaper === wp.value
                        ? '2px solid var(--color-accent)'
                        : '2px solid var(--color-border)',
                      opacity: currentWallpaper === wp.value ? 1 : 0.7,
                      transition: 'opacity 150ms, border-color 150ms',
                    }}
                    onClick={() => setWallpaper(wp.value)}
                    aria-label={`${wp.name} wallpaper`}
                  />
                ))}
              </div>
            </div>

            {/* Theme */}
            <div>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: '10px',
                }}
              >
                Theme
              </h3>
              <div className="flex gap-2">
                {(['dark', 'light'] as const).map((t) => (
                  <button
                    key={t}
                    className="px-4 py-2 rounded-lg"
                    style={{
                      background: theme === t ? 'var(--color-accent)' : 'var(--color-bg-input)',
                      color: theme === t ? 'var(--color-text-inverse)' : 'var(--color-text-primary)',
                      fontWeight: 500,
                      border: '1px solid var(--color-border)',
                      transition: 'background 150ms, color 150ms',
                      textTransform: 'capitalize',
                    }}
                    onClick={() => setTheme(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <h3
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--color-text-primary)',
                  marginBottom: '10px',
                }}
              >
                Accent Color
              </h3>
              <div className="flex gap-3">
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.name}
                    className="rounded-full"
                    style={{
                      width: '28px',
                      height: '28px',
                      background: c.value,
                      border: accentColor === c.value
                        ? '3px solid var(--color-text-primary)'
                        : '2px solid var(--color-border)',
                      transition: 'border 150ms',
                    }}
                    onClick={() => setAccentColor(c.value)}
                    aria-label={`${c.name} accent color`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {section === 'about' && (
          <div className="flex flex-col gap-4">
            <div
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: 'var(--color-text-primary)',
              }}
            >
              RahulOS
            </div>
            <div style={{ color: 'var(--color-text-secondary)' }}>
              Version 1.0 &middot; Built by Rahul Mehta
            </div>
            <div style={{ color: 'var(--color-text-tertiary)', fontSize: '12px' }}>
              A browser-based desktop OS built as a creative portfolio piece.
            </div>
            <a
              href="https://github.com/rahulmehta25"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--color-accent)',
                fontSize: '12px',
                textDecoration: 'none',
              }}
            >
              github.com/rahulmehta25
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
