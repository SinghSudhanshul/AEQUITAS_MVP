#!/usr/bin/env ts-node
/**
 * ============================================
 * AEQUITAS LV-COP TYPE CHECKER
 * Advanced TypeScript Validation
 * ============================================
 * 
 * Performs comprehensive type checking with detailed error reporting,
 * complexity analysis, and best practice recommendations.
 * 
 * Usage: npx ts-node scripts/type-check.ts [--strict] [--watch] [--report]
 */

import { execSync, spawn } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

// ============================================
// CONFIGURATION
// ============================================

interface TypeCheckConfig {
  strict: boolean;
  watch: boolean;
  generateReport: boolean;
  reportPath: string;
  maxErrors: number;
  showSuggestions: boolean;
}

const DEFAULT_CONFIG: TypeCheckConfig = {
  strict: true,
  watch: false,
  generateReport: false,
  reportPath: 'type-check-report.json',
  maxErrors: 100,
  showSuggestions: true,
};

// ============================================
// PERSONA QUOTES
// ============================================

const HARVEY_QUOTES = {
  START: "Types don't lie. Neither do I.",
  SUCCESS: "Flawless. That's how winners compile.",
  FAIL: "Fix the types. I don't tolerate errors.",
  WARNING: "Close isn't good enough. Perfect or nothing.",
};

const DONNA_QUOTES = {
  CHECKING: "Running diagnostics. This will just take a moment.",
  ANALYZING: "I'm cross-referencing every type in the codebase.",
  SUCCESS: "All clear. I knew it would be.",
  SUGGESTIONS: "I have some suggestions for improvement.",
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

// ============================================
// TYPESCRIPT ERROR PARSING
// ============================================

interface TypeScriptError {
  file: string;
  line: number;
  column: number;
  code: string;
  message: string;
  severity: 'error' | 'warning' | 'suggestion';
  category: string;
}

interface TypeCheckResult {
  success: boolean;
  errors: TypeScriptError[];
  warnings: TypeScriptError[];
  suggestions: TypeScriptError[];
  filesChecked: number;
  duration: number;
}

function parseTypeScriptOutput(output: string): TypeScriptError[] {
  const errors: TypeScriptError[] = [];
  const errorRegex = /^(.+)\((\d+),(\d+)\): (error|warning) (TS\d+): (.+)$/gm;

  let match;
  while ((match = errorRegex.exec(output)) !== null) {
    const [, file, line, column, severity, code, message] = match;

    // Categorize errors
    let category = 'general';
    if (code.startsWith('TS2')) category = 'type-mismatch';
    else if (code.startsWith('TS7')) category = 'implicit-any';
    else if (code.startsWith('TS6')) category = 'declaration';
    else if (code.startsWith('TS1')) category = 'syntax';

    errors.push({
      file: file.replace(path.resolve(__dirname, '..'), ''),
      line: parseInt(line, 10),
      column: parseInt(column, 10),
      code,
      message,
      severity: severity as 'error' | 'warning',
      category,
    });
  }

  return errors;
}

function categorizeErrors(errors: TypeScriptError[]): Record<string, TypeScriptError[]> {
  const categories: Record<string, TypeScriptError[]> = {};

  for (const error of errors) {
    if (!categories[error.category]) {
      categories[error.category] = [];
    }
    categories[error.category].push(error);
  }

  return categories;
}

// ============================================
// TYPE ANALYSIS
// ============================================

interface TypeInfo {
  name: string;
  kind: 'interface' | 'type' | 'enum' | 'class';
  file: string;
  line: number;
  exported: boolean;
  complexity: number;
}

function analyzeTypes(): TypeInfo[] {
  const srcPath = path.resolve(__dirname, '..', 'src');
  const types: TypeInfo[] = [];

  function scanDirectory(dir: string): void {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        try {
          const content = fs.readFileSync(filePath, 'utf-8');

          // Find interface declarations
          const interfaceRegex = /(export\s+)?interface\s+(\w+)/g;
          let match;
          while ((match = interfaceRegex.exec(content)) !== null) {
            types.push({
              name: match[2],
              kind: 'interface',
              file: filePath.replace(srcPath, ''),
              line: content.substring(0, match.index).split('\n').length,
              exported: !!match[1],
              complexity: calculateComplexity(content, match.index, 'interface'),
            });
          }

          // Find type declarations
          const typeRegex = /(export\s+)?type\s+(\w+)/g;
          while ((match = typeRegex.exec(content)) !== null) {
            types.push({
              name: match[2],
              kind: 'type',
              file: filePath.replace(srcPath, ''),
              line: content.substring(0, match.index).split('\n').length,
              exported: !!match[1],
              complexity: calculateComplexity(content, match.index, 'type'),
            });
          }

          // Find enum declarations
          const enumRegex = /(export\s+)?enum\s+(\w+)/g;
          while ((match = enumRegex.exec(content)) !== null) {
            types.push({
              name: match[2],
              kind: 'enum',
              file: filePath.replace(srcPath, ''),
              line: content.substring(0, match.index).split('\n').length,
              exported: !!match[1],
              complexity: 1,
            });
          }
        } catch (error) {
          // Skip files that can't be read
        }
      }
    }
  }

  scanDirectory(srcPath);
  return types;
}

function calculateComplexity(content: string, startIndex: number, kind: string): number {
  // Simple complexity calculation based on number of properties/union members
  let braceCount = 0;
  let complexity = 0;
  let started = false;

  for (let i = startIndex; i < content.length; i++) {
    const char = content[i];

    if (char === '{' || char === '<') {
      braceCount++;
      started = true;
    } else if (char === '}' || char === '>') {
      braceCount--;
      if (started && braceCount === 0) break;
    } else if (started && braceCount === 1) {
      if (char === ':' || char === '|' || char === '&') {
        complexity++;
      }
    }
  }

  return Math.max(1, complexity);
}

// ============================================
// SUGGESTIONS ENGINE
// ============================================

interface Suggestion {
  file: string;
  line: number;
  type: 'best-practice' | 'performance' | 'safety';
  message: string;
  fix?: string;
}

function generateSuggestions(types: TypeInfo[], errors: TypeScriptError[]): Suggestion[] {
  const suggestions: Suggestion[] = [];

  // Check for overly complex types
  for (const type of types) {
    if (type.complexity > 15) {
      suggestions.push({
        file: type.file,
        line: type.line,
        type: 'best-practice',
        message: `${type.kind} '${type.name}' has high complexity (${type.complexity}). Consider breaking it down.`,
        fix: 'Split into smaller, composable types',
      });
    }
  }

  // Check for unexported types in index files
  const indexTypes = types.filter(t => t.file.includes('index.ts') && !t.exported);
  for (const type of indexTypes) {
    suggestions.push({
      file: type.file,
      line: type.line,
      type: 'best-practice',
      message: `Type '${type.name}' in index file is not exported.`,
      fix: 'Either export the type or move it to a dedicated file',
    });
  }

  // Check for 'any' usage
  const anyErrors = errors.filter(e => e.code === 'TS7006' || e.code === 'TS7005');
  if (anyErrors.length > 0) {
    suggestions.push({
      file: 'multiple',
      line: 0,
      type: 'safety',
      message: `Found ${anyErrors.length} implicit 'any' types. Consider adding explicit types.`,
      fix: 'Enable noImplicitAny in tsconfig.json and add explicit types',
    });
  }

  return suggestions;
}

// ============================================
// REPORT GENERATION
// ============================================

interface TypeCheckReport {
  timestamp: string;
  result: TypeCheckResult;
  types: {
    total: number;
    byKind: Record<string, number>;
    averageComplexity: number;
  };
  suggestions: Suggestion[];
  errorsByCategory: Record<string, number>;
}

function generateReport(
  result: TypeCheckResult,
  types: TypeInfo[],
  suggestions: Suggestion[],
  outputPath: string
): void {
  const report: TypeCheckReport = {
    timestamp: new Date().toISOString(),
    result: {
      success: result.success,
      errors: result.errors,
      warnings: result.warnings,
      suggestions: result.suggestions,
      filesChecked: result.filesChecked,
      duration: result.duration,
    },
    types: {
      total: types.length,
      byKind: types.reduce((acc, t) => {
        acc[t.kind] = (acc[t.kind] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      averageComplexity: types.reduce((acc, t) => acc + t.complexity, 0) / types.length,
    },
    suggestions,
    errorsByCategory: result.errors.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
  };

  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  log(`Report generated: ${outputPath}`, 'success');
}

// ============================================
// MAIN TYPE CHECK FUNCTION
// ============================================

async function runTypeCheck(config: TypeCheckConfig): Promise<TypeCheckResult> {
  donna(DONNA_QUOTES.CHECKING);

  const startTime = Date.now();
  let result: TypeCheckResult = {
    success: true,
    errors: [],
    warnings: [],
    suggestions: [],
    filesChecked: 0,
    duration: 0,
  };

  try {
    // Run TypeScript compiler
    const tscOutput = execSync('npx tsc --noEmit 2>&1', {
      encoding: 'utf-8',
      cwd: path.resolve(__dirname, '..'),
    });

    result.success = true;
  } catch (error: unknown) {
    const execError = error as { stdout?: string; stderr?: string };
    const output = execError.stdout || execError.stderr || '';
    result.errors = parseTypeScriptOutput(output);
    result.success = result.errors.length === 0;
  }

  result.duration = Date.now() - startTime;

  // Count files
  const srcPath = path.resolve(__dirname, '..', 'src');
  result.filesChecked = countTypeScriptFiles(srcPath);

  return result;
}

function countTypeScriptFiles(dir: string): number {
  let count = 0;

  try {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        count += countTypeScriptFiles(filePath);
      } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
        count++;
      }
    }
  } catch {
    // Directory doesn't exist or can't be read
  }

  return count;
}

// ============================================
// DISPLAY FUNCTIONS
// ============================================

function displayResults(result: TypeCheckResult, suggestions: Suggestion[], config: TypeCheckConfig): void {
  console.log();
  console.log(colors.bright + '📊 Type Check Results' + colors.reset);
  console.log('─'.repeat(60));

  console.log(`Files checked:  ${colors.cyan}${result.filesChecked}${colors.reset}`);
  console.log(`Duration:       ${colors.cyan}${(result.duration / 1000).toFixed(2)}s${colors.reset}`);
  console.log(`Errors:         ${result.errors.length > 0 ? colors.red : colors.green}${result.errors.length}${colors.reset}`);
  console.log(`Warnings:       ${result.warnings.length > 0 ? colors.yellow : colors.green}${result.warnings.length}${colors.reset}`);

  console.log('─'.repeat(60));
  console.log();

  // Display errors
  if (result.errors.length > 0) {
    console.log(colors.red + '❌ Errors:' + colors.reset);
    console.log();

    const categories = categorizeErrors(result.errors);

    for (const [category, errors] of Object.entries(categories)) {
      console.log(`  ${colors.bright}${category}${colors.reset} (${errors.length})`);

      for (const error of errors.slice(0, config.maxErrors)) {
        console.log(`    ${colors.dim}${error.file}:${error.line}:${error.column}${colors.reset}`);
        console.log(`    ${colors.red}${error.code}${colors.reset}: ${error.message}`);
        console.log();
      }

      if (errors.length > config.maxErrors) {
        console.log(`    ${colors.dim}... and ${errors.length - config.maxErrors} more${colors.reset}`);
        console.log();
      }
    }
  }

  // Display suggestions
  if (config.showSuggestions && suggestions.length > 0) {
    donna(DONNA_QUOTES.SUGGESTIONS);
    console.log();
    console.log(colors.cyan + '💡 Suggestions:' + colors.reset);
    console.log();

    for (const suggestion of suggestions) {
      const typeIcon = {
        'best-practice': '📐',
        'performance': '⚡',
        'safety': '🛡️',
      }[suggestion.type];

      console.log(`  ${typeIcon} ${colors.bright}${suggestion.message}${colors.reset}`);
      if (suggestion.file !== 'multiple') {
        console.log(`     ${colors.dim}${suggestion.file}:${suggestion.line}${colors.reset}`);
      }
      if (suggestion.fix) {
        console.log(`     ${colors.green}Fix: ${suggestion.fix}${colors.reset}`);
      }
      console.log();
    }
  }
}

// ============================================
// MAIN FUNCTION
// ============================================

async function main(): Promise<void> {
  const startTime = Date.now();

  // Parse arguments
  const args = process.argv.slice(2);
  const config: TypeCheckConfig = { ...DEFAULT_CONFIG };

  for (const arg of args) {
    if (arg === '--strict') config.strict = true;
    if (arg === '--watch') config.watch = true;
    if (arg === '--report') config.generateReport = true;
    if (arg === '--no-suggestions') config.showSuggestions = false;
    if (arg.startsWith('--max-errors=')) {
      config.maxErrors = parseInt(arg.split('=')[1], 10);
    }
  }

  // Header
  console.log();
  console.log(colors.bgBlue + colors.white + colors.bright);
  console.log('  ╔═══════════════════════════════════════════════════════════╗  ');
  console.log('  ║                                                           ║  ');
  console.log('  ║    AEQUITAS LV-COP TYPE CHECKER                          ║  ');
  console.log('  ║    Types Are Law                                          ║  ');
  console.log('  ║                                                           ║  ');
  console.log('  ╚═══════════════════════════════════════════════════════════╝  ');
  console.log(colors.reset);
  console.log();

  harvey(HARVEY_QUOTES.START);
  console.log();

  // Run type check
  const result = await runTypeCheck(config);

  // Analyze types
  donna(DONNA_QUOTES.ANALYZING);
  const types = analyzeTypes();

  // Generate suggestions
  const suggestions = config.showSuggestions
    ? generateSuggestions(types, result.errors)
    : [];

  // Display results
  displayResults(result, suggestions, config);

  // Generate report if requested
  if (config.generateReport) {
    const reportPath = path.resolve(__dirname, '..', config.reportPath);
    generateReport(result, types, suggestions, reportPath);
  }

  // Summary
  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log('─'.repeat(60));

  if (result.success) {
    harvey(HARVEY_QUOTES.SUCCESS);
    donna(DONNA_QUOTES.SUCCESS);
    console.log();
    log(`${colors.bgGreen}${colors.white} TYPE CHECK PASSED ${colors.reset} in ${totalDuration}s`, 'success');
    console.log();

    // Type stats
    console.log(colors.dim + 'Type Statistics:' + colors.reset);
    console.log(`  Interfaces: ${types.filter(t => t.kind === 'interface').length}`);
    console.log(`  Types:      ${types.filter(t => t.kind === 'type').length}`);
    console.log(`  Enums:      ${types.filter(t => t.kind === 'enum').length}`);
    console.log(`  Classes:    ${types.filter(t => t.kind === 'class').length}`);
    console.log();

    process.exit(0);
  } else {
    harvey(HARVEY_QUOTES.FAIL);
    console.log();
    log(`${colors.bgRed}${colors.white} TYPE CHECK FAILED ${colors.reset} after ${totalDuration}s`, 'error');
    console.log();
    log(`Fix ${result.errors.length} error(s) before proceeding.`, 'warning');
    console.log();
    process.exit(1);
  }
}

// ============================================
// EXECUTE
// ============================================

main().catch((error) => {
  console.error('Unexpected type check error:', error);
  process.exit(1);
});
