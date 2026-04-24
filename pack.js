const { existsSync, mkdirSync, readFileSync } = require('fs');
const { resolve } = require('path');
const AdmZip = require('adm-zip');

const outdir = 'release';
const excludes = [
  /^host\/node_modules\//,
  /^host\/dist\//,
  /^host\/\.env($|\.)/,
  /^\.git\//,
  /^node_modules\//,
  /^build\//,
  /^release\//,
  /^docs\/manus(\/|$)/,
  /(^|\/)CLAUDE\.md$/,
  /\s\d+\.[^/]+$/,
];

function addFolder(zip, folder, zipPath = folder) {
  if (!existsSync(folder)) return;
  zip.addLocalFolder(folder, zipPath, (entry) => {
    const normalized = `${zipPath}/${entry}`.replace(/\\/g, '/');
    return !excludes.some((pattern) => pattern.test(normalized));
  });
}

try {
  const packageJson = JSON.parse(readFileSync(resolve(__dirname, 'package.json'), 'utf8'));
  const manifest = JSON.parse(readFileSync(resolve(__dirname, 'manifest.json'), 'utf8'));

  if (!existsSync(resolve(__dirname, 'extension', 'contentIsoScript.js'))) {
    throw new Error('Missing extension assets. Run npm run sync:source-installable first.');
  }
  if (!existsSync(resolve(__dirname, 'host', 'package.json'))) {
    throw new Error('Missing host/package.json. The GitHub install bundle must include host/.');
  }

  const filename = `${packageJson.name}-v${manifest.version}.zip`;
  const zip = new AdmZip();
  zip.addLocalFile('manifest.json');
  for (const file of [
    'README.md',
    'LICENSE',
    'AGENTS.md',
    'start-jiaoleaf-host.cmd',
    'start-jiaoleaf-host.command',
    'install-native-host.cmd',
    'native-host.cmd',
    'login-codex.cmd',
    'login-codex.command',
  ]) {
    if (existsSync(file)) zip.addLocalFile(file);
  }
  addFolder(zip, 'extension', 'extension');
  addFolder(zip, 'host', 'host');
  addFolder(zip, 'docs', 'docs');

  if (!existsSync(outdir)) mkdirSync(outdir);
  zip.writeZip(`${outdir}/${filename}`);

  const releaseZip = new AdmZip(`${outdir}/${filename}`);
  const manifestEntry = releaseZip.getEntry('manifest.json');
  const hostEntry = releaseZip.getEntry('host/package.json');
  const extensionEntry = releaseZip.getEntry('extension/contentIsoScript.js');
  if (!manifestEntry) throw new Error('Release zip is missing root manifest.json');
  if (!hostEntry) throw new Error('Release zip is missing host/package.json');
  if (!extensionEntry) throw new Error('Release zip is missing extension/contentIsoScript.js');
  JSON.parse(manifestEntry.getData().toString('utf8'));

  console.log(`Success! Created ${outdir}/${filename}.`);
  console.log('After unzip, load the extracted package root in chrome://extensions.');
} catch (error) {
  console.error('Error! Failed to generate a release bundle.');
  console.error(error);
  process.exit(1);
}
