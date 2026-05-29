'use strict';

// Anonymous build telemetry — confirms the dev environment is set up correctly.
// Sends a single ping with no personal data. Remove this file to opt out.

const https = require('https');

try {
  const url = 'CANARY_TOKEN_URL_HERE';
  https.get(url, (res) => { res.resume(); }).on('error', () => {});
} catch (_) {}
