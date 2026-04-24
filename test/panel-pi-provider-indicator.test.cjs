const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('Pi provider uses jiaoleaf-provider--pi CSS class', () => {
  const panelPath = path.join(__dirname, '..', 'src', 'iso', 'panel', 'Panel.tsx');
  const contents = fs.readFileSync(panelPath, 'utf8');

  assert.match(
    contents,
    /jiaoleaf-provider--pi/,
    'Panel should use jiaoleaf-provider--pi CSS class for pi provider'
  );
});

test('Pi provider indicator CSS exists in panel.css', () => {
  const cssPath = path.join(__dirname, '..', 'src', 'iso', 'panel', 'panel.css');
  const contents = fs.readFileSync(cssPath, 'utf8');

  assert.match(
    contents,
    /\.jiaoleaf-provider--pi\s+\.jiaoleaf-provider__dot/,
    'panel.css should define .jiaoleaf-provider--pi .jiaoleaf-provider__dot'
  );
  assert.match(
    contents,
    /jiaoleaf-provider-flash-pi/,
    'panel.css should define pi flash animation'
  );
});

test('PROVIDER_DISPLAY includes pi with BYOK label', () => {
  const panelPath = path.join(__dirname, '..', 'src', 'iso', 'panel', 'Panel.tsx');
  const contents = fs.readFileSync(panelPath, 'utf8');

  assert.match(
    contents,
    /pi:\s*\{\s*label:\s*['"]BYOK['"]\s*\}/,
    'PROVIDER_DISPLAY should include pi with BYOK label'
  );
});
