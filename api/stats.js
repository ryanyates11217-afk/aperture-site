// Lets you check the current visit count by visiting:
//   https://your-site.vercel.app/api/stats?key=YOUR_ADMIN_KEY
// The key must match the ADMIN_KEY environment variable you set in Vercel,
// so random visitors can't see or reset your count.

import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export default async function handler(req, res) {
  const providedKey = req.query.key;

  if (!process.env.ADMIN_KEY || providedKey !== process.env.ADMIN_KEY) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const count = (await redis.get('visit_count')) || 0;
    return res.status(200).json({ visits: count });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
