# Contributing

Thanks for improving JiaoLeaf AI.

## Development Setup

```bash
npm install
npm run watch
```

In a second terminal:

```bash
cd host
npm install
npm run dev
```

Load `build/` as an unpacked extension in Chrome.

## Checks Before Opening A Pull Request

Run:

```bash
npm test
npm run build
cd host && npm test
```

If a change touches only documentation, explain that tests were not needed.

## Pull Request Guidelines

- Keep changes focused and reversible.
- Preserve support for official Overleaf and both SJTU Overleaf domains.
- Do not commit API keys, `.env`, browser profiles, or generated private keys.
- Prefer small UI changes that match Overleaf's existing visual language.
- Add or update tests when changing editor bridge behavior, patch application, provider logic, or skills.

## Release Packaging

```bash
npm run repack
```

The installable extension zip is written to `release/`.
