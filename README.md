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

JiaoLeaf AI is a Chrome extension plus local companion host that adds an AI side panel directly inside:

- `https://latex.sjtu.edu.cn`
- `https://latex-en.sjtu.edu.cn`
- `https://www.overleaf.com`

It is designed for academic LaTeX workflows: rewriting selected text, fixing compile errors, reviewing papers, checking citations, keeping notation consistent, and applying proposed edits back into the editor.

The extension UI is aligned with Overleaf's two-level toolbar layout and supports multiple AI runtimes through a local host process.

## Features

- **Integrated Overleaf side panel**: works inside project pages without copy-pasting between tabs.
- **Inline edit review**: proposed file changes can be reviewed, accepted, rejected, or sent back with feedback.
- **SJTU domain support**: injects on both SJTU Chinese and English LaTeX sites.
- **Compile-error assistance**: reads LaTeX logs and proposes focused fixes.
- **Academic skills**: built-in workflows for paper review, citation management, venue compliance, literature review, statistics, and data visualization.
- **Skill settings**: enable built-in skills or add your own custom skill instructions from the settings panel.
- **Multiple runtimes**: supports Anthropic Claude, OpenAI Codex, and BYOK-compatible providers through the companion host.
- **Theme-aware UI**: follows Overleaf-style light/dark chrome and compact toolbar spacing.

## Installation From Release Zip

Do not use GitHub's green **Code -> Download ZIP** button for installation. That downloads the source repository, not the built Chrome extension, and Chrome will report `manifest file is missing or unreadable` if you load the repository root.

1. Download the built extension zip: [`release/jiaoleaf-ai-v0.1.0.zip`](./release/jiaoleaf-ai-v0.1.0.zip).
2. Unzip it locally.
3. Open Chrome and go to `chrome://extensions`.
4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the unzipped extension folder that directly contains `manifest.json`.
   - Correct: `...\jiaoleaf-ai-v0.1.0\manifest.json` exists.
   - Incorrect: selecting the GitHub source folder, where `manifest.json` is only under `public\`.
7. If you are running from source instead of the release zip, select this repository's generated `build/` folder.
8. Start the local companion host:

```bash
cd host
npm install
npm run dev
```

Then open an Overleaf project on SJTU Overleaf or official Overleaf.

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

In a separate terminal, start the host:

```bash
cd host
npm install
npm run dev
```

## Package A Chrome Extension Zip

Run:

```bash
npm run repack
```

This builds the extension and writes a Chrome-loadable zip to:

```text
release/jiaoleaf-ai-v0.1.0.zip
```

The zip contains the extension build output only. The companion host still needs to be installed or run separately.

## Runtime Providers

You only need one provider to start.

## Native Messaging And Homebrew

For production-style local usage on macOS, the companion host can be installed through Homebrew when a tap/cask release is available:

```bash
brew install --cask ageaf-host
```

The native messaging identifier is currently kept as `com.ageaf.host` for compatibility with existing installed hosts.

If macOS blocks the host because the installer is unsigned, open:

```text
System Settings -> Privacy & Security
```

Allow the blocked host item once, then retry from the extension settings panel.

### OpenAI Codex

Uses the local host to talk to the Codex runtime. Configure OpenAI/Codex access in the settings panel and select **OpenAI** in the provider menu.

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
| `npm run pack` | Zip current `build/` into `release/` |
| `npm run repack` | Build and then zip |
| `npm test` | Run extension tests |
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
