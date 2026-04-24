const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('Runtime menus highlight selected option and thinking trigger uses accent color', () => {
  const panelPath = path.join(__dirname, '..', 'src', 'iso', 'panel', 'Panel.tsx');
  const panel = fs.readFileSync(panelPath, 'utf8');

  assert.match(panel, /jiaoleaf-runtime__option[\s\S]*is-selected/);
  assert.match(panel, /jiaoleaf-runtime__value--accent/);

  const cssPath = path.join(__dirname, '..', 'src', 'iso', 'panel', 'panel.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.match(css, /\.jiaoleaf-runtime__option\.is-selected\s*\{/);
  assert.match(css, /\.jiaoleaf-runtime__value--accent\s*\{/);
});
