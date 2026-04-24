const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('ISO content script exposes JiaoLeaf editor bridge', () => {
  const scriptPath = path.join(
    __dirname,
    '..',
    'src',
    'iso',
    'contentScript.ts'
  );
  const contents = fs.readFileSync(scriptPath, 'utf8');

  assert.match(contents, /jiaoleafBridge/);
  assert.match(contents, /jiaoleaf:editor:request/);
  assert.match(contents, /jiaoleaf:editor:response/);
  assert.match(contents, /jiaoleaf:editor:replace/);
  assert.match(contents, /jiaoleaf:editor:insert/);
});
