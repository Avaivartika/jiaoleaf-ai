const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

test('Main editor bridge searches expectedOldText before requiring file open', () => {
  const bridgePath = path.join(__dirname, '..', 'src', 'main', 'editorBridge', 'bridge.ts');
  const contents = fs.readFileSync(bridgePath, 'utf8');
  const openHint = 'Open ${normalizeFileName(detail.filePath)} in Overleaf and retry.';
  const searchNeedle = 'full.indexOf(detail.expectedOldText)';

  const openIndex = contents.indexOf(openHint);
  const searchIndex = contents.indexOf(searchNeedle);

  assert.notEqual(openIndex, -1);
  assert.notEqual(searchIndex, -1);
  assert.ok(
    searchIndex < openIndex,
    'Expected text lookup should occur before telling user to open the file.'
  );
});

test('Main editor bridge uses from hint when replaceInFile text is repeated', () => {
  const bridgePath = path.join(__dirname, '..', 'src', 'main', 'editorBridge', 'bridge.ts');
  const contents = fs.readFileSync(bridgePath, 'utf8');
  const closestSearch = 'const closest = findClosestOccurrence(full, detail.expectedOldText, rangeFrom);';
  const duplicateError = "error: 'Expected text appears multiple times'";

  const closestIndex = contents.indexOf(closestSearch);
  const duplicateIndex = contents.indexOf(duplicateError);

  assert.notEqual(closestIndex, -1);
  assert.notEqual(duplicateIndex, -1);
  assert.ok(
    closestIndex < duplicateIndex,
    'replaceInFile should try the from/to hint before failing on repeated expected text.'
  );
});
