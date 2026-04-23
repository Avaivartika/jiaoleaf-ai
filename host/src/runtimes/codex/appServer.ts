import { spawn } from 'node:child_process';
import { createInterface } from 'node:readline';

import { getEnhancedPath, parseEnvironmentVariables } from '../claude/cli.js';
import { resolveCodexCliPath, resolveCodexCommandSpecs, type CodexCommandSpec } from './command.js';

type JsonRpcId = number | string;

type JsonRpcMessage = {
  id?: JsonRpcId;
  method?: string;
  params?: unknown;
  result?: unknown;
  error?: unknown;
};

type PendingRequest = {
  resolve: (value: JsonRpcMessage) => void;
  reject: (error: Error) => void;
};

export type CodexAppServerConfig = {
  cliPath?: string;
  envVars?: string;
  cwd: string;
};

function stringifyCommand(spec: CodexCommandSpec): string {
  return [spec.command, ...spec.baseArgs].join(' ');
}

async function spawnCodexAppServerWithFallback(
  candidates: CodexCommandSpec[],
  opts: {
    cwd: string;
    env: NodeJS.ProcessEnv;
  }
): Promise<{ child: ReturnType<typeof spawn>; command: string }> {
  let lastError: NodeJS.ErrnoException | null = null;

  for (const candidate of candidates) {
    const child = spawn(candidate.command, [...candidate.baseArgs, 'app-server'], {
      cwd: opts.cwd,
      env: opts.env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    const result = await new Promise<
      { ok: true } | { ok: false; error: NodeJS.ErrnoException }
    >((resolve) => {
      let settled = false;

      child.once('spawn', () => {
        if (settled) return;
        settled = true;
        resolve({ ok: true });
      });

      child.once('error', (error: NodeJS.ErrnoException) => {
        if (settled) return;
        settled = true;
        resolve({ ok: false, error });
      });
    });

    if (result.ok) {
      return { child, command: stringifyCommand(candidate) };
    }

    if (result.error.code === 'ENOENT') {
      lastError = result.error;
      continue;
    }

    throw result.error;
  }

  const tried = candidates.map((candidate) => stringifyCommand(candidate)).join(', ');
  const details = lastError?.message ? ` (${lastError.message})` : '';
  const error = new Error(
    `Unable to start OpenAI Codex runtime. Tried: ${tried}. Install Codex CLI or set Settings -> Codex CLI Path.${details}`
  );
  (error as NodeJS.ErrnoException).code = 'ENOENT';
  throw error;
}

export class CodexAppServer {
  private child: ReturnType<typeof spawn> | null = null;
  private starting: Promise<void> | null = null;
  private nextId = 1;
  private readonly pending = new Map<number, PendingRequest>();
  private readonly listeners = new Set<(message: JsonRpcMessage) => void>();
  private readonly stderrListeners = new Set<(line: string) => void>();
  private started = false;
  private initialized = false;
  private initializing: Promise<void> | null = null;

  constructor(private readonly config: CodexAppServerConfig) {}

  getPid() {
    return this.child?.pid ?? null;
  }

  getCwd() {
    return this.config.cwd;
  }

  subscribe(listener: (message: JsonRpcMessage) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  subscribeStderr(listener: (line: string) => void) {
    this.stderrListeners.add(listener);
    return () => {
      this.stderrListeners.delete(listener);
    };
  }

  async start() {
    if (this.child) return;
    if (this.starting) {
      await this.starting;
      return;
    }

    this.started = true;
    this.starting = (async () => {
      const customEnv = parseEnvironmentVariables(this.config.envVars ?? '');

      // Track sensitive keys for cleanup
      const sensitiveKeys = Object.keys(customEnv).filter(
        (key) =>
          key.includes('API_KEY') ||
          key.includes('SECRET') ||
          key.includes('TOKEN') ||
          key.includes('AUTH')
      );

      const cliPath = resolveCodexCliPath(this.config.cliPath);
      const commandCandidates = resolveCodexCommandSpecs(this.config.cliPath);
      const env = {
        ...process.env,
        ...customEnv,
        PATH: getEnhancedPath(customEnv.PATH, cliPath),
      };
      const { child, command } = await spawnCodexAppServerWithFallback(
        commandCandidates,
        {
          cwd: this.config.cwd,
          env,
        }
      );
      this.child = child;

      if (process.env.AGEAF_DEBUG_CLI === 'true') {
        console.log('[CODEX DEBUG] spawning app-server', {
          command,
          cwd: this.config.cwd,
          pid: child.pid ?? null,
        });
      }

      const handleChildError = (error: Error) => {
        this.child = null;
        this.started = false;
        this.initialized = false;
        this.initializing = null;
        this.starting = null;
        for (const pending of this.pending.values()) {
          pending.reject(error);
        }
        this.pending.clear();
      };

      child.on('error', handleChildError);

      child.on('exit', () => {
        this.child = null;
        this.started = false;
        this.initialized = false;
        this.initializing = null;
        this.starting = null;
        for (const pending of this.pending.values()) {
          pending.reject(new Error('Codex app-server exited'));
        }
        this.pending.clear();

        // CRITICAL: Wipe sensitive env vars from memory after CLI execution
        if (sensitiveKeys.length > 0) {
          for (const key of sensitiveKeys) {
            if (key in customEnv) {
              delete customEnv[key];
              customEnv[key] = '';
            }
            if (key in env) {
              const envRecord = env as Record<string, string | undefined>;
              delete envRecord[key];
              envRecord[key] = '';
            }
          }
        }
      });

      const stdout = child.stdout;
      if (stdout) {
        const rl = createInterface({ input: stdout });
        rl.on('line', (line) => {
          const trimmed = line.trim();
          if (!trimmed) return;
          let message: JsonRpcMessage;
          try {
            message = JSON.parse(trimmed) as JsonRpcMessage;
          } catch {
            return;
          }

          const idValue = message.id;
          const id =
            typeof idValue === 'number' && Number.isFinite(idValue)
              ? idValue
              : null;
          const hasResultOrError =
            Object.prototype.hasOwnProperty.call(message, 'result') ||
            Object.prototype.hasOwnProperty.call(message, 'error');
          const hasMethod = typeof message.method === 'string' && message.method.length > 0;

          if (id != null && hasResultOrError) {
            const pending = this.pending.get(id);
            if (pending) {
              this.pending.delete(id);
              pending.resolve(message);
            }
            return;
          }

          if (hasMethod) {
            for (const listener of this.listeners) {
              listener(message);
            }
            return;
          }
        });
      }

      const stderr = child.stderr;
      if (stderr) {
        const rl = createInterface({ input: stderr });
        rl.on('line', (line) => {
          const trimmed = line.trim();
          if (!trimmed) return;

          for (const listener of this.stderrListeners) {
            listener(trimmed);
          }

          if (process.env.AGEAF_DEBUG_CLI === 'true') {
            // Keep this short; stderr can be noisy and may include user content.
            console.log('[CODEX STDERR]', trimmed.slice(0, 300));
          }
        });
      }
    })();

    try {
      await this.starting;
    } catch (error) {
      this.child = null;
      this.started = false;
      this.initialized = false;
      this.initializing = null;
      throw error;
    } finally {
      this.starting = null;
    }
  }

  async ensureInitialized() {
    await this.start();
    if (this.initialized) return;
    if (this.initializing) return this.initializing;

    this.initializing = (async () => {
      const response = await this.request('initialize', {
        clientInfo: { name: 'ageaf', title: 'Ageaf', version: '0.0.0' },
      });
      if ((response as any).error) {
        const message = String((response as any).error?.message ?? 'initialize failed');
        throw new Error(message);
      }
      await this.notify('initialized');
      this.initialized = true;
    })().finally(() => {
      this.initializing = null;
    });

    return this.initializing;
  }

  async request(
    method: string,
    params: unknown,
    options?: { timeoutMs?: number }
  ): Promise<JsonRpcMessage> {
    await this.start();
    const child = this.child;
    if (!child?.stdin) {
      throw new Error('Codex app-server is not running');
    }

    const id = this.nextId++;
    const payload: JsonRpcMessage = { id, method, params };

    const promise = new Promise<JsonRpcMessage>((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });

    const timeoutMs = Number(options?.timeoutMs ?? 60000);
    let timeoutId: NodeJS.Timeout | null = null;
    const timeoutPromise = new Promise<never>((_, reject) => {
      if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) return;
      timeoutId = setTimeout(() => {
        // Remove from pending so a late response doesn't leak memory.
        this.pending.delete(id);
        reject(new Error(`Codex app-server request timed out after ${timeoutMs}ms (${method})`));
      }, timeoutMs);
    });

    child.stdin.write(`${JSON.stringify(payload)}\n`);
    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }

  async notify(method: string, params?: unknown) {
    await this.start();
    const child = this.child;
    if (!child?.stdin) {
      throw new Error('Codex app-server is not running');
    }
    const payload: JsonRpcMessage =
      params === undefined ? { method } : { method, params };
    child.stdin.write(`${JSON.stringify(payload)}\n`);
  }

  async respond(id: JsonRpcId, result: unknown) {
    await this.start();
    const child = this.child;
    if (!child?.stdin) {
      throw new Error('Codex app-server is not running');
    }
    const payload: JsonRpcMessage = { id, result };
    child.stdin.write(`${JSON.stringify(payload)}\n`);
  }

  async stop() {
    const child = this.child;
    this.child = null;
    this.starting = null;
    this.started = false;
    this.initialized = false;
    this.initializing = null;
    if (child) {
      if (process.env.AGEAF_DEBUG_CLI === 'true') {
        console.log('[CODEX DEBUG] stopping app-server', {
          pid: child.pid ?? null,
          cwd: this.config.cwd,
        });
      }
      child.kill();
    }
    for (const pending of this.pending.values()) {
      pending.reject(new Error('Codex app-server stopped'));
    }
    this.pending.clear();
  }
}

const cachedServers = new Map<string, CodexAppServer>();

function getCacheKey(config: CodexAppServerConfig): string {
  return [
    config.cliPath ?? '',
    config.envVars ?? '',
    config.cwd,
  ].join('\n');
}

export async function getCodexAppServer(config: CodexAppServerConfig) {
  const key = getCacheKey(config);
  const existing = cachedServers.get(key);
  if (existing) {
    await existing.ensureInitialized();
    if (process.env.AGEAF_DEBUG_CLI === 'true') {
      console.log('[CODEX DEBUG] reusing app-server', {
        pid: existing.getPid(),
        cwd: existing.getCwd(),
      });
    }
    return existing;
  }

  const server = new CodexAppServer(config);
  cachedServers.set(key, server);
  try {
    await server.ensureInitialized();
    return server;
  } catch (error) {
    cachedServers.delete(key);
    try {
      await server.stop();
    } catch {
      // ignore cleanup failures
    }
    throw error;
  }
}

export async function resetCodexAppServerForTests() {
  if (cachedServers.size === 0) return;
  const servers = Array.from(cachedServers.values());
  cachedServers.clear();
  await Promise.all(servers.map((server) => server.stop().catch(() => {})));
}
