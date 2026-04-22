import { EditorContent, EditorContentState, EditorContentView } from "../types";

export function getCmView() {
  const view = tryGetCmView();
  if (!view) {
    throw new Error('CodeMirror editor is not ready');
  }
  return view;
}

export function tryGetCmView(): EditorContentView | null {
  const editor = document.querySelector('.cm-content') as (EditorContent & Element) | null;
  return editor?.cmView?.view ?? null;
}

export function getContentBeforeCursor(state: EditorContentState, pos: number, length: number) {
  const start = Math.max(0, pos - length);
  return state.sliceDoc(start, pos);
}

export function getContentAfterCursor(state: EditorContentState, pos: number, length: number) {
  const end = Math.min(state.doc.length, pos + length);
  return state.sliceDoc(pos, end);
}
