import assert from 'node:assert/strict';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { resolveCodexCliPath, resolveCodexCommandSpecs } from '../src/runtimes/codex/command.js';

test('resolveCodexCliPath expands home shortcut', () => {
  assert.equal(resolveCodexCliPath('~/bin/codex'), path.join(os.homedir(), 'bin', 'codex'));
});

test('resolveCodexCommandSpecs keeps explicit cliPath as highest-priority command', () => {
  const specs = resolveCodexCommandSpecs('/custom/codex');
  assert.deepEqual(specs, [{ command: '/custom/codex', baseArgs: [] }]);
});

test('resolveCodexCommandSpecs includes codex and npx fallbacks', () => {
  const specs = resolveCodexCommandSpecs(undefined);
  const commands = specs.map((spec) => [spec.command, ...spec.baseArgs].join(' '));

  assert.ok(commands.some((entry) => entry.startsWith('codex')), 'expects direct codex command');
  assert.ok(
    commands.some((entry) => entry.includes('@openai/codex')),
    'expects npx @openai/codex fallback'
  );
});
