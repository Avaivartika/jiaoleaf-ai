import type { Options } from '../../types';
import { browserOpenAITransport } from './browserOpenAITransport';
import { httpTransport } from './httpTransport';
import { nativeTransport } from './nativeTransport';
import type {
  AttachmentMeta,
  ClaudeContextUsageResponse,
  ClaudeRuntimeMetadata,
  CodexContextUsageResponse,
  CodexRuntimeMetadata,
  HostHealthResponse,
  JobPayload,
  PiContextUsageResponse,
  PiRuntimeMetadata,
} from '../api/httpClient';
import type { JobEvent } from '../api/sse';

export type TransportKind = 'http' | 'native';

export type Transport = {
  createJob: (payload: JobPayload, request?: { signal?: AbortSignal }) => Promise<{ jobId: string }>;
  streamJobEvents: (
    jobId: string,
    onEvent: (event: JobEvent) => void,
    request?: { signal?: AbortSignal }
  ) => Promise<void>;
  respondToJobRequest: (
    jobId: string,
    payload: { requestId: number | string; result: unknown },
    request?: { signal?: AbortSignal }
  ) => Promise<unknown>;

  fetchClaudeRuntimeMetadata: () => Promise<ClaudeRuntimeMetadata>;
  fetchCodexRuntimeMetadata: () => Promise<CodexRuntimeMetadata>;
  updateClaudeRuntimePreferences: (payload: {
    model?: string | null;
    thinkingMode?: string | null;
  }) => Promise<{
    currentModel: string | null;
    modelSource?: string;
    currentThinkingMode: string;
    maxThinkingTokens: number | null;
  }>;
  fetchClaudeRuntimeContextUsage: () => Promise<ClaudeContextUsageResponse>;
  fetchCodexRuntimeContextUsage: (payload?: { threadId?: string }) => Promise<CodexContextUsageResponse>;
  fetchPiRuntimeMetadata: () => Promise<PiRuntimeMetadata>;
  updatePiRuntimePreferences: (payload: {
    provider?: string | null;
    model?: string | null;
    thinkingLevel?: string | null;
    skillTrustMode?: string | null;
  }) => Promise<{
    currentProvider: string | null;
    currentModel: string | null;
    currentThinkingLevel: string;
    thinkingLevels?: Array<{ id: string; label: string }>;
    skillTrustMode?: string;
  }>;
  fetchPiRuntimeContextUsage: (conversationId?: string) => Promise<PiContextUsageResponse>;
  fetchHostHealth: () => Promise<HostHealthResponse>;

  openAttachmentDialog: (payload: { multiple?: boolean; extensions?: string[] }) => Promise<{ paths: string[] }>;
  validateAttachmentEntries: (payload: {
    entries?: Array<{
      id?: string;
      path?: string;
      name?: string;
      ext?: string;
      content?: string;
      sizeBytes?: number;
      lineCount?: number;
    }>;
    paths?: string[];
    limits?: { maxFiles?: number; maxFileBytes?: number; maxTotalBytes?: number };
  }) => Promise<{
    attachments: AttachmentMeta[];
    errors: Array<{ id?: string; path?: string; message: string }>;
  }>;

  deleteSession: (provider: 'claude' | 'codex' | 'pi', sessionId: string) => Promise<void>;
};

function isMissingNativeHostError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error ?? '');
  const normalized = message.toLowerCase();
  return (
    normalized.includes('native messaging host not found') ||
    normalized.includes('specified native messaging host not found') ||
    normalized.includes('native host not found') ||
    normalized.includes('could not establish connection') ||
    normalized.includes('native_unavailable') ||
    normalized.includes('native request timed out')
  );
}

export function createTransport(options: Options): Transport {
  const kind = options.transport === 'native' ? 'native' : 'http';
  if (kind === 'http') {
    return browserOpenAITransport(options, httpTransport(options) as Transport);
  }

  const native = nativeTransport(options) as unknown as Record<string, unknown>;
  const http = httpTransport(options) as unknown as Record<string, unknown>;

  const transport = new Proxy(native, {
    get(target, prop, receiver) {
      const value = Reflect.get(target, prop, receiver);
      if (typeof value !== 'function') {
        return value;
      }

      return async (...args: unknown[]) => {
        try {
          return await (value as (...fnArgs: unknown[]) => Promise<unknown>).apply(target, args);
        } catch (error) {
          if (isMissingNativeHostError(error)) {
            const fallback = http[prop as string];
            if (typeof fallback === 'function') {
              return await (fallback as (...fnArgs: unknown[]) => Promise<unknown>).apply(http, args);
            }
          }
          throw error;
        }
      };
    },
  }) as Transport;
  return browserOpenAITransport(options, transport);
}
