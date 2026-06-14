import inquirer from 'inquirer';

import { CliOptions } from './cli';

/** npm package name rules (simplified): lowercase, url-safe */
const VALID_NAME = /^[a-z0-9][a-z0-9-._]*$/;

export function validateProjectName(name: string): true | string {
  return (
    VALID_NAME.test(name) ||
    'Use lowercase letters, digits, hyphens, dots, underscores (must start with a letter or digit)'
  );
}

interface PromptInput {
  projectName?: string;
  nonInteractive: boolean;
  skipInstall: boolean;
}

export async function askMissingOptions(
  input: PromptInput,
): Promise<CliOptions> {
  if (input.projectName) {
    const validation = validateProjectName(input.projectName);
    if (validation !== true) throw new Error(validation);
  }

  if (input.nonInteractive) {
    if (!input.projectName) {
      throw new Error('--yes requires a project name argument');
    }
    return {
      projectName: input.projectName,
      installDeps: !input.skipInstall,
      copyEnv: true,
    };
  }

  const answers = await inquirer.prompt<{
    projectName: string;
    installDeps: boolean;
    copyEnv: boolean;
  }>([
    {
      type: 'input',
      name: 'projectName',
      message: 'Project name?',
      default: 'paywright-service',
      validate: validateProjectName,
      when: !input.projectName,
    },
    {
      type: 'confirm',
      name: 'installDeps',
      message: 'Install dependencies now?',
      default: true,
      when: !input.skipInstall,
    },
    {
      type: 'confirm',
      name: 'copyEnv',
      message: 'Copy .env.example to .env?',
      default: true,
    },
  ]);

  return {
    projectName: input.projectName ?? answers.projectName,
    installDeps: input.skipInstall ? false : answers.installDeps,
    copyEnv: answers.copyEnv,
  };
}
