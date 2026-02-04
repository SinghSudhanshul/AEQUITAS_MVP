#!/usr/bin/env ts-node
/**
 * ============================================
 * AEQUITAS LV-COP DEPLOYMENT SCRIPT
 * Production Deployment Pipeline
 * ============================================
 * 
 * Supports deployment to:
 * - Vercel (primary)
 * - Railway (alternative)
 * - Custom server (Docker)
 * 
 * Usage: npx ts-node scripts/deploy.ts [--target=vercel|railway|docker]
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// ============================================
// CONFIGURATION
// ============================================

type DeployTarget = 'vercel' | 'railway' | 'docker';

interface DeployConfig {
  target: DeployTarget;
  production: boolean;
  skipBuild: boolean;
  dryRun: boolean;
}

const DEFAULT_CONFIG: DeployConfig = {
  target: 'vercel',
  production: true,
  skipBuild: false,
  dryRun: false,
};

// ============================================
// PERSONA QUOTES
// ============================================

const HARVEY_QUOTES = {
  START: "We're going to war. Every deployment is a closing argument.",
  VERCEL: "Vercel. Fast. Reliable. Like my closing statements.",
  RAILWAY: "Railway. Old school. I can respect that.",
  DOCKER: "Docker. We're doing this the hard way. I like it.",
  SUCCESS: "Done. Now go make me some money.",
  FAIL: "What did I say about being prepared? Fix it.",
};

const DONNA_QUOTES = {
  CHECKING: "Let me check if everything's in order first.",
  ENV_READY: "Environment variables are configured. You're welcome.",
  DEPLOYING: "Deploying now. I'll let you know when it's live.",
  SUCCESS: "It's live. I already updated the team.",
};

// ============================================
// UTILITIES
// ============================================

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bgGreen: '\x1b[42m',
  bgRed: '\x1b[41m',
  bgBlue: '\x1b[44m',
  white: '\x1b[37m',
};

function log(message: string, type: 'info' | 'success' | 'warning' | 'error' | 'persona' = 'info'): void {
  const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
  const prefix = `[${timestamp}]`;

  const styles: Record<typeof type, string> = {
    info: `${colors.blue}ℹ${colors.reset}`,
    success: `${colors.green}✓${colors.reset}`,
    warning: `${colors.yellow}⚠${colors.reset}`,
    error: `${colors.red}✗${colors.reset}`,
    persona: `${colors.magenta}🎭${colors.reset}`,
  };

  console.log(`${colors.dim}${prefix}${colors.reset} ${styles[type]} ${message}`);
}

function harvey(quote: string): void {
  log(`${colors.blue}HARVEY:${colors.reset} "${quote}"`, 'persona');
}

function donna(quote: string): void {
  log(`${colors.magenta}DONNA:${colors.reset} "${quote}"`, 'persona');
}

function runCommand(command: string, silent: boolean = false): string {
  try {
    const result = execSync(command, {
      encoding: 'utf-8',
      stdio: silent ? 'pipe' : 'inherit',
      cwd: path.resolve(__dirname, '..'),
    });
    return result || '';
  } catch (error) {
    throw error;
  }
}

function checkCommand(command: string): boolean {
  try {
    execSync(`which ${command}`, { encoding: 'utf-8', stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// ============================================
// ENVIRONMENT VALIDATION
// ============================================

interface EnvValidation {
  key: string;
  required: boolean;
  description: string;
}

const REQUIRED_ENV: Record<DeployTarget, EnvValidation[]> = {
  vercel: [
    { key: 'VERCEL_TOKEN', required: true, description: 'Vercel deployment token' },
    { key: 'VITE_API_URL', required: true, description: 'Backend API URL' },
    { key: 'VITE_WS_URL', required: false, description: 'WebSocket URL' },
    { key: 'VITE_APP_URL', required: false, description: 'Frontend app URL' },
  ],
  railway: [
    { key: 'RAILWAY_TOKEN', required: true, description: 'Railway CLI token' },
    { key: 'VITE_API_URL', required: true, description: 'Backend API URL' },
  ],
  docker: [
    { key: 'DOCKER_REGISTRY', required: true, description: 'Docker registry URL' },
    { key: 'DOCKER_USERNAME', required: false, description: 'Docker registry username' },
    { key: 'DOCKER_PASSWORD', required: false, description: 'Docker registry password' },
    { key: 'VITE_API_URL', required: true, description: 'Backend API URL' },
  ],
};

function validateEnvironment(target: DeployTarget): boolean {
  donna(DONNA_QUOTES.CHECKING);

  const envVars = REQUIRED_ENV[target];
  let valid = true;
  const missing: string[] = [];
  const present: string[] = [];

  for (const env of envVars) {
    const value = process.env[env.key];
    if (env.required && !value) {
      missing.push(`${env.key}: ${env.description}`);
      valid = false;
    } else if (value) {
      present.push(env.key);
    }
  }

  if (present.length > 0) {
    log(`Found environment variables: ${present.join(', ')}`, 'success');
  }

  if (missing.length > 0) {
    log('Missing required environment variables:', 'error');
    for (const m of missing) {
      console.log(`   ${colors.red}•${colors.reset} ${m}`);
    }
    return false;
  }

  donna(DONNA_QUOTES.ENV_READY);
  return valid;
}

// ============================================
// DEPLOYMENT TARGETS
// ============================================

async function deployToVercel(config: DeployConfig): Promise<boolean> {
  harvey(HARVEY_QUOTES.VERCEL);

  // Check Vercel CLI
  if (!checkCommand('vercel')) {
    log('Vercel CLI not installed. Installing...', 'info');
    runCommand('npm install -g vercel');
  }

  // Generate vercel.json if not exists
  const vercelConfigPath = path.resolve(__dirname, '..', 'vercel.json');
  if (!fs.existsSync(vercelConfigPath)) {
    const vercelConfig = {
      version: 2,
      name: 'aequitas-frontend',
      builds: [
        {
          src: 'package.json',
          use: '@vercel/static-build',
          config: {
            distDir: 'dist',
          },
        },
      ],
      routes: [
        {
          handle: 'filesystem',
        },
        {
          src: '/(.*)',
          dest: '/index.html',
        },
      ],
      env: {
        VITE_API_URL: process.env.VITE_API_URL || '',
        VITE_WS_URL: process.env.VITE_WS_URL || '',
        VITE_APP_URL: process.env.VITE_APP_URL || '',
      },
      headers: [
        {
          source: '/(.*)',
          headers: [
            { key: 'X-Content-Type-Options', value: 'nosniff' },
            { key: 'X-Frame-Options', value: 'DENY' },
            { key: 'X-XSS-Protection', value: '1; mode=block' },
            { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          ],
        },
        {
          source: '/assets/(.*)',
          headers: [
            { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
          ],
        },
      ],
    };

    fs.writeFileSync(vercelConfigPath, JSON.stringify(vercelConfig, null, 2));
    log('Generated vercel.json', 'success');
  }

  donna(DONNA_QUOTES.DEPLOYING);

  const prodFlag = config.production ? '--prod' : '';
  const dryRunFlag = config.dryRun ? '--confirm' : '-y';

  try {
    runCommand(`vercel ${prodFlag} ${dryRunFlag}`);
    return true;
  } catch (error) {
    log('Vercel deployment failed', 'error');
    return false;
  }
}

async function deployToRailway(config: DeployConfig): Promise<boolean> {
  harvey(HARVEY_QUOTES.RAILWAY);

  // Check Railway CLI
  if (!checkCommand('railway')) {
    log('Railway CLI not installed. Installing...', 'info');
    runCommand('npm install -g @railway/cli');
  }

  donna(DONNA_QUOTES.DEPLOYING);

  try {
    runCommand('railway up');
    return true;
  } catch (error) {
    log('Railway deployment failed', 'error');
    return false;
  }
}

async function deployToDocker(config: DeployConfig): Promise<boolean> {
  harvey(HARVEY_QUOTES.DOCKER);

  // Check Docker
  if (!checkCommand('docker')) {
    log('Docker not installed', 'error');
    return false;
  }

  const registry = process.env.DOCKER_REGISTRY || 'ghcr.io';
  const imageName = 'aequitas/frontend';
  const tag = config.production ? 'latest' : 'staging';
  const fullImage = `${registry}/${imageName}:${tag}`;

  log(`Building Docker image: ${fullImage}`, 'info');

  // Build image
  try {
    runCommand(`docker build -t ${fullImage} .`);
    log('Docker image built', 'success');
  } catch (error) {
    log('Docker build failed', 'error');
    return false;
  }

  donna(DONNA_QUOTES.DEPLOYING);

  // Push image
  try {
    // Login if credentials provided
    if (process.env.DOCKER_USERNAME && process.env.DOCKER_PASSWORD) {
      runCommand(`echo ${process.env.DOCKER_PASSWORD} | docker login ${registry} -u ${process.env.DOCKER_USERNAME} --password-stdin`, true);
    }

    if (!config.dryRun) {
      runCommand(`docker push ${fullImage}`);
      log(`Image pushed: ${fullImage}`, 'success');
    } else {
      log(`[DRY RUN] Would push: ${fullImage}`, 'info');
    }

    return true;
  } catch (error) {
    log('Docker push failed', 'error');
    return false;
  }
}

// ============================================
// PRE-DEPLOYMENT CHECKS
// ============================================

async function preDeployChecks(config: DeployConfig): Promise<boolean> {
  log('Running pre-deployment checks...', 'info');

  // Check if dist folder exists
  const distPath = path.resolve(__dirname, '..', 'dist');
  if (!fs.existsSync(distPath)) {
    if (config.skipBuild) {
      log('Distribution folder not found. Run build first.', 'error');
      return false;
    }

    log('Distribution folder not found. Building...', 'warning');
    try {
      runCommand('npx ts-node scripts/build.ts');
    } catch {
      log('Build failed', 'error');
      return false;
    }
  } else {
    log('Distribution folder found', 'success');
  }

  // Check index.html exists
  const indexPath = path.join(distPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    log('index.html not found in dist folder', 'error');
    return false;
  }

  // Check git status
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf-8', cwd: path.resolve(__dirname, '..') });
    if (status.trim() && config.production) {
      log('Uncommitted changes detected. Commit before production deploy.', 'warning');
      // Don't fail, just warn
    }
  } catch {
    // Git not available, skip check
  }

  log('Pre-deployment checks passed', 'success');
  return true;
}

// ============================================
// POST-DEPLOYMENT ACTIONS
// ============================================

async function postDeployActions(config: DeployConfig, deployUrl?: string): Promise<void> {
  log('Running post-deployment actions...', 'info');

  // Log deployment to file
  const deployLog = path.resolve(__dirname, '..', 'deploy.log');
  const logEntry = {
    timestamp: new Date().toISOString(),
    target: config.target,
    production: config.production,
    url: deployUrl,
    git: {
      commit: '',
      branch: '',
    },
  };

  try {
    logEntry.git.commit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim().slice(0, 7);
    logEntry.git.branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
  } catch {
    // Git info not available
  }

  let existingLogs: typeof logEntry[] = [];
  if (fs.existsSync(deployLog)) {
    try {
      existingLogs = JSON.parse(fs.readFileSync(deployLog, 'utf-8'));
    } catch {
      existingLogs = [];
    }
  }

  existingLogs.unshift(logEntry);
  // Keep only last 50 deployments
  existingLogs = existingLogs.slice(0, 50);

  fs.writeFileSync(deployLog, JSON.stringify(existingLogs, null, 2));
  log('Deployment logged', 'success');

  // Generate deployment summary
  console.log();
  console.log(colors.bright + '📋 Deployment Summary' + colors.reset);
  console.log('─'.repeat(50));
  console.log(`Target:     ${colors.cyan}${config.target}${colors.reset}`);
  console.log(`Production: ${config.production ? colors.green + 'Yes' : colors.yellow + 'No'}${colors.reset}`);
  console.log(`Commit:     ${logEntry.git.commit || 'N/A'}`);
  console.log(`Branch:     ${logEntry.git.branch || 'N/A'}`);
  if (deployUrl) {
    console.log(`URL:        ${colors.cyan}${deployUrl}${colors.reset}`);
  }
  console.log('─'.repeat(50));
}

// ============================================
// MAIN DEPLOY FUNCTION
// ============================================

async function deploy(): Promise<void> {
  const startTime = Date.now();

  // Parse arguments
  const args = process.argv.slice(2);
  const config: DeployConfig = { ...DEFAULT_CONFIG };

  for (const arg of args) {
    if (arg.startsWith('--target=')) {
      const target = arg.split('=')[1] as DeployTarget;
      if (['vercel', 'railway', 'docker'].includes(target)) {
        config.target = target;
      }
    }
    if (arg === '--staging') config.production = false;
    if (arg === '--skip-build') config.skipBuild = true;
    if (arg === '--dry-run') config.dryRun = true;
  }

  // Header
  console.log();
  console.log(colors.bgBlue + colors.white + colors.bright);
  console.log('  ╔═══════════════════════════════════════════════════════════╗  ');
  console.log('  ║                                                           ║  ');
  console.log('  ║    AEQUITAS LV-COP DEPLOYMENT                            ║  ');
  console.log('  ║    Ship It Like Harvey                                    ║  ');
  console.log('  ║                                                           ║  ');
  console.log('  ╚═══════════════════════════════════════════════════════════╝  ');
  console.log(colors.reset);
  console.log();

  harvey(HARVEY_QUOTES.START);
  console.log();

  log(`Target: ${colors.bright}${config.target}${colors.reset}`, 'info');
  log(`Production: ${config.production}`, 'info');
  if (config.dryRun) log('Dry run mode enabled', 'warning');
  console.log();

  // Validate environment
  if (!validateEnvironment(config.target)) {
    harvey(HARVEY_QUOTES.FAIL);
    process.exit(1);
  }
  console.log();

  // Pre-deploy checks
  if (!(await preDeployChecks(config))) {
    harvey(HARVEY_QUOTES.FAIL);
    process.exit(1);
  }
  console.log();

  // Deploy
  let success = false;

  switch (config.target) {
    case 'vercel':
      success = await deployToVercel(config);
      break;
    case 'railway':
      success = await deployToRailway(config);
      break;
    case 'docker':
      success = await deployToDocker(config);
      break;
  }

  console.log();

  // Summary
  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

  if (success) {
    harvey(HARVEY_QUOTES.SUCCESS);
    donna(DONNA_QUOTES.SUCCESS);
    console.log();
    log(`${colors.bgGreen}${colors.white} DEPLOYMENT SUCCESSFUL ${colors.reset} in ${totalDuration}s`, 'success');

    await postDeployActions(config);
    process.exit(0);
  } else {
    harvey(HARVEY_QUOTES.FAIL);
    console.log();
    log(`${colors.bgRed}${colors.white} DEPLOYMENT FAILED ${colors.reset} after ${totalDuration}s`, 'error');
    process.exit(1);
  }
}

// ============================================
// EXECUTE
// ============================================

deploy().catch((error) => {
  console.error('Unexpected deployment error:', error);
  process.exit(1);
});
