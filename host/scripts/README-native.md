# Native Messaging Manifest

## Usage

Generate a native messaging manifest for Chrome/Chromium:

```bash
node host/scripts/build-native-manifest.mjs <extension-id> <host-binary-path> <output-path>
```

## Example (macOS)

```bash
node host/scripts/build-native-manifest.mjs \
  "abcdefghijklmnopqrstuvwxyz123456" \
  "/usr/local/bin/jiaoleaf-host" \
  "$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts/com.jiaoleaf.host.json"
```

## Example (Linux)

```bash
node host/scripts/build-native-manifest.mjs \
  "abcdefghijklmnopqrstuvwxyz123456" \
  "/usr/local/bin/jiaoleaf-host" \
  "$HOME/.config/google-chrome/NativeMessagingHosts/com.jiaoleaf.host.json"
```

## Example (Windows)

The package root includes `install-native-host.cmd`, which performs these steps automatically.
Manual equivalent:

```powershell
node host/scripts/build-native-manifest.mjs `
  "abcdefghijklmnopqrstuvwxyz123456" `
  "C:\path\to\jiaoleaf-ai\native-host.cmd" `
  "manifest.json"

# Then install to registry:
# reg add "HKCU\Software\Google\Chrome\NativeMessagingHosts\com.jiaoleaf.host" /ve /d "C:\path\to\manifest.json"
```

## Notes

- Extension ID can be found in `chrome://extensions/` (Developer Mode must be enabled)
- Host binary path must be absolute (no `~` expansion)
- Output path should be in the Chrome NativeMessagingHosts directory for automatic discovery
