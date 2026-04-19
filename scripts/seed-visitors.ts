/**
 * Seed 3 demo visitors into the rahulos Cloud SQL database.
 * Usage:
 *   ./scripts/db-proxy.sh   # in another terminal
 *   npx tsx scripts/seed-visitors.ts
 */
import { pool } from "./db";

const demoVisitors = [
  {
    session_id: "demo-session-tokyo",
    ip_country: "JP",
    user_agent: "Mozilla/5.0 (demo seed)",
    referrer: "https://rahul-mehta.me",
    total_events: 42,
    total_app_launches: 7,
    total_seconds_active: 680,
  },
  {
    session_id: "demo-session-berlin",
    ip_country: "DE",
    user_agent: "Mozilla/5.0 (demo seed)",
    referrer: "https://twitter.com/rahulmehta25",
    total_events: 18,
    total_app_launches: 3,
    total_seconds_active: 210,
  },
  {
    session_id: "demo-session-atlanta",
    ip_country: "US",
    user_agent: "Mozilla/5.0 (demo seed)",
    referrer: "https://news.ycombinator.com",
    total_events: 91,
    total_app_launches: 12,
    total_seconds_active: 1450,
  },
];

async function main() {
  let inserted = 0;
  for (const v of demoVisitors) {
    const res = await pool.query(
      `INSERT INTO visitors (session_id, ip_country, user_agent, referrer,
         total_events, total_app_launches, total_seconds_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (session_id) DO NOTHING
       RETURNING id`,
      [
        v.session_id,
        v.ip_country,
        v.user_agent,
        v.referrer,
        v.total_events,
        v.total_app_launches,
        v.total_seconds_active,
      ],
    );
    if (res.rowCount && res.rowCount > 0) inserted += 1;
  }
  console.log(`Seeded visitors (new: ${inserted}, total demo rows: ${demoVisitors.length}).`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
