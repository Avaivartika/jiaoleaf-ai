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

test('resolveCodexCommandSpecs wraps every Windows candidate through cmd.exe to avoid spawn EINVAL', () => {
  const specs = resolveCodexCommandSpecs(undefined, 'win32');
  assert.ok(specs.length > 0);
  assert.ok(specs.every((spec) => spec.command.toLowerCase() === 'cmd.exe'));
  assert.ok(specs.every((spec) => spec.baseArgs.slice(0, 3).join(' ') === '/d /s /c'));

  const commands = specs.map((spec) => [spec.command, ...spec.baseArgs].join(' '));
  assert.ok(
    commands.some((entry) => entry.toLowerCase().includes('/c codex')),
    'expects cmd.exe wrapped codex fallback'
  );
  assert.ok(
    commands.some((entry) => entry.toLowerCase().includes('/c npx -y @openai/codex')),
    'expects cmd.exe wrapped npx fallback'
  );
});

test('resolveCodexCommandSpecs quotes explicit Windows cliPath with spaces', () => {
  const specs = resolveCodexCommandSpecs('C:\\Program Files\\Codex\\codex.cmd', 'win32');
  assert.deepEqual(specs[0], {
    command: 'cmd.exe',
    baseArgs: ['/d', '/s', '/c', '"C:\\Program Files\\Codex\\codex.cmd"'],
  });
});

test('resolveCodexCommandSpecs includes codex and npx fallbacks', () => {
  const specs = resolveCodexCommandSpecs(undefined);
  const commands = specs.map((spec) => [spec.command, ...spec.baseArgs].join(' '));

  assert.ok(commands.some((entry) => entry.startsWith('codex')), 'expects direct codex command');
  assert.ok(
    commands.some((entry) => entry.includes('@openai/codex')),
    'expects npx @openai/codex fallback'
  );

  assert.ok(
    commands.every((entry) => !entry.toLowerCase().startsWith('cmd.exe')),
    'non-Windows default should not shell-wrap Codex commands'
  );
});
