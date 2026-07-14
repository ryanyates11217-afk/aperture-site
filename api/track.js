// Increments a simple visit counter every time the site loads.
// Uses Vercel KV (a small Redis-backed store) so the count persists
// across requests, since serverless functions don't keep memory between calls.

import { kv } from '@vercel/kv';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const count = await kv.incr('visit_count');
    return res.status(200).json({ ok: true, visits: count });
  } catch (err) {
    console.error(err);
    // Fail silently from the visitor's perspective — a missed count
    // shouldn't ever break the site itself.
    return res.status(200).json({ ok: false });
  }
}
