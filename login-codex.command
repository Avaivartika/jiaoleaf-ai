#!/usr/bin/env bash
set -euo pipefail

if ! command -v npx >/dev/null 2>&1; then
  echo "npx was not found. Install Node.js from https://nodejs.org/ and run this file again."
  exit 1
fi

echo "Opening Codex CLI login. Use your ChatGPT/Codex account in the browser if prompted."
if ! npx -y @openai/codex login; then
  echo
  echo "Codex login command failed. Starting Codex interactively as a fallback."
  npx -y @openai/codex
fi
