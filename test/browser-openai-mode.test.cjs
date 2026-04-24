const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('browser-direct OpenAI mode remains available as an explicit API fallback', () => {
  const root = path.join(__dirname, '..');
  const panel = fs.readFileSync(path.join(root, 'src', 'iso', 'panel', 'Panel.tsx'), 'utf8');
  const transport = fs.readFileSync(path.join(root, 'src', 'iso', 'messaging', 'transport.ts'), 'utf8');
  const browserTransportPath = path.join(root, 'src', 'iso', 'messaging', 'browserOpenAITransport.ts');
  const manifest = JSON.parse(fs.readFileSync(path.join(root, 'public', 'manifest.json'), 'utf8'));

  assert.match(panel, /Use OpenAI API directly instead of local Codex CLI/);
  assert.match(panel, /jiaoleaf-openai-api-key/);
  assert.match(panel, /jiaoleaf-openai-base-url/);
  assert.match(transport, /browserOpenAITransport/);
  assert.ok(fs.existsSync(browserTransportPath));
  assert.deepEqual(manifest.host_permissions, ['https://api.openai.com/*']);
});

test('local Codex CLI is the default OpenAI path', () => {
  const root = path.join(__dirname, '..');
  const helper = fs.readFileSync(path.join(root, 'src', 'utils', 'helper.ts'), 'utf8');
  const panel = fs.readFileSync(path.join(root, 'src', 'iso', 'panel', 'Panel.tsx'), 'utf8');
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');

  assert.match(helper, /openaiBrowserMode\s*===\s*undefined\)\s*options\.openaiBrowserMode\s*=\s*false/);
  assert.match(panel, /local Codex CLI through the/);
  assert.match(readme, /local Codex CLI by default/i);
  assert.match(readme, /does not require an OpenAI API key/i);
});

test('release packer creates a single root-loadable bundle instead of a build-only zip', () => {
  const root = path.join(__dirname, '..');
  const pack = fs.readFileSync(path.join(root, 'pack.js'), 'utf8');
  const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

  assert.match(pack, /zip\.addLocalFile\('manifest\.json'\)/);
  assert.match(pack, /addFolder\(zip, 'extension', 'extension'\)/);
  assert.match(pack, /addFolder\(zip, 'host', 'host'\)/);
  assert.match(pack, /start-jiaoleaf-host\.cmd/);
  assert.match(pack, /login-codex\.cmd/);
  assert.match(pack, /host\/package\.json/);
  assert.match(packageJson.scripts.pack, /sync:source-installable/);
});
