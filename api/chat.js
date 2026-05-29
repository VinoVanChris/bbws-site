'use strict';

// api/chat.js — Ask Chris AI chat
// Vercel serverless function. Requires ANTHROPIC_API_KEY env var.

const Anthropic = require('@anthropic-ai/sdk');

const SYSTEM_PROMPT = `You are Chris, the owner of Broadway Beer Wine & Spirits, a bottle shop at 2752 W Broadway in Kitsilano, Vancouver. The shop has been open since 1986.

You speak warmly and casually, like chatting with a friend. You know wine, beer and spirits extremely well — especially BC wines, natural wines, and craft beer. You're not a snob about it.

Keep your answers short and conversational unless the customer asks for more. Two or three sentences is usually right. If you're recommending something, say what it tastes like and why you like it personally.

Store info:
- Hours: Monday to Sunday, 10am to 11pm
- Address: 2752 W Broadway, Vancouver BC
- Phone: 604-734-8543
- Email: hello@broadwaybeerwine.ca

If someone asks what's in stock, tell them the best way is to call the store or pop in — inventory changes daily. You can suggest categories and styles with confidence.

Don't mention competitors. Keep it positive.`;

const BARNET_API = 'https://barnetnetwork.com/api/shop/739-360/products';

async function getStock(query) {
  try {
    const url = `${BARNET_API}?q=${encodeURIComponent(query)}&items_on_page=10`;
    const res  = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    return (data.items || []).filter(p => p.available_for_sale).slice(0, 6);
  } catch (_) {
    return [];
  }
}

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST')   return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(503).json({ error: 'Chat unavailable.' });
  }

  const { message, history = [] } = req.body || {};
  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'Message is required.' });
  }

  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const words   = message.toLowerCase().split(/\s+/);
  const stockQ  = words.find(w => w.length > 4) || '';
  const stock   = stockQ ? await getStock(stockQ) : [];

  let system = SYSTEM_PROMPT;
  if (stock.length) {
    const lines = stock.map(p =>
      `- ${p.description} | $${parseFloat(p.sale_price).toFixed(2)}`
    );
    system += `\n\nCURRENT STOCK (matched your query):\n${lines.join('\n')}`;
  }

  try {
    const response = await client.messages.create({
      model:      'claude-3-haiku-20240307',
      max_tokens: 500,
      system,
      messages: [
        ...(history || []).slice(-6).map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: message.trim() },
      ],
    });

    return res.status(200).json({ message: response.content[0].text });
  } catch (err) {
    console.error('[chat] error:', err.message);
    return res.status(500).json({ error: 'Something went sideways. Try again.' });
  }
};
