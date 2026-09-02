import { useState, useCallback, useRef } from 'react';

interface Favorite {
  name: string;
  url: string;
  note: string;
}

const FAVORITES: Favorite[] = [
  {
    name: 'Portfolio',
    url: 'https://rahul-mehta.me',
    note: 'Projects, writing, and contact.',
  },
  {
    name: 'Osmoti',
    url: 'https://osmoti.com',
    note: 'Ad performance platform.',
  },
  {
    name: 'Keep Safe',
    url: 'https://beachbox.co',
    note: 'Hotel safe, speaker, and concierge.',
  },
  {
    name: 'Analytics Pro',
    url: 'https://analytics-pro-frontend.vercel.app',
    note: 'Ask marketing data in plain English.',
  },
  {
    name: 'RahulOS',
    url: 'https://os.rahul-mehta.me',
    note: 'This desktop, in a browser.',
  },
  {
    name: 'Screenshot Reviewer',
    url: 'https://github.com/rahulmehta25/File-Reviewer',
    note: 'macOS screenshot review app.',
  },
];

function hostname(url: string) {
  return url.replace(/^https?:\/\//, '');
}

export function Browser() {
  const [addressValue, setAddressValue] = useState('');
  const [addressFocused, setAddressFocused] = useState(false);
  const addressRef = useRef<HTMLInputElement>(null);

  const handleAddressSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!addressValue.trim()) return;
      let url = addressValue.trim();
      if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'https://' + url;
      }
      window.open(url, '_blank', 'noopener');
    },
    [addressValue],
  );

  const handleVisit = useCallback((url: string) => {
    window.open(url, '_blank', 'noopener');
  }, []);

  return (
    <div className="flex flex-col h-full" style={{ fontFamily: 'var(--font-system)' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '0 14px',
          height: '32px',
          background: 'var(--color-bg-titlebar)',
          backdropFilter: 'var(--glass-blur)',
          WebkitBackdropFilter: 'var(--glass-blur)',
          borderBottom: '0.5px solid var(--color-border)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
          <button
            type="button"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-tertiary)',
              fontSize: '14px',
              cursor: 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ‹
          </button>
          <button
            type="button"
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '4px',
              border: 'none',
              background: 'transparent',
              color: 'var(--color-text-tertiary)',
              fontSize: '14px',
              cursor: 'default',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ›
          </button>
        </div>

        <form onSubmit={handleAddressSubmit} style={{ flex: 1 }}>
          <div
            style={{
              position: 'relative',
              height: '28px',
              borderRadius: '8px',
              background: 'var(--color-bg-input)',
              border: addressFocused
                ? '1px solid var(--color-border-active)'
                : '1px solid transparent',
              transition: 'border-color 150ms',
              display: 'flex',
              alignItems: 'center',
              padding: '0 10px',
              gap: '6px',
            }}
          >
            <span style={{ fontSize: '11px', opacity: 0.45, flexShrink: 0 }}>🔒</span>
            <input
              ref={addressRef}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontSize: 'var(--text-md)',
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-system)',
              }}
              placeholder="Search or enter website name"
              value={addressValue}
              onChange={(e) => setAddressValue(e.target.value)}
              onFocus={(e) => {
                setAddressFocused(true);
                e.target.select();
              }}
              onBlur={() => setAddressFocused(false)}
            />
          </div>
        </form>
      </div>

      <div
        className="flex-1 overflow-y-auto"
        style={{
          padding: '40px 36px 48px',
          background: 'var(--color-bg-surface-solid)',
        }}
      >
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <h2 className="label-quiet" style={{ marginBottom: '22px', paddingLeft: '4px' }}>
            Favorites
          </h2>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(176px, 1fr))',
              gap: '10px',
            }}
          >
            {FAVORITES.map((site) => (
              <button
                key={site.url}
                type="button"
                onClick={() => handleVisit(site.url)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '10px',
                  padding: '16px 16px 14px',
                  borderRadius: 'var(--radius-control)',
                  border: '0.5px solid var(--color-border)',
                  background: 'var(--color-bg-hover)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'inherit',
                  fontFamily: 'inherit',
                  transition: 'border-color 140ms ease, background 140ms ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border-active)';
                  e.currentTarget.style.background = 'var(--color-bg-active)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--color-border)';
                  e.currentTarget.style.background = 'var(--color-bg-hover)';
                }}
              >
                <div
                  aria-hidden
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    background: 'var(--color-bg-input)',
                    border: '0.5px solid var(--color-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-text-primary)',
                    fontSize: 'var(--text-md)',
                    fontWeight: 'var(--weight-medium)',
                    letterSpacing: 'var(--tracking-snug)',
                  }}
                >
                  {site.name.slice(0, 1)}
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'var(--weight-medium)',
                      letterSpacing: 'var(--tracking-snug)',
                      color: 'var(--color-text-primary)',
                      marginBottom: '3px',
                    }}
                  >
                    {site.name}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-tertiary)',
                      lineHeight: 1.4,
                    }}
                  >
                    {hostname(site.url)}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--text-xs)',
                      color: 'var(--color-text-secondary)',
                      lineHeight: 1.4,
                      marginTop: '6px',
                    }}
                  >
                    {site.note}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
