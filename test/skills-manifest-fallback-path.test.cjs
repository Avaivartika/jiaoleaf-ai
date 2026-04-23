const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('skills registry resolves root and extension-prefixed asset paths', () => {
  const target = path.join(
    __dirname,
    '..',
    'src',
    'iso',
    'panel',
    'skills',
    'skillsRegistry.ts'
  );
  const contents = fs.readFileSync(target, 'utf8');

  assert.match(contents, /resolveAssetCandidates/);
  assert.match(contents, /extension\/\$\{normalized\}/);
  assert.match(contents, /fetchFirstAvailable\(resolveAssetCandidates\('skills\/manifest\.json'\)\)/);
  assert.match(contents, /fetchFirstAvailable\(resolveAssetCandidates\(skill\.path\)\)/);
});
