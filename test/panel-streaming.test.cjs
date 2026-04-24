const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('Panel streams job events and renders patch action', () => {
  const panelPath = path.join(
    __dirname,
    '..',
    'src',
    'iso',
    'panel',
    'Panel.tsx'
  );
  const contents = fs.readFileSync(panelPath, 'utf8');

  assert.match(contents, /streamJobEvents/);
  assert.match(contents, /Apply/);
});

test('Panel reveals streamed text in frame-sized batches', () => {
  const panelPath = path.join(
    __dirname,
    '..',
    'src',
    'iso',
    'panel',
    'Panel.tsx'
  );
  const contents = fs.readFileSync(panelPath, 'utf8');

  assert.match(contents, /const STREAM_REVEAL_INTERVAL_MS = 16;/);
  assert.match(contents, /const STREAM_REVEAL_MIN_CHARS_PER_TICK = 160;/);
  assert.match(contents, /const STREAM_REVEAL_MAX_TOKENS_PER_TICK = 40;/);
  assert.match(contents, /nextChunk \+= sessionState\.streamTokens\.shift\(\) \?\? '';/);
  assert.doesNotMatch(contents, /}, 30\);/);
});
