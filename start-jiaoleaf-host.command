#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/host"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js 20 or newer is required."
  echo "Install Node.js from https://nodejs.org/ and run this file again."
  exit 1
fi

if [ ! -d node_modules ]; then
  echo "Installing JiaoLeaf host dependencies..."
  npm install
fi

echo "Starting JiaoLeaf host on http://127.0.0.1:3210"
echo "Keep this window open while using the extension."
echo "If you use Codex with a ChatGPT account, run login-codex.command once first."
npm run dev
