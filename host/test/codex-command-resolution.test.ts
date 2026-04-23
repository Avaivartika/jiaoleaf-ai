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
  assert.deepEqual(specs[0], { command: '/custom/codex', baseArgs: [] });
  const commands = specs.map((spec) => [spec.command, ...spec.baseArgs].join(' '));
  assert.ok(
    commands.some((entry) => entry.includes('@openai/codex')),
    'explicit path mode still keeps npx fallback'
  );
});

test('resolveCodexCommandSpecs includes codex and npx fallbacks', () => {
  const specs = resolveCodexCommandSpecs(undefined);
  const commands = specs.map((spec) => [spec.command, ...spec.baseArgs].join(' '));

  assert.ok(commands.some((entry) => entry.startsWith('codex')), 'expects direct codex command');
  assert.ok(
    commands.some((entry) => entry.includes('@openai/codex')),
    'expects npx @openai/codex fallback'
  );

  if (process.platform === 'win32') {
    assert.ok(
      commands.some((entry) => entry.toLowerCase().startsWith('cmd.exe /d /s /c codex')),
      'expects cmd.exe wrapped codex fallback on Windows'
    );
    assert.ok(
      commands.some((entry) => entry.toLowerCase().includes('cmd.exe /d /s /c npx -y @openai/codex')),
      'expects cmd.exe wrapped npx fallback on Windows'
    );
  }
});
