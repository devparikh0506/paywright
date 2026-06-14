/**
 * Copies packages/template into packages/cli/template for publishing.
 *
 * npm silently drops or rewrites certain files inside published packages
 * (package.json would be treated as a real manifest, .gitignore and .env*
 * get excluded), so those ship under safe names and the scaffolder
 * renames them back:
 *   package.json  → package.json.template
 *   .gitignore    → gitignore
 *   .env.example  → env.example
 *
 * Runs automatically via prepack — never edit cli/template by hand.
 */
const fs = require('fs-extra');
const path = require('path');

const SOURCE = path.join(__dirname, '..', '..', 'template');
const DEST = path.join(__dirname, '..', 'template');

const EXCLUDED = ['node_modules', 'dist', 'coverage', '.env'];

const RENAMES = [
  ['package.json', 'package.json.template'],
  ['.gitignore', 'gitignore'],
  ['.env.example', 'env.example'],
];

async function main() {
  await fs.remove(DEST);
  await fs.copy(SOURCE, DEST, {
    filter: (src) => !EXCLUDED.includes(path.basename(src)),
  });

  for (const [from, to] of RENAMES) {
    const fromPath = path.join(DEST, from);
    if (await fs.pathExists(fromPath)) {
      await fs.move(fromPath, path.join(DEST, to));
    }
  }

  console.log(`Template synced to ${DEST}`);
}

main().catch((error) => {
  console.error('Template sync failed:', error.message);
  process.exit(1);
});
