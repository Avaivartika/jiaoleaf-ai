import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';

import { resetCodexAppServerForTests } from '../src/runtimes/codex/appServer.js';

type TimeoutSignal = { signal: AbortSignal; cleanup: () => void };

function withTimeout(ms: number): TimeoutSignal {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  return {
    signal: controller.signal,
    cleanup: () => clearTimeout(timer),
  };
}

test('Codex falls back to exec mode when app-server stalls before first output', async () => {
  const previousStartServer = process.env.AGEAF_START_SERVER;
  const previousTurnTimeout = process.env.AGEAF_CODEX_TURN_TIMEOUT_MS;
  const previousFallbackStall = process.env.AGEAF_CODEX_EXEC_FALLBACK_STALL_MS;
  const previousFixtureHang = process.env.CODEX_TEST_HANG;
  const previousExecText = process.env.CODEX_TEST_EXEC_TEXT;

  process.env.AGEAF_START_SERVER = 'false';
  process.env.AGEAF_CODEX_TURN_TIMEOUT_MS = '5000';
  process.env.AGEAF_CODEX_EXEC_FALLBACK_STALL_MS = '100';
  process.env.CODEX_TEST_HANG = 'true';
  process.env.CODEX_TEST_EXEC_TEXT = 'Hello from exec fallback';

  const { buildServer } = await import('../src/server.js');
  const server = buildServer();
  await server.listen({ port: 0, host: '127.0.0.1' });

  try {
    const address = server.server.address();
    if (!address || typeof address === 'string') {
      throw new Error('Server did not bind to a port');
    }

    const cliPath = path.join(process.cwd(), 'test', 'fixtures', 'codex');
    const jobResponse = await fetch(`http://127.0.0.1:${address.port}/v1/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        provider: 'codex',
        action: 'chat',
        runtime: {
          codex: {
            cliPath,
            approvalPolicy: 'never',
            model: 'gpt-5.4',
            reasoningEffort: 'medium',
          },
        },
        context: { message: 'Hello' },
      }),
    });

    assert.equal(jobResponse.status, 200);
    const { jobId } = (await jobResponse.json()) as { jobId: string };
    assert.ok(jobId);

    const timeout = withTimeout(3000);
    try {
      const eventsResponse = await fetch(
        `http://127.0.0.1:${address.port}/v1/jobs/${jobId}/events`,
        { signal: timeout.signal }
      );
      assert.equal(eventsResponse.status, 200);
      const text = await eventsResponse.text();
      assert.match(text, /switching to direct CLI mode/i);
      assert.match(text, /Hello from exec fallback/);
      assert.match(text, /event: done/);
      assert.match(text, /"status":"ok"/);
    } finally {
      timeout.cleanup();
    }
  } finally {
    if (previousStartServer === undefined) delete process.env.AGEAF_START_SERVER;
    else process.env.AGEAF_START_SERVER = previousStartServer;
    if (previousTurnTimeout === undefined) delete process.env.AGEAF_CODEX_TURN_TIMEOUT_MS;
    else process.env.AGEAF_CODEX_TURN_TIMEOUT_MS = previousTurnTimeout;
    if (previousFallbackStall === undefined) delete process.env.AGEAF_CODEX_EXEC_FALLBACK_STALL_MS;
    else process.env.AGEAF_CODEX_EXEC_FALLBACK_STALL_MS = previousFallbackStall;
    if (previousFixtureHang === undefined) delete process.env.CODEX_TEST_HANG;
    else process.env.CODEX_TEST_HANG = previousFixtureHang;
    if (previousExecText === undefined) delete process.env.CODEX_TEST_EXEC_TEXT;
    else process.env.CODEX_TEST_EXEC_TEXT = previousExecText;
    await resetCodexAppServerForTests();
    await server.close();
  }
});
