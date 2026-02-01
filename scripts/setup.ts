#!/usr/bin/env npx tsx
/**
 * Interactive setup script for Decoupled Sub
 * Walks users through creating a space, configuring Stripe, and importing content
 */

import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as readline from 'readline';

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message: string, color: keyof typeof COLORS = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function logStep(step: number, total: number, message: string) {
  console.log(`\n${COLORS.cyan}[${step}/${total}]${COLORS.reset} ${COLORS.bright}${message}${COLORS.reset}`);
}

function logSuccess(message: string) {
  console.log(`${COLORS.green}✓${COLORS.reset} ${message}`);
}

function logError(message: string) {
  console.log(`${COLORS.red}✗${COLORS.reset} ${message}`);
}

function logInfo(message: string) {
  console.log(`${COLORS.dim}${message}${COLORS.reset}`);
}

async function prompt(question: string, defaultValue?: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const defaultHint = defaultValue ? ` (${defaultValue})` : '';

  return new Promise((resolve) => {
    rl.question(`${question}${defaultHint}: `, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue || '');
    });
  });
}

async function confirm(question: string, defaultYes = true): Promise<boolean> {
  const hint = defaultYes ? '[Y/n]' : '[y/N]';
  const answer = await prompt(`${question} ${hint}`);

  if (!answer) return defaultYes;
  return answer.toLowerCase().startsWith('y');
}

function runCommand(command: string, args: string[], options: { silent?: boolean } = {}): Promise<{ success: boolean; output: string }> {
  return new Promise((resolve) => {
    const fullCommand = [command, ...args].join(' ');
    const child = spawn(fullCommand, [], {
      stdio: options.silent ? 'pipe' : 'inherit',
      shell: true,
    });

    let output = '';

    if (options.silent) {
      child.stdout?.on('data', (data) => {
        output += data.toString();
      });
      child.stderr?.on('data', (data) => {
        output += data.toString();
      });
    }

    child.on('close', (code) => {
      resolve({ success: code === 0, output });
    });
  });
}

function runCommandSync(command: string): { success: boolean; output: string } {
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' });
    return { success: true, output };
  } catch (error: any) {
    return { success: false, output: error.message };
  }
}

async function checkAuth(): Promise<boolean> {
  const result = runCommandSync('npx decoupled-cli@latest auth status 2>&1');
  return result.success && !result.output.includes('not authenticated');
}

async function waitForSpace(spaceId: number, maxWaitSeconds = 200): Promise<boolean> {
  const startTime = Date.now();
  const spinnerChars = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let spinnerIdx = 0;

  process.stdout.write('\n');

  while ((Date.now() - startTime) / 1000 < maxWaitSeconds) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const spinner = spinnerChars[spinnerIdx % spinnerChars.length];
    process.stdout.write(`\r${COLORS.cyan}${spinner}${COLORS.reset} Waiting for space to be ready... (${elapsed}s / ${maxWaitSeconds}s)`);
    spinnerIdx++;

    const result = runCommandSync(`npx decoupled-cli@latest spaces status ${spaceId} 2>/dev/null`);

    if (result.success && result.output.includes('Ready: Yes')) {
      process.stdout.write(`\r${COLORS.green}✓${COLORS.reset} Space is ready!                                    \n`);
      return true;
    }

    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  process.stdout.write(`\r${COLORS.red}✗${COLORS.reset} Timeout waiting for space (${maxWaitSeconds}s)              \n`);
  return false;
}

function writeEnvFile(envPath: string, envVars: Record<string, string>) {
  const lines = Object.entries(envVars).map(([key, value]) => `${key}=${value}`);
  fs.writeFileSync(envPath, lines.join('\n') + '\n');
}

function readEnvFile(envPath: string): Record<string, string> {
  if (!fs.existsSync(envPath)) return {};

  const content = fs.readFileSync(envPath, 'utf8');
  const envVars: Record<string, string> = {};

  for (const line of content.split('\n')) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      envVars[match[1]] = match[2];
    }
  }

  return envVars;
}

async function main() {
  console.log(`
${COLORS.magenta}╔════════════════════════════════════════════════════╗
║                                                    ║
║       Decoupled Sub - Interactive Setup            ║
║       Subscription Platform with Stripe            ║
║                                                    ║
╚════════════════════════════════════════════════════╝${COLORS.reset}
`);

  const totalSteps = 6;
  let currentStep = 1;
  const envPath = path.join(process.cwd(), '.env.local');
  let envVars = readEnvFile(envPath);

  // Step 1: Check/Setup Authentication
  logStep(currentStep++, totalSteps, 'Checking authentication');

  const isAuthenticated = await checkAuth();

  if (!isAuthenticated) {
    log('You need to authenticate with Decoupled.io first.', 'yellow');
    const shouldAuth = await confirm('Open browser to authenticate?');

    if (shouldAuth) {
      log('\nOpening browser for authentication...', 'dim');
      await runCommand('npx', ['decoupled-cli@latest', 'auth', 'login']);

      if (!(await checkAuth())) {
        logError('Authentication failed. Please try again.');
        process.exit(1);
      }
    } else {
      logError('Authentication required to continue.');
      process.exit(1);
    }
  }

  logSuccess('Authenticated with Decoupled.io');

  // Step 2: Create Space
  logStep(currentStep++, totalSteps, 'Creating Drupal space');

  const spaceName = await prompt('Enter a name for your subscription site', 'The Insider');

  log(`\nCreating space "${spaceName}"...`, 'dim');

  const createResult = runCommandSync(`npx decoupled-cli@latest spaces create "${spaceName}" 2>&1`);

  let spaceId: number | null = null;
  let spaceUrl: string | null = null;

  const idMatch = createResult.output.match(/Space ID:\s*(\d+)/i);
  if (idMatch) {
    spaceId = parseInt(idMatch[1], 10);
  }

  const machineMatch = createResult.output.match(/Machine Name:\s*(\w+)/i);
  if (machineMatch) {
    spaceUrl = `https://${machineMatch[1]}.decoupled.website`;
  }

  if (!spaceId) {
    logError('Failed to create space. Output:');
    console.log(createResult.output);

    const manualId = await prompt('Enter space ID manually (or press Enter to exit)');
    if (manualId && !isNaN(parseInt(manualId, 10))) {
      spaceId = parseInt(manualId, 10);
    } else {
      process.exit(1);
    }
  }

  logSuccess(`Space created with ID: ${spaceId}`);
  if (spaceUrl) {
    logInfo(`URL: ${spaceUrl}`);
  }

  // Step 3: Wait for space to be ready
  logStep(currentStep++, totalSteps, 'Waiting for space provisioning');

  logInfo('New spaces take ~90 seconds to provision...');

  const isReady = await waitForSpace(spaceId);

  if (!isReady) {
    logError('Space provisioning timed out.');
    log('You can check status later with: npx decoupled-cli@latest spaces show ' + spaceId, 'yellow');

    const shouldContinue = await confirm('Continue anyway?', false);
    if (!shouldContinue) {
      process.exit(1);
    }
  }

  // Step 4: Configure Drupal environment
  logStep(currentStep++, totalSteps, 'Configuring Drupal environment');

  log('\nFetching Drupal credentials...', 'dim');
  await runCommand('npx', ['decoupled-cli@latest', 'spaces', 'env', String(spaceId), '--write', '.env.local']);

  // Reload env vars after CLI writes them
  envVars = readEnvFile(envPath);
  logSuccess('Drupal environment configured');

  // Step 5: Configure Stripe
  logStep(currentStep++, totalSteps, 'Configuring Stripe');

  console.log(`
${COLORS.yellow}To enable subscriptions, you need Stripe API keys.${COLORS.reset}

1. Go to ${COLORS.cyan}https://dashboard.stripe.com/apikeys${COLORS.reset}
2. Copy your ${COLORS.bright}Publishable key${COLORS.reset} (starts with pk_)
3. Copy your ${COLORS.bright}Secret key${COLORS.reset} (starts with sk_)
4. Create a product at ${COLORS.cyan}https://dashboard.stripe.com/products${COLORS.reset}
5. Copy the ${COLORS.bright}Price ID${COLORS.reset} (starts with price_)
`);

  const configureStripe = await confirm('Configure Stripe now?');

  if (configureStripe) {
    const publishableKey = await prompt('Stripe Publishable Key (pk_...)');
    const secretKey = await prompt('Stripe Secret Key (sk_...)');
    const priceId = await prompt('Stripe Price ID (price_...)');

    if (publishableKey) envVars['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'] = publishableKey;
    if (secretKey) envVars['STRIPE_SECRET_KEY'] = secretKey;
    if (priceId) envVars['STRIPE_PRICE_ID'] = priceId;

    writeEnvFile(envPath, envVars);
    logSuccess('Stripe configuration saved');
  } else {
    log('You can add Stripe keys later by editing .env.local', 'yellow');
  }

  // Step 6: Import content
  logStep(currentStep++, totalSteps, 'Importing content');

  const shouldImport = await confirm('Import sample articles?');

  if (shouldImport) {
    log('\nImporting content types and sample data...', 'dim');
    const importResult = await runCommand('npx', ['decoupled-cli@latest', 'content', 'import', '--file', 'data/subscription-content.json']);

    if (importResult.success) {
      logSuccess('Content imported successfully');
    } else {
      logError('Content import had issues. You can retry with:');
      log('  npx decoupled-cli@latest content import --file data/subscription-content.json', 'yellow');
    }
  } else {
    logInfo('Skipping content import');
  }

  // Done!
  const stripeConfigured = envVars['STRIPE_SECRET_KEY'] && envVars['STRIPE_PRICE_ID'];

  console.log(`
${COLORS.green}╔════════════════════════════════════════════════════╗
║                                                    ║
║                  Setup Complete!                   ║
║                                                    ║
╚════════════════════════════════════════════════════╝${COLORS.reset}

${COLORS.bright}Next steps:${COLORS.reset}

  1. Start the development server:
     ${COLORS.cyan}npm run dev${COLORS.reset}

  2. Open ${COLORS.cyan}http://localhost:3000${COLORS.reset} in your browser

  3. Access Drupal admin:
     ${COLORS.cyan}npx decoupled-cli@latest spaces login ${spaceId}${COLORS.reset}
${!stripeConfigured ? `
${COLORS.yellow}⚠️  Stripe is not fully configured.${COLORS.reset}
   Add your API keys to .env.local to enable subscriptions.
   See README.md for instructions.
` : `
  4. Test Stripe webhooks locally:
     ${COLORS.cyan}npm run stripe:listen${COLORS.reset}
`}
${COLORS.dim}Space ID: ${spaceId}${COLORS.reset}
${spaceUrl ? `${COLORS.dim}Drupal URL: ${spaceUrl}${COLORS.reset}` : ''}
`);
}

main().catch((error) => {
  logError(`Setup failed: ${error.message}`);
  process.exit(1);
});
