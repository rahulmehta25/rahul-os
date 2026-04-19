/**
 * Tiny HTTP server that exposes the visitor leaderboard for the RahulOS client.
 *
 * Endpoints:
 *   GET  /leaderboard           — top 10 visitors by total_seconds_active
 *   POST /events                — { session_id, type, data? } upserts visitor and logs event
 *
 * Usage:
 *   ./scripts/db-proxy.sh   # in another terminal
 *   npx tsx scripts/serve-visitors.ts
 */
import { createServer, IncomingMessage, ServerResponse } from "node:http";
import { pool } from "./db";

const PORT = Number(process.env.VISITOR_API_PORT ?? 8787);

type Row = Record<string, unknown>;

async function getLeaderboard(): Promise<Row[]> {
  const { rows } = await pool.query(
    `SELECT session_id, ip_country, referrer, total_events, total_app_launches, total_seconds_active
     FROM visitors
     ORDER BY total_seconds_active DESC
     LIMIT 10`,
  );
  return rows;
}

async function recordEvent(body: {
  session_id: string;
  type: string;
  data?: Record<string, unknown>;
  ip_country?: string | null;
  user_agent?: string | null;
  referrer?: string | null;
}) {
  const { rows } = await pool.query(
    `INSERT INTO visitors (session_id, ip_country, user_agent, referrer)
     VALUES ($1,$2,$3,$4)
     ON CONFLICT (session_id) DO UPDATE
       SET last_seen_at = now(),
           total_events = visitors.total_events + 1
     RETURNING id`,
    [body.session_id, body.ip_country ?? null, body.user_agent ?? null, body.referrer ?? null],
  );
  const visitorId = rows[0].id;
  await pool.query(
    `INSERT INTO events (visitor_id, type, data) VALUES ($1,$2,$3::jsonb)`,
    [visitorId, body.type, JSON.stringify(body.data ?? {})],
  );
  return { visitor_id: visitorId };
}

const cors = (res: ServerResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "content-type");
};

async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });
}

const server = createServer(async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") return res.end();

  try {
    if (req.method === "GET" && req.url === "/leaderboard") {
      const rows = await getLeaderboard();
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify({ leaderboard: rows }));
    }
    if (req.method === "POST" && req.url === "/events") {
      const body = (await readJson(req)) as Parameters<typeof recordEvent>[0];
      const result = await recordEvent(body);
      res.setHeader("Content-Type", "application/json");
      return res.end(JSON.stringify(result));
    }
    res.statusCode = 404;
    res.end("not found");
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    res.end("internal error");
  }
});

server.listen(PORT, () => {
  console.log(`Visitor API listening on http://127.0.0.1:${PORT}`);
});
