const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('Content script injects Ageaf layout wrapper', () => {
  const contentScriptPath = path.join(__dirname, '..', 'src', 'iso', 'contentScript.ts');
  const contents = fs.readFileSync(contentScriptPath, 'utf8');

  assert.match(contents, /ageaf-layout/);
  assert.match(contents, /ageaf-layout__main/);
});

test('Content script has an overlay fallback when no layout host is found', () => {
  const contentScriptPath = path.join(__dirname, '..', 'src', 'iso', 'contentScript.ts');
  const cssPath = path.join(__dirname, '..', 'src', 'iso', 'panel', 'panel.css');
  const contentScript = fs.readFileSync(contentScriptPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.match(contentScript, /\.ide/);
  assert.match(contentScript, /\[ng-view\]/);
  assert.match(contentScript, /ageaf-layout--overlay/);
  assert.match(contentScript, /const useOverlay = !host\?\.parentElement/);
  assert.match(css, /\.ageaf-layout--overlay/);
  assert.match(css, /position:\s*fixed/);
});

test('SJTU layout uses fixed sidecar mode and reserves room for the PDF viewer', () => {
  const contentScriptPath = path.join(__dirname, '..', 'src', 'iso', 'contentScript.ts');
  const cssPath = path.join(__dirname, '..', 'src', 'iso', 'panel', 'panel.css');
  const contentScript = fs.readFileSync(contentScriptPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.match(contentScript, /latex\.sjtu\.edu\.cn/);
  assert.match(contentScript, /latex-en\.sjtu\.edu\.cn/);
  assert.match(contentScript, /ageaf-layout--sidecar/);
  assert.match(contentScript, /appendChild\(layout\)/);
  assert.match(contentScript, /ageaf-sidecar-host/);
  assert.match(contentScript, /ResizeObserver/);
  assert.match(contentScript, /--ageaf-sidecar-width/);
  assert.match(css, /\.ageaf-layout--sidecar/);
  assert.match(css, /\.ageaf-sidecar-host/);
  assert.match(css, /right:\s*var\(--ageaf-sidecar-width/);
});
