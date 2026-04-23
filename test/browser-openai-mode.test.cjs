const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('browser-direct OpenAI mode is wired through settings, transport, and manifest', () => {
  const root = path.join(__dirname, '..');
  const panel = fs.readFileSync(path.join(root, 'src', 'iso', 'panel', 'Panel.tsx'), 'utf8');
  const transport = fs.readFileSync(path.join(root, 'src', 'iso', 'messaging', 'transport.ts'), 'utf8');
  const browserTransportPath = path.join(root, 'src', 'iso', 'messaging', 'browserOpenAITransport.ts');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public', 'manifest.json'), 'utf8'));

  assert.match(panel, /Browser direct mode/);
  assert.match(panel, /ageaf-openai-api-key/);
  assert.match(panel, /ageaf-openai-base-url/);
  assert.match(transport, /browserOpenAITransport/);
  assert.ok(fs.existsSync(browserTransportPath));
  assert.deepEqual(manifest.host_permissions, ['https://api.openai.com/*']);
});

test('release packer creates a single root-loadable bundle instead of a build-only zip', () => {
  const root = path.join(__dirname, '..');
  const pack = fs.readFileSync(path.join(root, 'pack.js'), 'utf8');
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

  assert.match(pack, /zip\.addLocalFile\('manifest\.json'\)/);
  assert.match(pack, /addFolder\(zip, 'extension', 'extension'\)/);
  assert.match(pack, /addFolder\(zip, 'host', 'host'\)/);
  assert.match(pack, /host\/package\.json/);
  assert.match(packageJson.scripts.pack, /sync:source-installable/);
});
