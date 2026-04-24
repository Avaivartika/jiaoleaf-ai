import assert from 'node:assert/strict';
import test from 'node:test';

import { extractJiaoLeafPatchFence, extractAllJiaoLeafPatchFences } from '../src/patch/jiaoleafPatchFence.js';
import { validatePatch } from '../src/validate.js';

test('extractJiaoLeafPatchFence finds jiaoleaf-patch fenced JSON', () => {
  const output = [
    'Proposed change:',
    '',
    '```jiaoleaf-patch',
    '{"kind":"replaceRangeInFile","filePath":"main.tex","expectedOldText":"old","text":"new"}',
    '```',
    '',
    'Notes: updated wording.',
  ].join('\n');

  const fence = extractJiaoLeafPatchFence(output);
  assert.equal(
    fence,
    '{"kind":"replaceRangeInFile","filePath":"main.tex","expectedOldText":"old","text":"new"}'
  );
  assert.deepEqual(validatePatch(JSON.parse(fence)), {
    kind: 'replaceRangeInFile',
    filePath: 'main.tex',
    expectedOldText: 'old',
    text: 'new',
  });
});

test('extractAllJiaoLeafPatchFences returns all patch blocks', () => {
  const output = [
    'Patch 1/3:',
    '',
    '```jiaoleaf-patch',
    '{"kind":"replaceRangeInFile","filePath":"refs.bib","expectedOldText":"old1","text":"new1"}',
    '```',
    '',
    'Patch 2/3:',
    '',
    '```jiaoleaf-patch',
    '{"kind":"replaceRangeInFile","filePath":"refs.bib","expectedOldText":"old2","text":"new2"}',
    '```',
    '',
    'Patch 3/3:',
    '',
    '```jiaoleaf-patch',
    '{"kind":"replaceRangeInFile","filePath":"main.tex","expectedOldText":"old3","text":"new3"}',
    '```',
  ].join('\n');

  const fences = extractAllJiaoLeafPatchFences(output);
  assert.equal(fences.length, 3);
  assert.deepEqual(validatePatch(JSON.parse(fences[0])), {
    kind: 'replaceRangeInFile',
    filePath: 'refs.bib',
    expectedOldText: 'old1',
    text: 'new1',
  });
  assert.deepEqual(validatePatch(JSON.parse(fences[2])), {
    kind: 'replaceRangeInFile',
    filePath: 'main.tex',
    expectedOldText: 'old3',
    text: 'new3',
  });
});

test('extractAllJiaoLeafPatchFences returns empty array when no patches', () => {
  assert.deepEqual(extractAllJiaoLeafPatchFences('no patches here'), []);
});

test('extractAllJiaoLeafPatchFences returns single-element array for one patch', () => {
  const output = '```jiaoleaf-patch\n{"kind":"replaceSelection","text":"hello"}\n```';
  const fences = extractAllJiaoLeafPatchFences(output);
  assert.equal(fences.length, 1);
});

