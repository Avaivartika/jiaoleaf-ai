import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import type { ClaudeRuntimeConfig } from './agent.js';

function ensureDirectory(directory: string): string {
  try {
    fs.mkdirSync(directory, { recursive: true });
  } catch {
    // ignore directory creation failures
  }
  return directory;
}

function getJiaoLeafWorkspaceCwd(): string {
  const workspace = path.join(os.homedir(), '.jiaoleaf');
  return ensureDirectory(workspace);
}

export function getClaudeSessionCwd(runtime?: ClaudeRuntimeConfig): string {
  const override = process.env.JIAOLEAF_CLAUDE_CWD;
  if (override && override.trim()) {
    return override.trim();
  }

  if (runtime?.sessionScope === 'home') {
    return os.homedir();
  }

  // Per-conversation session isolation under ~/.jiaoleaf/claude/sessions/{conversationId}
  const conversationId = runtime?.conversationId?.trim();
  if (conversationId) {
    const sessionDir = path.join(os.homedir(), '.jiaoleaf', 'claude', 'sessions', conversationId);
    return ensureDirectory(sessionDir);
  }

  return getJiaoLeafWorkspaceCwd();
}
