const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('Content script injects JiaoLeaf layout wrapper', () => {
  const contentScriptPath = path.join(__dirname, '..', 'src', 'iso', 'contentScript.ts');
  const contents = fs.readFileSync(contentScriptPath, 'utf8');

  assert.match(contents, /jiaoleaf-layout/);
  assert.match(contents, /jiaoleaf-layout__main/);
});

test('Content script has an overlay fallback when no layout host is found', () => {
  const contentScriptPath = path.join(__dirname, '..', 'src', 'iso', 'contentScript.ts');
  const cssPath = path.join(__dirname, '..', 'src', 'iso', 'panel', 'panel.css');
  const contentScript = fs.readFileSync(contentScriptPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.match(contentScript, /\.ide/);
  assert.match(contentScript, /\[ng-view\]/);
  assert.match(contentScript, /jiaoleaf-layout--overlay/);
  assert.match(contentScript, /const useOverlay = !host\?\.parentElement/);
  assert.match(css, /\.jiaoleaf-layout--overlay/);
  assert.match(css, /position:\s*fixed/);
});

test('SJTU layout uses fixed sidecar mode and reserves room for the PDF viewer', () => {
  const contentScriptPath = path.join(__dirname, '..', 'src', 'iso', 'contentScript.ts');
  const cssPath = path.join(__dirname, '..', 'src', 'iso', 'panel', 'panel.css');
  const contentScript = fs.readFileSync(contentScriptPath, 'utf8');
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.match(contentScript, /latex\.sjtu\.edu\.cn/);
  assert.match(contentScript, /latex-en\.sjtu\.edu\.cn/);
  assert.match(contentScript, /jiaoleaf-layout--sidecar/);
  assert.match(contentScript, /appendChild\(layout\)/);
  assert.match(contentScript, /jiaoleaf-sidecar-host/);
  assert.match(contentScript, /ResizeObserver/);
  assert.match(contentScript, /--jiaoleaf-sidecar-width/);
  assert.match(css, /\.jiaoleaf-layout--sidecar/);
  assert.match(css, /\.jiaoleaf-sidecar-host/);
  assert.match(css, /right:\s*var\(--jiaoleaf-sidecar-width/);
});
