import { Command } from 'commander';

import { askMissingOptions } from './prompts';
import { scaffold } from './scaffold';

export interface CliOptions {
  projectName: string;
  installDeps: boolean;
  copyEnv: boolean;
}

export async function run(): Promise<void> {
  const program = new Command()
    .name('create-paywright-app')
    .description(
      'Scaffold a production-ready Stripe payment microservice (NestJS + TypeORM + BullMQ)',
    )
    .argument('[project-name]', 'name of the project / target directory')
    .option('-y, --yes', 'accept all defaults, no prompts (for CI)', false)
    .option('--skip-install', 'do not run npm install', false)
    .parse();

  const flags = program.opts<{ yes: boolean; skipInstall: boolean }>();
  const options = await askMissingOptions({
    projectName: program.args[0],
    nonInteractive: flags.yes,
    skipInstall: flags.skipInstall,
  });

  await scaffold(options);
}
