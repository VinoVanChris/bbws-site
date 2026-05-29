'use strict';

// ── lib/ai-models.js ──────────────────────────────────────────────────────────
// Centralised model constants. Update here to change models site-wide.

// Intent parsing — fast, cheap model for structured JSON extraction
const CHAT_INTENT_MODEL = 'claude-3-haiku-20240307';

// Response generation — same model for consistency
// (Sonnet is overkill for a retail chat use case)
const CHAT_RESPONSE_MODEL = 'claude-3-haiku-20240307';

// Description generation — used by scripts/generate-descriptions.js
const DESCRIPTION_MODEL = 'claude-3-haiku-20240307';

module.exports = { CHAT_INTENT_MODEL, CHAT_RESPONSE_MODEL, DESCRIPTION_MODEL };
