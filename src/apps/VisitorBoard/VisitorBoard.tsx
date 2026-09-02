import { useEffect, useState } from 'react';

interface LeaderboardRow {
  session_id: string;
  ip_country: string | null;
  referrer: string | null;
  total_events: number;
  total_app_launches: number;
  total_seconds_active: number;
}

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8787';

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function flagEmoji(country: string | null) {
  if (!country || country.length !== 2) return '🌐';
  const base = 127397;
  return String.fromCodePoint(...[...country.toUpperCase()].map((c) => c.charCodeAt(0) + base));
}

export function VisitorBoard() {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/leaderboard`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const body = (await res.json()) as { leaderboard: LeaderboardRow[] };
        if (!cancelled) setRows(body.leaderboard ?? []);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'unknown error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div
      style={{
        padding: '18px 22px',
        fontFamily: 'var(--font-system)',
        color: 'var(--color-text-primary)',
        height: '100%',
        overflow: 'auto',
        background: 'var(--color-bg-surface-solid)',
      }}
    >
      <header style={{ marginBottom: 16 }}>
        <h2
          style={{
            margin: 0,
            fontSize: 17,
            fontWeight: 600,
            letterSpacing: '-0.02em',
          }}
        >
          Visitor Board
        </h2>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: 12,
            color: 'var(--color-text-secondary)',
          }}
        >
          Top sessions by time spent on this desktop.
        </p>
      </header>

      {loading && (
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>Loading visitors...</div>
      )}

      {error && (
        <div style={{ color: '#FF453A', fontSize: 13, lineHeight: 1.5 }}>
          Could not reach the visitor API ({error}).
          <div style={{ marginTop: 6, color: 'var(--color-text-tertiary)' }}>
            The board needs the local visitor server running. You can still tour the rest of the
            desktop.
          </div>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div style={{ color: 'var(--color-text-secondary)', fontSize: 13 }}>
          No visitors yet. Open Files or Browser while you wait.
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--color-text-tertiary)' }}>
              <th style={{ padding: '6px 8px', fontWeight: 600 }}>#</th>
              <th style={{ padding: '6px 8px', fontWeight: 600 }}>Session</th>
              <th style={{ padding: '6px 8px', fontWeight: 600 }}>From</th>
              <th style={{ padding: '6px 8px', fontWeight: 600 }}>Events</th>
              <th style={{ padding: '6px 8px', fontWeight: 600 }}>Active</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={r.session_id}
                style={{ borderTop: '0.5px solid var(--color-border)' }}
              >
                <td style={{ padding: '8px' }}>{i + 1}</td>
                <td
                  style={{
                    padding: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: 12,
                  }}
                >
                  {r.session_id}
                </td>
                <td style={{ padding: '8px' }}>
                  {flagEmoji(r.ip_country)} {r.ip_country ?? 'Unknown'}
                </td>
                <td style={{ padding: '8px' }}>{r.total_events}</td>
                <td style={{ padding: '8px' }}>{formatDuration(r.total_seconds_active)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
