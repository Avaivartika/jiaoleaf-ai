<div align="center">
  <h1><img src="public/icons/icon_48.png" alt="JiaoLeaf AI" width="45"> JiaoLeaf AI</h1>
  <p>AI writing, editing, and review assistant for SJTU and Overleaf-compatible LaTeX sites.</p>
  <p>
    <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-green" alt="License"></a>
    <img src="https://img.shields.io/badge/Chrome-Extension-blue" alt="Chrome Extension">
    <img src="https://img.shields.io/badge/Manifest-V3-blue" alt="Manifest V3">
    <img src="https://img.shields.io/badge/JiaoLeaf-AI-red" alt="JiaoLeaf AI">
  </p>
</div>

## Overview

JiaoLeaf AI is a Chrome extension that adds an AI side panel directly inside:

- `https://latex.sjtu.edu.cn`
- `https://latex-en.sjtu.edu.cn`
- `https://www.overleaf.com`

It is designed for academic LaTeX workflows: rewriting selected text, fixing compile errors, reviewing papers, checking citations, keeping notation consistent, and applying proposed edits back into the editor.

The default OpenAI path uses your local Codex CLI through the JiaoLeaf host. That means you can sign in with your ChatGPT/Codex account locally and use the extension without buying a separate OpenAI API key. Browser-direct OpenAI API mode is available only as an optional fallback.

## Features

- **Integrated Overleaf side panel**: works inside project pages without copy-pasting between tabs.
- **Inline edit review**: proposed file changes can be reviewed, accepted, rejected, or sent back with feedback.
- **SJTU domain support**: injects on both SJTU Chinese and English LaTeX sites.
- **Compile-error assistance**: reads LaTeX logs and proposes focused fixes.
- **Academic skills**: built-in workflows for paper review, citation management, venue compliance, literature review, statistics, and data visualization.
- **Skill settings**: enable built-in skills or add your own custom skill instructions from the settings panel.
- **Local Codex CLI by default**: use your existing ChatGPT/Codex login through the local Codex CLI.
- **Optional browser-direct API mode**: use an OpenAI API key only if you explicitly enable API mode in settings.
- **Optional local runtimes**: supports Anthropic Claude and BYOK-compatible providers through the companion host.
- **Theme-aware UI**: follows Overleaf-style light/dark chrome and compact toolbar spacing.

## Installation (Single Package)

You can install from either:

- GitHub **Code -> Download ZIP**
- GitHub **Release asset** `jiaoleaf-ai-v*.zip`

Both now contain one unified package:

- `manifest.json` at package root (load this root in Chrome)
- `extension/` (compiled extension assets)
- `host/` (local companion runtime source)

1. Download and unzip one package.
2. Open Chrome at `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the unzipped package root folder (the folder that directly contains `manifest.json`).
6. If Codex CLI is not logged in yet, run the login helper once:
   - Windows: double-click `login-codex.cmd`
   - macOS/Linux: run `./login-codex.command`
7. Install the background native host so Chrome can start it without a separate terminal:
   - Windows: double-click `install-native-host.cmd`, paste the extension ID from `chrome://extensions`, then restart Chrome.
   - macOS/Linux: use the Native Messaging instructions below, or use the manual host command during development.
8. Open an Overleaf project on SJTU Overleaf or official Overleaf.
9. Select **OpenAI** in JiaoLeaf AI. Leave **Use OpenAI API directly** off unless you intentionally want API-key mode.

Why the host exists: Chrome extensions cannot directly launch local CLI programs. Chrome Native Messaging is the browser-approved bridge that lets the panel talk to your already logged-in Codex CLI. If native messaging is not installed, the extension can still use the manual HTTP host fallback.

## Build From Source

Requirements:

- macOS, Linux, or Windows
- Node.js 18+
- Chrome or Chromium

Install dependencies and build the extension:

```bash
npm install
npm run build
```

The unpacked Chrome extension is generated in:

```text
build/
```

For development with automatic rebuilds:

```bash
npm run watch
```

For optional local runtime development, start the host in a separate terminal:

```bash
cd host
npm install
npm run dev
```

## Package A Chrome Extension Zip

Run:

```bash
npm run build
npm run sync:source-installable
npm run pack
```

This writes a single install bundle to:

```text
release/jiaoleaf-ai-v0.1.0.zip
```

This bundle includes extension + host together. After unzip, load the extracted package root in Chrome.

Release tags create GitHub Releases automatically. Maintainers publish a new installable asset with:

```bash
git tag v0.1.0
git push origin v0.1.0
```

## Runtime Providers

You only need one provider to start.

## Native Messaging

Native Messaging is the recommended production path because Chrome launches the local host on demand and no host terminal window has to stay open.

### Windows

1. Load the unpacked extension first.
2. Copy the extension ID from `chrome://extensions`.
3. Double-click `install-native-host.cmd`.
4. Paste the extension ID when prompted.
5. Restart Chrome.
6. In **Settings -> Connection**, use **Native Messaging**.

### macOS

For production-style local usage on macOS, the companion host can be installed through Homebrew when a tap/cask release is available:

```bash
brew install --cask jiaoleaf-host
```

The native messaging identifier is `com.jiaoleaf.host`.

If macOS blocks the host because the installer is unsigned, open:

```text
System Settings -> Privacy & Security
```

Allow the blocked host item once, then retry from the extension settings panel.

### OpenAI / Codex CLI

Uses local Codex CLI by default. Log in once with `login-codex.cmd` / `login-codex.command`, start the host, then select **OpenAI** in the provider menu. This path reuses your local ChatGPT/Codex login and does not require an OpenAI API key.

Optional API-key mode is available in **Settings -> Tools** by enabling **Use OpenAI API directly instead of local Codex CLI** and entering an OpenAI API key.

### Anthropic Claude

Uses Claude runtime support through the companion host. Select **Anthropic** in the provider menu.

### BYOK

BYOK lets you configure supported providers with API keys in `host/.env`.

```bash
cd host
cp .env.example .env
```

Then add whichever keys you need:

```env
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
GEMINI_API_KEY=...
DEEPSEEK_API_KEY=...
DASHSCOPE_API_KEY=...
OPENROUTER_API_KEY=...
```

Restart the host after editing `.env`.

## Supported Sites

The extension currently matches:

```text
https://www.overleaf.com/project/*
https://latex.sjtu.edu.cn/project/*
https://latex-en.sjtu.edu.cn/project/*
```

Static extension assets are also exposed to the corresponding site origins.

## Useful Commands

| Command | Purpose |
| --- | --- |
| `npm install` | Install extension dependencies |
| `npm run build` | Build production extension into `build/` |
| `npm run watch` | Rebuild extension during development |
| `npm run pack` | Build, sync, and zip a single install bundle into `release/` |
| `npm run repack` | Build and then zip |
| `npm test` | Run extension tests |
| `./login-codex.command` / `login-codex.cmd` | Log in to Codex CLI with a ChatGPT/Codex account |
| `install-native-host.cmd` | Install Windows Chrome Native Messaging host so no separate host terminal is needed |
| `./start-jiaoleaf-host.command` / `start-jiaoleaf-host.cmd` | Start the local host bridge |
| `cd host && npm install` | Install host dependencies |
| `cd host && npm run dev` | Start the host in development mode |
| `cd host && npm test` | Run host tests |

## Project Structure

```text
public/                 Chrome manifest, icons, bundled skills
src/iso/contentScript.ts Extension layout injection and browser bridge
src/iso/panel/          Preact panel UI, skills, chat state, review cards
src/main/               Main-world editor bridge and Overleaf integrations
host/                   Local companion host and runtime integrations
test/                   Extension tests
```

## Development Workflow

1. Run `npm run watch`.
2. Run `cd host && npm run dev` in a second terminal.
3. Load `build/` from `chrome://extensions`.
4. After each rebuild, click **Reload** on the extension card.
5. Refresh the Overleaf project page.

## Security Notes

- The host binds to `127.0.0.1` by default.
- Do not commit `.env` or API keys.
- Proposed editor edits are reviewable before being applied.
- BYOK provider requests are handled by the local host according to your local configuration.

## License

MIT License. See [LICENSE](LICENSE).
