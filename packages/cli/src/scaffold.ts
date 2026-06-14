import { spawnSync } from 'node:child_process';
import path from 'node:path';

import fs from 'fs-extra';

import { CliOptions } from './cli';

/** Inverse of scripts/sync-template.js — restore npm-unsafe filenames */
const RENAMES: Array<[string, string]> = [
  ['package.json.template', 'package.json'],
  ['gitignore', '.gitignore'],
  ['env.example', '.env.example'],
];

export async function scaffold(options: CliOptions): Promise<void> {
  const targetDir = path.resolve(process.cwd(), options.projectName);
  const templateDir = path.join(__dirname, '..', 'template');

  if (!(await fs.pathExists(templateDir))) {
    throw new Error(
      'Template directory missing — run "npm run sync-template" in the CLI package first',
    );
  }

  if (await fs.pathExists(targetDir)) {
    const contents = await fs.readdir(targetDir);
    if (contents.length > 0) {
      throw new Error(`Directory ${options.projectName} already exists and is not empty`);
    }
  }

  console.log(`\nScaffolding into ${targetDir} ...`);
  await fs.copy(templateDir, targetDir);

  for (const [from, to] of RENAMES) {
    const fromPath = path.join(targetDir, from);
    if (await fs.pathExists(fromPath)) {
      await fs.move(fromPath, path.join(targetDir, to));
    }
  }

  await personalizePackageJson(targetDir, options.projectName);

  if (options.copyEnv) {
    await fs.copy(
      path.join(targetDir, '.env.example'),
      path.join(targetDir, '.env'),
    );
  }

  if (options.installDeps) {
    console.log('\nInstalling dependencies (this takes a minute) ...\n');
    const result = spawnSync('npm', ['install'], {
      cwd: targetDir,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    if (result.status !== 0) {
      throw new Error('npm install failed — run it manually in the project directory');
    }
  }

  printNextSteps(options);
}

async function personalizePackageJson(
  targetDir: string,
  projectName: string,
): Promise<void> {
  const manifestPath = path.join(targetDir, 'package.json');
  const manifest = (await fs.readJson(manifestPath)) as Record<string, unknown>;
  await fs.writeJson(
    manifestPath,
    { ...manifest, name: projectName, version: '0.1.0' },
    { spaces: 2 },
  );
}

function printNextSteps(options: CliOptions): void {
  const steps = [
    `cd ${options.projectName}`,
    ...(options.copyEnv
      ? ['# edit .env — set STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, API_KEY']
      : ['cp .env.example .env   # then edit it']),
    ...(options.installDeps ? [] : ['npm install']),
    'docker compose up -d postgres redis',
    'npm run migration:run',
    'npm run start:dev',
  ];

  console.log('\nDone! Next steps:\n');
  for (const step of steps) console.log(`  ${step}`);
  console.log('\nAPI docs at http://localhost:3000/api/docs once running.\n');
}
