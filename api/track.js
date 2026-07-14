// Increments a simple visit counter every time the site loads.
// Uses Vercel KV (a small Redis-backed store) so the count persists
// across requests, since serverless functions don't keep memory between calls.

import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const count = await redis.incr('visit_count');
    return res.status(200).json({ ok: true, visits: count });
  } catch (err) {
    console.error(err);
    return res.status(200).json({ ok: false });
  }
}
