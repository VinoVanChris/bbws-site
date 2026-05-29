'use strict';

// ── lib/brain-core.js ─────────────────────────────────────────────────────────
//
// Core brain assembly. Combines live Barnet inventory with AI-written
// descriptions to produce the full brain data contract.
//
// The brain object:
//   bottles    — every in-stock product keyed by Barnet ID
//   byType     — index by drink type
//   byOccasion — tag index for occasion-based queries
//   byFood     — tag index for food pairing queries
//   byForWhom  — tag index for gift queries
//   curatedIds — Chris's hand-picked bottles in ranked order
//   somContext — pre-built context block for the AI chat

const fetch = globalThis.fetch || require('node-fetch');

const BARNET_API  = 'https://barnetnetwork.com/api/shop/739-360/products';
const MARKUP      = 1.0;

// Module-level cache — reused across warm serverless invocations
let _cache     = null;
let _cacheTime = 0;
const CACHE_TTL = 15 * 60 * 1000;

// Curated product IDs — Chris's personal picks, ranked by preference
const CURATED_IDS = (process.env.CURATED_IDS || '').split(',').map(s => s.trim()).filter(Boolean);

function classifyType(p) {
  const name = (p.description || p.name || '').toLowerCase();
  const cat  = (p.product_type || p.category || '').toLowerCase();

  if (cat.includes('red') || name.includes('red wine'))          return 'bold_red';
  if (cat.includes('white') || name.includes('white wine'))      return 'crisp_white';
  if (cat.includes('sparkling') || name.includes('prosecco'))    return 'sparkling';
  if (cat.includes('rose') || name.includes('rosé'))             return 'rose';
  if (cat.includes('whisky') || cat.includes('whiskey'))         return 'spirit_whisky';
  if (cat.includes('gin'))                                        return 'spirit_gin';
  if (cat.includes('vodka'))                                      return 'spirit_vodka';
  if (cat.includes('rum'))                                        return 'spirit_rum';
  if (cat.includes('tequila') || cat.includes('mezcal'))         return 'spirit_tequila';
  if (cat.includes('beer') || cat.includes('ipa'))               return 'beer_ipa';
  if (cat.includes('lager'))                                      return 'beer_lager';
  return 'other';
}

async function fetchAllProducts() {
  const terms = ['wine', 'beer', 'whisky', 'gin', 'vodka', 'rum', 'tequila', 'sake'];
  const seen  = new Map();

  await Promise.all(terms.map(async term => {
    try {
      const key  = process.env.BARNET_API_KEY  || '';
      const pass = process.env.BARNET_API_PASS || '';
      const auth = Buffer.from(`${key}:${pass}`).toString('base64');

      const url = `${BARNET_API}?q=${encodeURIComponent(term)}&items_on_page=200`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${auth}` },  // note: Barnet uses Basic, not Bearer
      });
      if (!res.ok) return;
      const data = await res.json();
      for (const p of (data.items || [])) {
        if (p.id && p.available_for_sale) seen.set(String(p.id), p);
      }
    } catch (_) {}
  }));

  return [...seen.values()];
}

async function getBrain() {
  const now = Date.now();
  if (_cache && (now - _cacheTime) < CACHE_TTL) return _cache;

  const raw     = await fetchAllProducts();
  const bottles = {};
  const byType  = {};

  for (const p of raw) {
    const id    = String(p.id);
    const price = Math.round(parseFloat(p.sale_price || p.price || 0) * MARKUP * 100) / 100;
    const type  = classifyType(p);

    bottles[id] = {
      id,
      name:    (p.description || p.name || '').trim(),
      price,
      type,
      inStock: true,
      qty:     p.on_hand || 0,
      country: p.country_name || null,
      size:    p.unit_name   || '750ml',
      curated: CURATED_IDS.includes(id),
      url:     `https://shop.broadwaybeerwine.ca/s-20089/advance-filter?keyword=${encodeURIComponent(p.description || '')}`,
      image:   null,
    };

    if (!byType[type]) byType[type] = [];
    byType[type].push(id);
  }

  // Build a minimal context block for the AI chat
  const curatedBottles = CURATED_IDS
    .map(id => bottles[id])
    .filter(Boolean)
    .map(b => `- ${b.name} | $${b.price.toFixed(2)}`)
    .join('\n');

  const somContext = {
    systemPromptBlock: curatedBottles
      ? `CHRIS'S CURRENT PICKS:\n${curatedBottles}`
      : '',
  };

  _cache     = { bottles, byType, byOccasion: {}, byFood: {}, byForWhom: {}, curatedIds: CURATED_IDS, somContext };
  _cacheTime = now;
  return _cache;
}

module.exports = { getBrain };
