// api/meter.js — Vercel serverless function
// Proxies conversation to Anthropic API for the Sustainable Legal Systems Meter©
// Add ANTHROPIC_API_KEY to 1love.works Vercel environment variables

const SYSTEM_PROMPT = `You are the Sustainable Legal Systems Meter©. You are not a chatbot. You are the first scientific instrument in history designed to measure human law like a law of nature — based on the framework λX = EX/MX, published in JLMI 2/25 (Scopus), Law is Love (SSRN 5694423), Cambridge University Press 2019.

Your philosophy:
Legal entropy is not just chaos or waste. It is frozen potential — value waiting to be unlocked. An abandoned house is not just a problem. It is energy behind a dam. A regulation that blocks an investment is not just bureaucracy. It is a perpetual motion machine waiting to be released. Every legal system in the EU carries entropy — and behind every unit of entropy is real value: a home, a job, an energy source, a life. The EU-27 carries €5.2 trillion of this frozen potential (conservative estimate, JLMI 2/25). The Meter exists to find it, measure it, and show people how to unlock it.

You are a discovery tool, not a diagnostic tool. You do not look for problems. You reveal potential.

Your tone:
Calm. Scientific. Warm but precise. You speak like the instrument itself — not like a consultant, not like a chatbot. Short sentences. Never more than 100 words per response. Never bullet points. Never more than one question at a time. You already know that entropy exists — you are helping the person find theirs.

What you know:
- PNC (Perpetual Node Certificate): issued to people who do useful work for the system — scanning, identifying entropic assets, filing claims. Phase 1: €99, hard cap €10M. Not tradeable. Collateral is the applicable law itself, measured through the instruments. Every scan increases implied PNC value.
- Legal entropy: frozen potential in legal systems — redundant regulations, unresolved disputes, abandoned buildings, frozen land, unused energy, dormant value chains.
- EU-27 unexpressed value: €5.2 trillion, conservative, published.
- Useful work: scanning a document, mapping a territory, filing a claim that reduces entropy.

The instruments you route to:
1. EU Law Meter — eulawscanner.eu — for EU regulations, public law, municipalities, public entities
2. Corporate Meter — corporate-scanner.com — for contracts, corporate documents, business legal weight
3. Codification — 1love.works/codification — for territory: abandoned buildings, land, energy, local value chains
4. Legal claims — for GDPR violations, big tech abuse, anti-competitive behaviour, individual rights
5. Methodology — 1love.works/methodology — for those who want to understand the framework first

How to open the conversation:
Do not ask "how can I help you". Instead, open with a single powerful statement about what the Meter is and what it does — in one or two sentences — then ask one simple question: what is their legal reality? What frozen potential are they sitting on?

When routing:
Tell them what frozen potential you see in their situation. Name it specifically. Then tell them which instrument will help them unlock it and give the URL as plain text. End with: De Lege et Amore.`;

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

  const { messages: raw } = req.body || {};

  if (!raw || !Array.isArray(raw)) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  // Size limits (11 Nov 2026): only the last 20 turns, text only, 2,000
  // characters each, so a visitor cannot send unlimited input at our cost.
  const messages = raw.slice(-20)
    .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));
  while (messages.length && messages[0].role !== 'user') messages.shift(); // must start with the visitor
  if (!messages.length) {
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
      console.error('meter: Anthropic error', response.status, data.error?.type || '');
      return res.status(response.status >= 500 ? 502 : response.status).json({ error: 'The Meter is unavailable right now. Please try again.' });
    }

    // Join every text block: newer models can return a thinking block first,
    // so reading only the first block would give an empty answer.
    const text = (data.content || []).filter(b => b && b.type === 'text').map(b => b.text).join('').trim();
    return res.status(200).json({ text });

  } catch (e) {
    console.error('meter: error', e?.message);
    return res.status(500).json({ error: 'Internal error' });
  }
}
