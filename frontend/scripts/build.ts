#!/usr/bin/env ts-node
/**
 * ============================================
 * AEQUITAS LV-COP CUSTOM BUILD SCRIPT
 * Production-Ready Build Pipeline
 * ============================================
 * 
 * This script orchestrates the complete build process for the
 * Aequitas frontend, including type checking, linting, optimization,
 * and deployment preparation.
 * 
 * Usage: npx ts-node scripts/build.ts [--mode=production|staging]
 */

import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// ============================================
// CONFIGURATION
// ============================================

interface BuildConfig {
  mode: 'production' | 'staging' | 'development';
  outputDir: string;
  analyze: boolean;
  sourceMaps: boolean;
  minify: boolean;
  gzipThreshold: number; // bytes
  chunkSizeWarning: number; // KB
  lighthouse: {
    enabled: boolean;
    minPerformanceScore: number;
  };
}

const DEFAULT_CONFIG: BuildConfig = {
  mode: 'production',
  outputDir: 'dist',
  analyze: false,
  sourceMaps: false,
  minify: true,
  gzipThreshold: 2 * 1024 * 1024, // 2MB
  chunkSizeWarning: 500, // 500KB
  lighthouse: {
    enabled: true,
    minPerformanceScore: 90,
  },
};

// ============================================
// HARVEY/DONNA MOTIVATIONAL QUOTES
// ============================================

const HARVEY_QUOTES = {
  START: "Winners don't make excuses. Let's build.",
  SUCCESS: "That's what I do. I drink scotch and I build perfect applications.",
  FAIL: "I don't have dreams, I have goals. Fix it and try again.",
  TYPE_ERROR: "If you're not prepared, you lose. TypeScript doesn't lie.",
};

const DONNA_QUOTES = {
  START: "I already knew you'd start the build. Coffee's ready.",
  PREPROCESSING: "I've organized everything. You're welcome.",
  OPTIMIZING: "Making it faster than Harvey's closing rate.",
  SUCCESS: "Perfect, as I predicted.",
};

// ============================================
// UTILITY FUNCTIONS
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
  white: '\x1b[37m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
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

function getFileSize(filePath: string): number {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch {
    return 0;
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function calculateGzipSize(filePath: string): number {
  try {
    const result = execSync(`gzip -c "${filePath}" | wc -c`, { encoding: 'utf-8' });
    return parseInt(result.trim(), 10);
  } catch {
    return 0;
  }
}

// ============================================
// BUILD PHASES
// ============================================

interface BuildPhase {
  name: string;
  description: string;
  execute: (config: BuildConfig) => Promise<boolean>;
}

const phases: BuildPhase[] = [
  {
    name: 'Clean',
    description: 'Removing previous build artifacts',
    execute: async (config) => {
      log('Cleaning output directory...', 'info');
      const outputPath = path.resolve(__dirname, '..', config.outputDir);

      if (fs.existsSync(outputPath)) {
        fs.rmSync(outputPath, { recursive: true, force: true });
        log(`Removed ${outputPath}`, 'success');
      }

      // Clean TypeScript build cache
      const tsBuildInfo = path.resolve(__dirname, '..', 'tsconfig.tsbuildinfo');
      if (fs.existsSync(tsBuildInfo)) {
        fs.unlinkSync(tsBuildInfo);
      }

      return true;
    },
  },

  {
    name: 'TypeCheck',
    description: 'Validating TypeScript types',
    execute: async (config) => {
      donna(DONNA_QUOTES.PREPROCESSING);
      log('Running TypeScript compiler...', 'info');

      try {
        runCommand('npx tsc --noEmit', true);
        log('TypeScript validation passed', 'success');
        return true;
      } catch (error) {
        harvey(HARVEY_QUOTES.TYPE_ERROR);
        log('TypeScript errors detected', 'error');

        // Run again to show errors
        try {
          runCommand('npx tsc --noEmit');
        } catch {
          // Errors already printed
        }

        return false;
      }
    },
  },

  {
    name: 'Lint',
    description: 'Running ESLint for code quality',
    execute: async (config) => {
      log('Running ESLint...', 'info');

      try {
        runCommand('npx eslint src --ext .ts,.tsx --max-warnings 0', true);
        log('ESLint passed with no warnings', 'success');
        return true;
      } catch (error) {
        log('ESLint warnings or errors detected', 'warning');
        // Don't fail build on lint warnings in development
        if (config.mode === 'development') {
          return true;
        }

        // Show lint errors
        try {
          runCommand('npx eslint src --ext .ts,.tsx');
        } catch {
          // Errors already printed
        }

        return config.mode !== 'production';
      }
    },
  },

  {
    name: 'Build',
    description: 'Building production bundle with Vite',
    execute: async (config) => {
      donna(DONNA_QUOTES.OPTIMIZING);
      log(`Building for ${config.mode}...`, 'info');

      const modeFlag = config.mode === 'production' ? '' : `--mode ${config.mode}`;
      const sourceMapsFlag = config.sourceMaps ? '' : '--sourcemap false';

      try {
        runCommand(`npx vite build ${modeFlag} ${sourceMapsFlag}`);
        log('Vite build completed', 'success');
        return true;
      } catch (error) {
        harvey(HARVEY_QUOTES.FAIL);
        log('Build failed', 'error');
        return false;
      }
    },
  },

  {
    name: 'Analyze',
    description: 'Analyzing bundle size and composition',
    execute: async (config) => {
      log('Analyzing bundle...', 'info');

      const distPath = path.resolve(__dirname, '..', config.outputDir);
      const assetsPath = path.join(distPath, 'assets');

      if (!fs.existsSync(assetsPath)) {
        log('Assets directory not found', 'warning');
        return true;
      }

      const files = fs.readdirSync(assetsPath);
      let totalSize = 0;
      let totalGzipSize = 0;
      const chunks: { name: string; size: number; gzipSize: number }[] = [];

      for (const file of files) {
        const filePath = path.join(assetsPath, file);
        const size = getFileSize(filePath);
        const gzipSize = calculateGzipSize(filePath);

        totalSize += size;
        totalGzipSize += gzipSize;

        if (file.endsWith('.js') || file.endsWith('.css')) {
          chunks.push({ name: file, size, gzipSize });
        }
      }

      // Sort by size descending
      chunks.sort((a, b) => b.size - a.size);

      console.log('\n' + colors.bright + '📊 Bundle Analysis' + colors.reset);
      console.log('─'.repeat(60));

      for (const chunk of chunks) {
        const sizeStr = formatBytes(chunk.size).padStart(10);
        const gzipStr = formatBytes(chunk.gzipSize).padStart(10);
        const isLarge = chunk.size > config.chunkSizeWarning * 1024;
        const color = isLarge ? colors.yellow : colors.reset;

        console.log(`${color}${chunk.name.padEnd(35)} ${sizeStr} → ${gzipStr}${colors.reset}`);
      }

      console.log('─'.repeat(60));
      console.log(`${'Total'.padEnd(35)} ${formatBytes(totalSize).padStart(10)} → ${formatBytes(totalGzipSize).padStart(10)}`);
      console.log();

      // Check against thresholds
      if (totalGzipSize > config.gzipThreshold) {
        log(`Bundle size ${formatBytes(totalGzipSize)} exceeds threshold ${formatBytes(config.gzipThreshold)}`, 'error');
        return false;
      }

      log(`Bundle size ${formatBytes(totalGzipSize)} is within threshold`, 'success');
      return true;
    },
  },

  {
    name: 'GenerateMeta',
    description: 'Generating build metadata',
    execute: async (config) => {
      log('Generating build metadata...', 'info');

      const distPath = path.resolve(__dirname, '..', config.outputDir);
      const buildInfo = {
        buildTime: new Date().toISOString(),
        mode: config.mode,
        nodeVersion: process.version,
        platform: process.platform,
        commit: '',
        branch: '',
      };

      // Get git info
      try {
        buildInfo.commit = execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim().slice(0, 7);
        buildInfo.branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
      } catch {
        // Git info not available
      }

      const metaPath = path.join(distPath, 'build-info.json');
      fs.writeFileSync(metaPath, JSON.stringify(buildInfo, null, 2));

      log(`Build metadata written to ${metaPath}`, 'success');
      return true;
    },
  },

  {
    name: 'GenerateSitemap',
    description: 'Generating sitemap.xml for SEO',
    execute: async (config) => {
      log('Generating sitemap...', 'info');

      const distPath = path.resolve(__dirname, '..', config.outputDir);
      const baseUrl = process.env.VITE_APP_URL || 'https://aequitas.ai';

      const routes = [
        { path: '/', priority: '1.0', changefreq: 'daily' },
        { path: '/pricing', priority: '0.9', changefreq: 'weekly' },
        { path: '/features', priority: '0.9', changefreq: 'weekly' },
        { path: '/case-studies', priority: '0.8', changefreq: 'monthly' },
        { path: '/auth/login', priority: '0.7', changefreq: 'monthly' },
        { path: '/auth/signup', priority: '0.7', changefreq: 'monthly' },
      ];

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => `  <url>
    <loc>${baseUrl}${route.path}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

      const sitemapPath = path.join(distPath, 'sitemap.xml');
      fs.writeFileSync(sitemapPath, sitemap);

      log('Sitemap generated', 'success');
      return true;
    },
  },

  {
    name: 'VerifyAssets',
    description: 'Verifying all required assets exist',
    execute: async (config) => {
      log('Verifying assets...', 'info');

      const distPath = path.resolve(__dirname, '..', config.outputDir);

      const requiredFiles = [
        'index.html',
        'robots.txt',
      ];

      let allPresent = true;

      for (const file of requiredFiles) {
        const filePath = path.join(distPath, file);
        if (!fs.existsSync(filePath)) {
          log(`Missing required file: ${file}`, 'error');
          allPresent = false;
        }
      }

      if (allPresent) {
        log('All required assets present', 'success');
      }

      return allPresent;
    },
  },
];

// ============================================
// MAIN BUILD FUNCTION
// ============================================

async function build(): Promise<void> {
  const startTime = Date.now();

  // Parse arguments
  const args = process.argv.slice(2);
  const config: BuildConfig = { ...DEFAULT_CONFIG };

  for (const arg of args) {
    if (arg.startsWith('--mode=')) {
      const mode = arg.split('=')[1] as BuildConfig['mode'];
      if (['production', 'staging', 'development'].includes(mode)) {
        config.mode = mode;
      }
    }
    if (arg === '--analyze') config.analyze = true;
    if (arg === '--sourcemaps') config.sourceMaps = true;
  }

  // Header
  console.log();
  console.log(colors.bgBlue + colors.white + colors.bright);
  console.log('  ╔═══════════════════════════════════════════════════════════╗  ');
  console.log('  ║                                                           ║  ');
  console.log('  ║    AEQUITAS LV-COP BUILD SYSTEM                          ║  ');
  console.log('  ║    The Theater of Competence                              ║  ');
  console.log('  ║                                                           ║  ');
  console.log('  ╚═══════════════════════════════════════════════════════════╝  ');
  console.log(colors.reset);
  console.log();

  harvey(HARVEY_QUOTES.START);
  console.log();

  log(`Build mode: ${colors.bright}${config.mode}${colors.reset}`, 'info');
  log(`Output directory: ${config.outputDir}`, 'info');
  console.log();

  // Execute phases
  let success = true;

  for (let i = 0; i < phases.length; i++) {
    const phase = phases[i];
    const phaseNum = `[${i + 1}/${phases.length}]`;

    console.log(`${colors.cyan}${phaseNum}${colors.reset} ${colors.bright}${phase.name}${colors.reset} - ${phase.description}`);

    const phaseStart = Date.now();
    const result = await phase.execute(config);
    const phaseDuration = ((Date.now() - phaseStart) / 1000).toFixed(2);

    if (!result) {
      log(`Phase "${phase.name}" failed after ${phaseDuration}s`, 'error');
      success = false;
      break;
    }

    log(`Completed in ${phaseDuration}s`, 'success');
    console.log();
  }

  // Summary
  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('─'.repeat(60));

  if (success) {
    harvey(HARVEY_QUOTES.SUCCESS);
    donna(DONNA_QUOTES.SUCCESS);
    console.log();
    log(`${colors.bgGreen}${colors.white} BUILD SUCCESSFUL ${colors.reset} in ${totalDuration}s`, 'success');

    console.log();
    console.log(colors.dim + 'Deploy with:' + colors.reset);
    console.log(`  ${colors.cyan}npx ts-node scripts/deploy.ts${colors.reset}`);
    console.log();

    process.exit(0);
  } else {
    harvey(HARVEY_QUOTES.FAIL);
    console.log();
    log(`${colors.bgRed}${colors.white} BUILD FAILED ${colors.reset} after ${totalDuration}s`, 'error');
    process.exit(1);
  }
}

// ============================================
// EXECUTE
// ============================================

build().catch((error) => {
  console.error('Unexpected build error:', error);
  process.exit(1);
});
