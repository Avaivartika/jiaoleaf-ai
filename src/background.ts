'use strict';

import type { NativeHostRequest, NativeHostResponse } from './iso/messaging/nativeProtocol';

const NATIVE_HOST_NAME = 'com.jiaoleaf.host';
let nativePort: chrome.runtime.Port | null = null;
const pending = new Map<string, (response: NativeHostResponse) => void>();
const streamPorts = new Map<string, chrome.runtime.Port>();

type OpenAIResponseRequest = {
  type: 'jiaoleaf:openai-response';
  apiKey: string;
  baseUrl?: string;
  model: string;
  input: string;
  reasoningEffort?: string | null;
};

function extractOpenAIText(body: any): string {
  if (typeof body?.output_text === 'string') return body.output_text;
  const chunks: string[] = [];
  const output = Array.isArray(body?.output) ? body.output : [];
  for (const item of output) {
    const content = Array.isArray(item?.content) ? item.content : [];
    for (const part of content) {
      if (typeof part?.text === 'string') chunks.push(part.text);
      else if (typeof part?.content === 'string') chunks.push(part.content);
    }
  }
  return chunks.join('\n').trim();
}

async function requestOpenAIResponse(message: OpenAIResponseRequest) {
  const baseUrl = (message.baseUrl || 'https://api.openai.com/v1').replace(/\/+$/, '');
  const body: Record<string, unknown> = {
    model: message.model,
    input: message.input,
  };
  const effort = message.reasoningEffort?.trim();
  if (effort && effort !== 'none' && effort !== 'off') {
    body.reasoning = { effort };
  }

  const response = await fetch(`${baseUrl}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${message.apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const raw = await response.text();
  let json: any = null;
  try {
    json = raw ? JSON.parse(raw) : null;
  } catch {
    json = null;
  }
  if (!response.ok) {
    const detail = json?.error?.message || raw || response.statusText;
    throw new Error(`OpenAI request failed (${response.status}): ${detail}`);
  }
  return {
    text: extractOpenAIText(json),
    usage: json?.usage ?? null,
    id: typeof json?.id === 'string' ? json.id : null,
  };
}

function ensureNativePort(): chrome.runtime.Port | null {
  if (nativePort) return nativePort;

  try {
    nativePort = chrome.runtime.connectNative(NATIVE_HOST_NAME);
  } catch {
    nativePort = null;
    return null;
  }

  nativePort.onMessage.addListener((message: NativeHostResponse) => {
    const handler = pending.get(message.id);
    if (handler) {
      pending.delete(message.id);
      handler(message);
      return;
    }
    const streamPort = streamPorts.get(message.id);
    if (streamPort) {
      try {
        streamPort.postMessage(message);
      } catch {
        streamPorts.delete(message.id);
      }
      if (message.kind === 'end' || message.kind === 'error') {
        streamPorts.delete(message.id);
      }
    }
  });
  nativePort.onDisconnect.addListener(() => {
    const errorMessage = chrome.runtime.lastError?.message || 'Native host disconnected';

    // Drain all pending requests with error
    for (const [id, handler] of pending.entries()) {
      handler({ id, kind: 'error', message: errorMessage });
    }
    pending.clear();

    // Drain all streaming ports with error
    for (const [id, port] of streamPorts.entries()) {
      try {
        port.postMessage({ id, kind: 'error', message: errorMessage });
      } catch {
        // Port may already be disconnected, ignore
      }
    }
    streamPorts.clear();

    nativePort = null;
  });
  return nativePort;
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type === 'jiaoleaf:openai-response') {
    void requestOpenAIResponse(message as OpenAIResponseRequest)
      .then((response) => sendResponse({ ok: true, response }))
      .catch((error) =>
        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        })
      );
    return true;
  }
  if (message?.type === 'jiaoleaf:native-request') {
    const request = message.request as NativeHostRequest;
    const port = ensureNativePort();
    if (!port) {
      sendResponse({ id: request.id, kind: 'error', message: 'native_unavailable' });
      return undefined;
    }
    pending.set(request.id, sendResponse);
    try {
      port.postMessage(request);
    } catch {
      pending.delete(request.id);
      sendResponse({ id: request.id, kind: 'error', message: 'native_unavailable' });
      return undefined;
    }
    return true;
  }
  if (message?.type === 'jiaoleaf:native-cancel') {
    const requestId = message.requestId as string;
    pending.delete(requestId);
    return undefined;
  }
  return undefined;
});

chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'jiaoleaf:native-stream') return;
  const native = ensureNativePort();
  if (!native) {
    port.onMessage.addListener((message: NativeHostRequest) => {
      try {
        port.postMessage({ id: message.id, kind: 'error', message: 'native_unavailable' });
      } catch {
        // ignore
      }
      try {
        port.disconnect();
      } catch {
        // ignore
      }
    });
    return;
  }
  port.onMessage.addListener((message: NativeHostRequest) => {
    streamPorts.set(message.id, port);
    try {
      native.postMessage(message);
    } catch {
      streamPorts.delete(message.id);
      try {
        port.postMessage({ id: message.id, kind: 'error', message: 'Native host disconnected' });
      } catch {
        // ignore
      }
      try {
        port.disconnect();
      } catch {
        // ignore
      }
    }
  });
  port.onDisconnect.addListener(() => {
    for (const [key, value] of streamPorts.entries()) {
      if (value === port) streamPorts.delete(key);
    }
  });
});

chrome.action.onClicked.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0]?.id;
    if (!tabId) return;
    chrome.tabs.sendMessage(tabId, { type: 'jiaoleaf:open-settings' }, () => {
      // It's expected that most tabs won't have our content script injected.
      // Avoid unhandled promise rejections like:
      // "Could not establish connection. Receiving end does not exist."
      void chrome.runtime.lastError;
    });
  });
});
