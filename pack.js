const { readFileSync, existsSync, mkdirSync } = require('fs');
const { resolve } = require('path');
const AdmZip = require('adm-zip');

try {
  const { version } = JSON.parse(
    readFileSync(resolve(__dirname, 'build', 'manifest.json'), 'utf8')
  );
  const { name } = JSON.parse(
    readFileSync(resolve(__dirname, 'package.json'), 'utf8')
  );

  const outdir = 'release';
  const filename = `${name}-v${version}.zip`;
  const zip = new AdmZip();
  zip.addLocalFolder('build');
  if (!existsSync(outdir)) {
    mkdirSync(outdir);
  }
  zip.writeZip(`${outdir}/${filename}`);

  const releaseZip = new AdmZip(`${outdir}/${filename}`);
  const manifestEntry = releaseZip.getEntry('manifest.json');
  if (!manifestEntry) {
    throw new Error('Release zip is missing root manifest.json');
  }
  JSON.parse(manifestEntry.getData().toString('utf8'));

  console.log(
    `Success! Created a ${filename} file under ${outdir} directory. You can upload this file to web store.`
  );
} catch (e) {
  console.error('Error! Failed to generate a zip file.');
  console.error(e);
  process.exit(1);
}
