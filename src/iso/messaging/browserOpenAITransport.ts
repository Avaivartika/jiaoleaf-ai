import type { Options } from '../../types';
import type {
  CodexContextUsageResponse,
  CodexRuntimeMetadata,
  JobPayload,
} from '../api/httpClient';
import type { JobEvent } from '../api/sse';
import type { Transport } from './transport';

type BrowserJob = {
  payload: JobPayload;
};

const jobs = new Map<string, BrowserJob>();

function makeJobId() {
  const random =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `browser-openai-${random}`;
}

function getOpenAIKey(options: Options) {
  return options.openaiApiKey?.trim() ?? '';
}

function getOpenAIBaseUrl(options: Options) {
  return (options.openaiBaseUrl || 'https://api.openai.com/v1').trim();
}

function getCodexMetadata(options: Options): CodexRuntimeMetadata {
  const model = options.codexModel || 'gpt-5.4';
  const effort = options.codexReasoningEffort || 'low';
  return {
    models: [
      {
        value: model,
        displayName: model.toUpperCase().startsWith('GPT-') ? model.toUpperCase() : model,
        description: 'OpenAI model via browser API',
        supportedReasoningEfforts: [
          { reasoningEffort: 'low', description: 'Fast responses' },
          { reasoningEffort: 'medium', description: 'Balanced reasoning' },
          { reasoningEffort: 'high', description: 'Deeper reasoning' },
          { reasoningEffort: 'xhigh', description: 'Maximum reasoning' },
        ],
        defaultReasoningEffort: effort,
        isDefault: true,
      },
    ],
    currentModel: model,
    currentReasoningEffort: effort,
  };
}

function summarizeProjectFiles(payload: JobPayload) {
  const files = Array.isArray((payload as any).projectFiles)
    ? ((payload as any).projectFiles as Array<{ path?: string; content?: string }>)
    : [];
  if (!files.length) return '';
  return files
    .slice(0, 20)
    .map((file) => {
      const path = file.path || 'untitled';
      const content = String(file.content ?? '').slice(0, 12000);
      return `\n\n[file: ${path}]\n${content}`;
    })
    .join('');
}

function buildInput(payload: JobPayload) {
  const context = payload.context ?? {};
  const system = payload.userSettings?.customSystemPrompt?.trim();
  const parts: string[] = [];
  parts.push(
    'You are JiaoLeaf AI, an assistant embedded in Overleaf. Answer clearly and help with LaTeX, papers, citations, and academic writing.'
  );
  if (system) parts.push(system);
  if (payload.action && payload.action !== 'chat') {
    parts.push(`Current action: ${payload.action}`);
  }
  if (context.selection) parts.push(`Selected text:\n${context.selection}`);
  if (context.surroundingBefore || context.surroundingAfter) {
    parts.push(
      `Editor context:\n${context.surroundingBefore ?? ''}\n<<<cursor>>>\n${context.surroundingAfter ?? ''}`
    );
  }
  if (Array.isArray(context.attachments) && context.attachments.length) {
    for (const attachment of context.attachments) {
      if (attachment.content) {
        parts.push(`Attachment ${attachment.name ?? attachment.path ?? ''}:\n${attachment.content}`);
      }
    }
  }
  const projectFiles = summarizeProjectFiles(payload);
  if (projectFiles) parts.push(`Project files:${projectFiles}`);
  parts.push(`User message:\n${context.message ?? ''}`);
  return parts.join('\n\n');
}

function sendOpenAIMessage(options: Options, payload: JobPayload, signal?: AbortSignal) {
  const apiKey = getOpenAIKey(options);
  if (!apiKey) {
    throw new Error('OpenAI API key is not configured. Add it in Settings -> Tools.');
  }
  const model = payload.runtime?.codex?.model || options.codexModel || 'gpt-5.4';
  const reasoningEffort =
    payload.runtime?.codex?.reasoningEffort || options.codexReasoningEffort || 'low';

  return new Promise<{ text: string; usage?: any; id?: string | null }>((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    chrome.runtime.sendMessage(
      {
        type: 'jiaoleaf:openai-response',
        apiKey,
        baseUrl: getOpenAIBaseUrl(options),
        model,
        reasoningEffort,
        input: buildInput(payload),
      },
      (message) => {
        const lastError = chrome.runtime.lastError;
        if (lastError) {
          reject(new Error(lastError.message));
          return;
        }
        if (!message?.ok) {
          reject(new Error(message?.error || 'OpenAI request failed'));
          return;
        }
        resolve(message.response);
      }
    );
  });
}

export function browserOpenAITransport(options: Options, fallback: Transport): Transport {
  return {
    ...fallback,
    async createJob(payload: JobPayload) {
      if (payload.provider !== 'codex' || !options.openaiBrowserMode) {
        return fallback.createJob(payload);
      }
      const jobId = makeJobId();
      jobs.set(jobId, { payload });
      return { jobId };
    },

    async streamJobEvents(jobId: string, onEvent: (event: JobEvent) => void, request?: { signal?: AbortSignal }) {
      const job = jobs.get(jobId);
      if (!job) {
        return fallback.streamJobEvents(jobId, onEvent, request);
      }
      try {
        onEvent({ event: 'trace', data: { message: 'Calling OpenAI from browser' } });
        const response = await sendOpenAIMessage(options, job.payload, request?.signal);
        if (response.text) {
          onEvent({ event: 'delta', data: { text: response.text } });
        }
        const inputTokens = Number(response.usage?.input_tokens ?? response.usage?.prompt_tokens ?? 0);
        const outputTokens = Number(response.usage?.output_tokens ?? response.usage?.completion_tokens ?? 0);
        if (inputTokens || outputTokens) {
          onEvent({
            event: 'usage',
            data: {
              model: job.payload.runtime?.codex?.model || options.codexModel || 'gpt-5.4',
              usedTokens: inputTokens + outputTokens,
              contextWindow: 128000,
            },
          });
        }
        onEvent({
          event: 'done',
          data: { status: 'ok', threadId: response.id ?? jobId },
        });
      } catch (error) {
        onEvent({
          event: 'done',
          data: {
            status: 'error',
            message: error instanceof Error ? error.message : String(error),
          },
        });
      } finally {
        jobs.delete(jobId);
      }
    },

    async fetchCodexRuntimeMetadata() {
      if (options.openaiBrowserMode) return getCodexMetadata(options);
      return fallback.fetchCodexRuntimeMetadata();
    },

    async fetchCodexRuntimeContextUsage(): Promise<CodexContextUsageResponse> {
      if (options.openaiBrowserMode) {
        return {
          configured: Boolean(getOpenAIKey(options)),
          model: options.codexModel || 'gpt-5.4',
          usedTokens: 0,
          contextWindow: 128000,
          percentage: null,
        };
      }
      return fallback.fetchCodexRuntimeContextUsage();
    },

    async fetchHostHealth() {
      if (options.openaiBrowserMode && getOpenAIKey(options)) {
        return {
          status: 'ok',
          startedAt: new Date().toISOString(),
          claude: { configured: false },
          pi: { configured: false },
        };
      }
      return fallback.fetchHostHealth();
    },
  };
}
