#!/usr/bin/env bash
set -euo pipefail

HOST_PATH="/usr/local/bin/jiaoleaf-host"
MANIFEST_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
MANIFEST_PATH="$MANIFEST_DIR/com.jiaoleaf.host.json"

mkdir -p "$MANIFEST_DIR"
node "$(dirname "$0")/../build-native-manifest.mjs" "$JIAOLEAF_EXTENSION_ID" "$HOST_PATH" "$MANIFEST_PATH"
