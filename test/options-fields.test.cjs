const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('Settings modal includes JiaoLeaf host and Claude fields', () => {
  const panelPath = path.join(__dirname, '..', 'src', 'iso', 'panel', 'Panel.tsx');
  const contents = fs.readFileSync(panelPath, 'utf8');

  assert.match(contents, /jiaoleaf-transport-mode/);
  assert.match(contents, /jiaoleaf-host-url/);
  assert.doesNotMatch(contents, /jiaoleaf-pairing-token/);
  assert.doesNotMatch(contents, /jiaoleaf-claude-cli/);
  assert.doesNotMatch(contents, /jiaoleaf-claude-env/);
  assert.match(contents, /Anthropic/);
  assert.match(contents, /OpenAI/);
  assert.doesNotMatch(contents, /jiaoleaf-codex-cli/);
  assert.doesNotMatch(contents, /jiaoleaf-openai-env/);
  assert.doesNotMatch(contents, /jiaoleaf-claude-session-scope/);
});
