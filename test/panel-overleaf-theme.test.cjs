const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('Panel auto-detects Overleaf editor themes', () => {
  const panelPath = path.join(__dirname, '..', 'src', 'iso', 'panel', 'Panel.tsx');
  const contents = fs.readFileSync(panelPath, 'utf8');

  assert.match(contents, /LIGHT_EDITOR_THEMES/);
  assert.match(contents, /DARK_EDITOR_THEMES/);
  assert.match(contents, /textmate/);
  assert.match(contents, /dracula/);
  assert.match(contents, /detectOverleafLightMode/);
  assert.match(contents, /MutationObserver/);
});

test('Panel includes Overleaf-integrated visual tokens', () => {
  const cssPath = path.join(__dirname, '..', 'src', 'iso', 'panel', 'ageaf-toolbar-components.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.match(css, /OVERLEAF-INTEGRATED THEME/);
  assert.match(css, /--ageaf-panel-bg:\s*#f7f8fa/);
  assert.match(css, /--ageaf-panel-accent:\s*#138a43/);
  assert.match(css, /background:\s*#17212b/);
  assert.match(css, /background:\s*#2d3a48/);
  assert.match(css, /\.ageaf-toolbar-strip/);
  assert.match(css, /\.ageaf-skill-menu__list/);
  assert.match(css, /\.ageaf-panel__name/);
  assert.match(css, /text-transform:\s*none/);
});

test('Panel exposes skills through a menu and settings page', () => {
  const panelPath = path.join(__dirname, '..', 'src', 'iso', 'panel', 'Panel.tsx');
  const contents = fs.readFileSync(panelPath, 'utf8');

  assert.match(contents, /enabledSkills/);
  assert.match(contents, /ageaf-skill-menu/);
  assert.match(contents, /settingsTab === 'skills'/);
  assert.match(contents, /customSkillDraft/);
  assert.doesNotMatch(contents, /featuredSkills/);
  assert.doesNotMatch(contents, /ageaf-skill-rail/);
  assert.match(contents, /literature-review/);
  assert.match(contents, /statistical-analysis/);
  assert.match(contents, /data-visualization/);
});
