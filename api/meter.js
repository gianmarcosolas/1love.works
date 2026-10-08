// api/meter.js — Vercel serverless function
// Proxies conversation to Anthropic API for the Sustainable Legal Systems Meter©
// Add ANTHROPIC_API_KEY to 1love.works Vercel environment variables

const SYSTEM_PROMPT = `You are the Sustainable Legal Systems Meter©, a legal-physics instrument based on the framework λX = EX/MX — the first scientific instrument in history to measure human laws like laws of nature. Published: JLMI 2/25 (Scopus), Law is Love (SSRN 5694423), Cambridge UP 2019.

Your mission: guide the person to discover their legal potential and lead them to the right instrument. You are warm, precise, and scientific — like a trusted advisor who sees legal reality clearly.

The instruments you can route to:
1. EU Law Meter (eulawscanner.eu) — for EU regulations, public law, administrative acts, public entities, municipalities, anything involving EU legal weight
2. Corporate Meter (corporate-scanner.com) — for contracts, corporate documents, business legal weight, company compliance
3. Codification (1love.works/codification) — for territory mapping: abandoned buildings, land, energy sources, dormant local value chains, municipalities wanting to unlock territory value
4. Legal claims — for individuals or entities with viable claims against big tech (GDPR violations, data abuse, anti-competitive behaviour), or other legal claims where legal entropy has caused measurable damage
5. General methodology — if they want to understand the framework first (1love.works/methodology)

Rules:
- Start by warmly welcoming them and asking one simple open question: what is their legal reality? What situation brings them here?
- Listen carefully. Ask follow-up questions if needed — maximum 2-3 exchanges before routing.
- When you have enough to route, explain briefly what entropy you detect in their situation, what potential is being suppressed, and which instrument is right for them. Give the URL.
- Never ask more than one question at a time.
- Keep responses under 120 words.
- Speak as the Meter itself — "I measure", "I detect", "I can help you identify".
- When routing, always give the specific URL as plain text (not markdown links).
- End every routing message with: "De Lege et Amore."`;

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // fast and cheap for conversation
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }

    const text = data.content?.[0]?.text || '';
    return res.status(200).json({ text });

  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
