const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('native transport falls back to http when native host is missing', () => {
  const target = path.join(__dirname, '..', 'src', 'iso', 'messaging', 'transport.ts');
  const contents = fs.readFileSync(target, 'utf8');

  assert.match(contents, /isMissingNativeHostError/);
  assert.match(contents, /new Proxy\(native/);
  assert.match(contents, /native messaging host not found/i);
  assert.match(contents, /specified native messaging host not found/i);
  assert.match(contents, /error when communicating with the native messaging host/i);
  assert.match(contents, /fallback/);
});
