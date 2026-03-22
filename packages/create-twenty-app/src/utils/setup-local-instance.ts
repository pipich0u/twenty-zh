import chalk from 'chalk';
import { execSync } from 'node:child_process';

const DEFAULT_PORT = 2020;

// Minimal health check — the full implementation lives in twenty-sdk
const isServerReady = async (port: number): Promise<boolean> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const response = await fetch(`http://localhost:${port}/healthz`, {
      signal: controller.signal,
    });

    const body = await response.json();

    return body.status === 'ok';
  } catch {
    return false;
  } finally {
    clearTimeout(timeoutId);
  }
};

export type LocalInstanceResult = {
  running: boolean;
  serverUrl?: string;
};

export const setupLocalInstance = async (
  appDirectory: string,
): Promise<LocalInstanceResult> => {
  console.log('');
  if (await isServerReady(DEFAULT_PORT)) {
    const serverUrl = `http://localhost:${DEFAULT_PORT}`;

    console.log(chalk.green(`Twenty server detected on ${serverUrl}.`));

    console.log('');

    return { running: true, serverUrl };
  }

  console.log(chalk.blue('Setting up local Twenty instance...'));

  console.log('');

  try {
    execSync('yarn twenty server start', {
      cwd: appDirectory,
      stdio: 'inherit',
    });
  } catch {
    return { running: false };
  }

  console.log(chalk.gray('Waiting for Twenty to be ready...'));

  const startTime = Date.now();
  const timeoutMs = 180 * 1000;

  while (Date.now() - startTime < timeoutMs) {
    if (await isServerReady(DEFAULT_PORT)) {
      const serverUrl = `http://localhost:${DEFAULT_PORT}`;

      console.log(chalk.green(`Server running on '${serverUrl}'`));
      console.log('');

      return { running: true, serverUrl };
    }

    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  console.log('');

  console.log(
    chalk.yellow(
      'Twenty server did not become healthy in time. Check: yarn twenty server logs',
    ),
  );

  console.log('');

  return { running: false };
};
