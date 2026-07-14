// This runs on Vercel's server, never in the visitor's browser.
// Your ANTHROPIC_API_KEY stays here and is never sent to the client.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic, persona } = req.body || {};

  if (!topic || !persona) {
    return res.status(400).json({ error: 'Missing topic or persona' });
  }

  const systemPrompt = `You explain topics to a specific audience with a specific level of background. Explain the given topic to ${persona} Keep it under 180 words. Do not mention that you are an AI or reference this system. Do not use markdown formatting.`;

  const keyPreview = (process.env.ANTHROPIC_API_KEY || '').slice(0, 12);
  const keyLength = (process.env.ANTHROPIC_API_KEY || '').length;
  console.log('DEBUG key check — length:', keyLength, 'starts with:', keyPreview);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: 'user', content: `Explain this: ${topic}` }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', errText);
      return res.status(502).json({ error: 'Upstream API error' });
    }

    const data = await response.json();
    const textBlock = (data.content || []).find((b) => b.type === 'text');
    const explanation = textBlock ? textBlock.text : null;

    return res.status(200).json({ explanation });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Server error' });
  }
}
