# Native Messaging Setup

JiaoLeaf can connect to the local host through Chrome Native Messaging.

## Windows Install

1. Load the unpacked extension in `chrome://extensions`.
2. Copy the extension ID.
3. Double-click `install-native-host.cmd` from the package root.
4. Paste the extension ID when prompted.
5. Restart Chrome.
6. In JiaoLeaf settings, set `Connection -> Transport` to `Native Messaging`.

This registers `com.jiaoleaf.host` under the current user's Chrome native messaging registry key. Chrome then starts the host in the background when the extension needs it.

## macOS Install (Homebrew)

Install the companion app:

```bash
brew install --cask jiaoleaf-host
```

The installer registers:
- `com.jiaoleaf.host`
- Chrome native messaging manifest under `NativeMessagingHosts`

## Unsigned Installer Note

If macOS warns that the host is unsigned, open:
`System Settings -> Privacy & Security`
and allow the blocked JiaoLeaf Host item.

After allowing it once, retry from the JiaoLeaf panel settings.
