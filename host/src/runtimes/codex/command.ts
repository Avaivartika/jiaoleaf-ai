import os from 'node:os';
import path from 'node:path';

export type CodexCommandSpec = {
  command: string;
  baseArgs: string[];
};

type Platform = NodeJS.Platform;

function normalizeCliPath(cliPath?: string): string | undefined {
  const rawCliPath = cliPath?.trim();
  if (!rawCliPath) return undefined;
  if (rawCliPath === '~') {
    return os.homedir();
  }
  if (rawCliPath.startsWith('~/')) {
    return path.join(os.homedir(), rawCliPath.slice(2));
  }
  return rawCliPath;
}

function dedupeSpecs(specs: CodexCommandSpec[]): CodexCommandSpec[] {
  const seen = new Set<string>();
  const out: CodexCommandSpec[] = [];
  for (const spec of specs) {
    const key = [spec.command, ...spec.baseArgs].join('\0');
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(spec);
  }
  return out;
}

export function resolveCodexCliPath(cliPath?: string): string | undefined {
  return normalizeCliPath(cliPath);
}

function quoteForCmd(value: string): string {
  if (!/[\s&()^=;!'+,`~[\]{}]/.test(value)) return value;
  return `"${value.replace(/"/g, '\\"')}"`;
}

export function resolveCodexCommandSpecs(
  cliPath?: string,
  platform: Platform = process.platform
): CodexCommandSpec[] {
  const resolvedCliPath = normalizeCliPath(cliPath);
  const specs: CodexCommandSpec[] = [];
  const isWindows = platform === 'win32';

  if (resolvedCliPath) {
    if (isWindows) {
      specs.push({ command: 'cmd.exe', baseArgs: ['/d', '/s', '/c', quoteForCmd(resolvedCliPath)] });
    } else {
      specs.push({ command: resolvedCliPath, baseArgs: [] });
    }
  }

  if (isWindows) {
    specs.push(
      { command: 'cmd.exe', baseArgs: ['/d', '/s', '/c', 'codex'] },
      { command: 'cmd.exe', baseArgs: ['/d', '/s', '/c', 'npx', '-y', '@openai/codex'] }
    );
  } else {
    specs.push(
      { command: 'codex', baseArgs: [] },
      { command: 'npx', baseArgs: ['-y', '@openai/codex'] }
    );
  }

  return dedupeSpecs(specs);
}
