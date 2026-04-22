const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('Manifest names the extension for JiaoLeaf AI use', () => {
  const manifestPath = path.join(__dirname, '..', 'public', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

  assert.equal(manifest.name, 'JiaoLeaf AI');
  assert.equal(manifest.action.default_title, 'JiaoLeaf AI');
  assert.match(manifest.description, /AI assistant/);
  assert.match(manifest.description, /SJTU Overleaf/);
});
