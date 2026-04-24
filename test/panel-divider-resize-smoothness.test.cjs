const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('Resizing disables width transition for smooth drag', () => {
  const cssPath = path.join(__dirname, '..', 'src', 'iso', 'panel', 'panel.css');
  const contents = fs.readFileSync(cssPath, 'utf8');

  assert.match(
    contents,
    /\.jiaoleaf-resizing\s+\.jiaoleaf-panel\s*{[\s\S]*transition:\s*none/,
    'panel should disable transition while dragging to avoid lag'
  );
});

