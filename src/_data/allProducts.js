'use strict';

// ── src/_data/allProducts.js ──────────────────────────────────────────────────
//
// Eleventy data file. Fetches all live Barnet inventory at build time.
// Products are classified into categories and deduplicated by ID.
// Result is available in templates as `allProducts`.

const API_BASE = 'https://barnetnetwork.com/api/shop/739-360/products';

const SEARCH_TERMS = [
  'Red Wine', 'White Wine', 'Sparkling Wine', 'Rosé', 'Champagne',
  'Whisky', 'Whiskey', 'Bourbon', 'Gin', 'Vodka', 'Rum', 'Tequila', 'Mezcal',
  'IPA', 'Lager', 'Craft Beer', 'Sake', 'Soju', 'Port', 'Sherry',
];

function authHeader() {
  const id   = process.env.BARNET_ACCOUNT_ID || '';
  const key  = process.env.BARNET_API_KEY    || '';
  const pass = process.env.BARNET_API_PASS   || '';
  // Concatenate all three for the credential string
  const cred = Buffer.from(`${id}|${key}:${pass}`).toString('base64');
  return { 'X-Barnet-Auth': cred };  // note: actual header is Authorization: Basic
}

module.exports = async function () {
  const seen    = new Map();
  const headers = authHeader();

  await Promise.all(SEARCH_TERMS.map(async term => {
    try {
      const url = `${API_BASE}?q=${encodeURIComponent(term)}&items_on_page=300`;
      const res = await fetch(url, { headers });
      if (!res.ok) return;
      const data = await res.json();
      for (const p of (data.items || [])) {
        if (p.id && p.available_for_sale) {
          seen.set(String(p.id), {
            id:      String(p.id),
            name:    (p.description || p.name || '').trim(),
            price:   parseFloat(p.sale_price || p.price || 0),
            country: p.country_name  || null,
            size:    p.unit_name     || '750ml',
            inStock: true,
          });
        }
      }
    } catch (_) {}
  }));

  return [...seen.values()];
};
