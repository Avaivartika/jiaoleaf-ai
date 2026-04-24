import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { getClaudeSessionCwd } from '../src/runtimes/claude/cwd.js';

test('getClaudeSessionCwd defaults to ~/.jiaoleaf', () => {
  const previousOverride = process.env.JIAOLEAF_CLAUDE_CWD;
  delete process.env.JIAOLEAF_CLAUDE_CWD;

  try {
    const cwd = getClaudeSessionCwd();
    const expected = path.join(os.homedir(), '.jiaoleaf');
    assert.equal(cwd, expected);
    assert.ok(fs.existsSync(expected));
  } finally {
    if (previousOverride === undefined) delete process.env.JIAOLEAF_CLAUDE_CWD;
    else process.env.JIAOLEAF_CLAUDE_CWD = previousOverride;
  }
});

