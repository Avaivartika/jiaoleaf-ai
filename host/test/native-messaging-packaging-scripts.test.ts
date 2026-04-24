import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

test('macOS packaging script does not claim binary output without pkg', () => {
  const scriptPath = path.join(__dirname, '..', 'scripts', 'pkg', 'build-macos.sh');
  const contents = fs.readFileSync(scriptPath, 'utf8');
  assert.equal(/Built host at/.test(contents), false);
  assert.match(contents, /Host JS built at/);
});

test('macOS installer pkg script installs Chrome system-wide native host manifest', () => {
  const scriptPath = path.join(__dirname, '..', 'scripts', 'macos', 'build-installer-pkg.sh');
  const contents = fs.readFileSync(scriptPath, 'utf8');

  assert.match(contents, /NativeMessagingHosts/);
  assert.match(contents, /\/Library\/Google\/Chrome\/NativeMessagingHosts/);
  assert.match(contents, /com\.jiaoleaf\.host\.json/);
  assert.match(contents, /build-native-manifest\.mjs/);
  assert.match(contents, /--extension-id/);
  assert.match(contents, /postinstall/);
  assert.match(contents, /xattr -dr com\.apple\.quarantine/);
});

test('macOS packaging scripts locate Node outside GUI PATH', () => {
  const pkgScriptPath = path.join(__dirname, '..', 'scripts', 'macos', 'build-installer-pkg.sh');
  const pkgContents = fs.readFileSync(pkgScriptPath, 'utf8');
  assert.match(pkgContents, /\/opt\/homebrew\/bin\/node/);
  assert.match(pkgContents, /\/usr\/local\/bin\/node/);
  assert.match(pkgContents, /\.nvm\/versions\/node/);

  const bundleScriptPath = path.join(__dirname, '..', 'scripts', 'macos', 'build-release-bundle.sh');
  const bundleContents = fs.readFileSync(bundleScriptPath, 'utf8');
  assert.match(bundleContents, /\/opt\/homebrew\/bin\/node/);
  assert.match(bundleContents, /\/usr\/local\/bin\/node/);
  assert.match(bundleContents, /\.nvm\/versions\/node/);
});

test('Windows native host installer registers Chrome native messaging host', () => {
  const repoRoot = path.join(__dirname, '..', '..');
  const installerPath = path.join(repoRoot, 'install-native-host.cmd');
  const launcherPath = path.join(repoRoot, 'native-host.cmd');
  const installer = fs.readFileSync(installerPath, 'utf8');
  const launcher = fs.readFileSync(launcherPath, 'utf8');

  assert.match(installer, /com\.jiaoleaf\.host/);
  assert.match(installer, /NativeMessagingHosts/);
  assert.match(installer, /reg add "HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\com\.jiaoleaf\.host"/);
  assert.match(installer, /build-native-manifest\.mjs/);
  assert.doesNotMatch(installer, /npm run build/);
  assert.match(launcher, /dist\\src\\native\.js/);
  assert.match(launcher, /tsx\\dist\\cli\.mjs/);
});
