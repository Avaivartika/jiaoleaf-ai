const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const buildDir = path.join(repoRoot, 'build');
const extensionDir = path.join(repoRoot, 'extension');
const rootManifestPath = path.join(repoRoot, 'manifest.json');
const buildManifestPath = path.join(buildDir, 'manifest.json');

function removeDuplicateCopyArtifacts(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      removeDuplicateCopyArtifacts(fullPath);
      continue;
    }
    if (/\s\d+(\.[^/\\]+)?$/.test(entry) || /\s\d+\./.test(entry)) {
      fs.rmSync(fullPath, { force: true });
    }
  }
}

function mapObjectValues(obj, mapper) {
  if (!obj || typeof obj !== 'object') return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = mapper(v);
  }
  return out;
}

function withPrefix(p) {
  if (typeof p !== 'string') return p;
  if (p.startsWith('http://') || p.startsWith('https://') || p.startsWith('/')) {
    return p;
  }
  return `extension/${p}`;
}

function rewriteForRepoRoot(manifest) {
  const out = { ...manifest };
  if (out.icons) out.icons = mapObjectValues(out.icons, withPrefix);
  if (out.action?.default_icon) {
    out.action = { ...out.action, default_icon: mapObjectValues(out.action.default_icon, withPrefix) };
  }
  if (out.background?.service_worker) {
    out.background = { ...out.background, service_worker: withPrefix(out.background.service_worker) };
  }
  if (Array.isArray(out.content_scripts)) {
    out.content_scripts = out.content_scripts.map((script) => ({
      ...script,
      js: Array.isArray(script.js) ? script.js.map(withPrefix) : script.js,
      css: Array.isArray(script.css) ? script.css.map(withPrefix) : script.css
    }));
  }
  if (Array.isArray(out.web_accessible_resources)) {
    out.web_accessible_resources = out.web_accessible_resources.map((item) => ({
      ...item,
      resources: Array.isArray(item.resources) ? item.resources.map(withPrefix) : item.resources
    }));
  }
  if (out.options_ui?.page) {
    out.options_ui = { ...out.options_ui, page: withPrefix(out.options_ui.page) };
  }
  if (out.devtools_page) out.devtools_page = withPrefix(out.devtools_page);
  if (out.sandbox?.pages && Array.isArray(out.sandbox.pages)) {
    out.sandbox = { ...out.sandbox, pages: out.sandbox.pages.map(withPrefix) };
  }
  if (out.side_panel?.default_path) {
    out.side_panel = { ...out.side_panel, default_path: withPrefix(out.side_panel.default_path) };
  }
  if (out.chrome_url_overrides && typeof out.chrome_url_overrides === 'object') {
    out.chrome_url_overrides = mapObjectValues(out.chrome_url_overrides, withPrefix);
  }
  return out;
}

if (!fs.existsSync(buildManifestPath)) {
  throw new Error(`Missing build manifest at ${buildManifestPath}. Run npm run build first.`);
}

fs.rmSync(extensionDir, { recursive: true, force: true });
fs.cpSync(buildDir, extensionDir, { recursive: true });
removeDuplicateCopyArtifacts(extensionDir);

const buildManifest = JSON.parse(fs.readFileSync(buildManifestPath, 'utf8'));
const rootManifest = rewriteForRepoRoot(buildManifest);
fs.writeFileSync(rootManifestPath, JSON.stringify(rootManifest, null, 2) + '\n');

console.log(`Synced installable extension to ${extensionDir}`);
console.log(`Wrote root manifest: ${rootManifestPath}`);
