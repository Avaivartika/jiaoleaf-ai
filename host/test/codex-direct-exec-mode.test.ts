import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import type { JobEvent } from '../src/types.js';
import { resetCodexAppServerForTests } from '../src/runtimes/codex/appServer.js';
import { runCodexJob } from '../src/runtimes/codex/run.js';

test('Codex direct exec mode bypasses stalled app-server path', async () => {
  const previousExecMode = process.env.AGEAF_CODEX_EXEC_MODE;
  const previousFixtureHang = process.env.CODEX_TEST_HANG;
  const previousExecText = process.env.CODEX_TEST_EXEC_TEXT;

  process.env.AGEAF_CODEX_EXEC_MODE = 'exec';
  process.env.CODEX_TEST_HANG = 'true';
  process.env.CODEX_TEST_EXEC_TEXT = 'Hello from direct exec mode';

  const cliPath = path.join(process.cwd(), 'test', 'fixtures', 'codex');
  const events: JobEvent[] = [];

  try {
    await runCodexJob(
      {
        action: 'chat',
        context: { message: 'Hello' },
        runtime: {
          codex: {
            cliPath,
            envVars: '',
            approvalPolicy: 'never',
            model: 'gpt-5.4',
            reasoningEffort: 'low',
          } as any,
        },
      },
      (event) => events.push(event)
    );

    const deltaText = events
      .filter((event) => event.event === 'delta')
      .map((event) => String((event.data as any)?.text ?? ''))
      .join('');
    const planText = events
      .filter((event) => event.event === 'plan')
      .map((event) => String((event.data as any)?.message ?? ''))
      .join('\n');
    const done = events.find((event) => event.event === 'done');

    assert.equal(deltaText, 'Hello from direct exec mode');
    assert.doesNotMatch(planText, /switching to direct CLI mode/i);
    assert.equal((done?.data as any)?.status, 'ok');
  } finally {
    if (previousExecMode === undefined) delete process.env.AGEAF_CODEX_EXEC_MODE;
    else process.env.AGEAF_CODEX_EXEC_MODE = previousExecMode;
    if (previousFixtureHang === undefined) delete process.env.CODEX_TEST_HANG;
    else process.env.CODEX_TEST_HANG = previousFixtureHang;
    if (previousExecText === undefined) delete process.env.CODEX_TEST_EXEC_TEXT;
    else process.env.CODEX_TEST_EXEC_TEXT = previousExecText;
    await resetCodexAppServerForTests();
  }
});
