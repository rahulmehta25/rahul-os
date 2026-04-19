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
        padding: '16px 20px',
        fontFamily: 'var(--font-sans)',
        color: 'var(--color-fg, #222)',
        height: '100%',
        overflow: 'auto',
      }}
    >
      <header style={{ marginBottom: 14 }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>Visitor leaderboard</h2>
        <p style={{ margin: '4px 0 0', fontSize: 12, opacity: 0.7 }}>
          Top 10 sessions by active time, read live from the rahulos Cloud SQL database.
        </p>
      </header>

      {loading && <div style={{ opacity: 0.7 }}>Loading…</div>}

      {error && (
        <div style={{ color: '#c53030', fontSize: 13 }}>
          Couldn't reach <code>{API_BASE}/leaderboard</code> — {error}.
          <div style={{ marginTop: 6, opacity: 0.75 }}>
            Start the API with <code>npx tsx scripts/serve-visitors.ts</code> after running
            <code> scripts/db-proxy.sh</code>.
          </div>
        </div>
      )}

      {!loading && !error && rows.length === 0 && (
        <div style={{ opacity: 0.7 }}>
          No visitors yet. Run <code>npx tsx scripts/seed-visitors.ts</code> to seed demo rows.
        </div>
      )}

      {!loading && !error && rows.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ textAlign: 'left', opacity: 0.7 }}>
              <th style={{ padding: '6px 8px' }}>#</th>
              <th style={{ padding: '6px 8px' }}>Session</th>
              <th style={{ padding: '6px 8px' }}>From</th>
              <th style={{ padding: '6px 8px' }}>Events</th>
              <th style={{ padding: '6px 8px' }}>Active</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.session_id} style={{ borderTop: '1px solid rgba(0,0,0,0.08)' }}>
                <td style={{ padding: '6px 8px' }}>{i + 1}</td>
                <td style={{ padding: '6px 8px', fontFamily: 'var(--font-mono, monospace)' }}>
                  {r.session_id}
                </td>
                <td style={{ padding: '6px 8px' }}>
                  {flagEmoji(r.ip_country)} {r.ip_country ?? '—'}
                </td>
                <td style={{ padding: '6px 8px' }}>{r.total_events}</td>
                <td style={{ padding: '6px 8px' }}>
                  {formatDuration(r.total_seconds_active)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
