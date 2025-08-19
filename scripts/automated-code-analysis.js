#!/usr/bin/env node

/**
 * Automated Code Analysis for Thee Cigar Maestro
 * Comprehensive code quality, security, and dependency analysis with automated fixes
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Analysis configuration
const CONFIG = {
  autoFix: process.env.AUTO_FIX === 'true',
  securityLevel: process.env.SECURITY_LEVEL || 'moderate',
  maxIssues: parseInt(process.env.MAX_ISSUES) || 50,
  ignoredPatterns: [
    'node_modules/**',
    '.git/**',
    'dist/**',
    '.next/**',
    'coverage/**',
    '*.min.js',
    '*.bundle.js',
  ],
  securityRules: {
    maxDependencies: 100,
    maxDevDependencies: 50,
    maxFileSize: 1024 * 1024, // 1MB
    maxLineLength: 120,
    maxFunctionLength: 50,
    maxComplexity: 10,
  },
};

// Analysis results
const results = {
  timestamp: new Date().toISOString(),
  summary: {
    totalFiles: 0,
    analyzedFiles: 0,
    issues: 0,
    securityIssues: 0,
    qualityIssues: 0,
    performanceIssues: 0,
  },
  security: {
    vulnerabilities: [],
    outdatedPackages: [],
    licenseIssues: [],
    suspiciousPatterns: [],
  },
  quality: {
    lintingIssues: [],
    formattingIssues: [],
    complexityIssues: [],
    duplicationIssues: [],
  },
  dependencies: {
    outdated: [],
    unused: [],
    duplicate: [],
    security: [],
  },
  recommendations: [],
  fixes: [],
};

/**
 * Check if file should be ignored
 */
function shouldIgnoreFile(filePath) {
  return CONFIG.ignoredPatterns.some(pattern => {
    const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
    return regex.test(filePath);
  });
}

/**
 * Analyze dependencies
 */
async function analyzeDependencies() {
  console.info('📦 Analyzing dependencies...');

  try {
    // Check for outdated packages
    const outdatedOutput = execSync('npm outdated --json', { encoding: 'utf8', stdio: 'pipe' });
    const outdated = JSON.parse(outdatedOutput);

    results.dependencies.outdated = Object.keys(outdated).map(pkg => ({
      package: pkg,
      current: outdated[pkg].current,
      latest: outdated[pkg].latest,
      type: outdated[pkg].type,
    }));

    // Check for security vulnerabilities
    const auditOutput = execSync('npm audit --json', { encoding: 'utf8', stdio: 'pipe' });
    const audit = JSON.parse(auditOutput);

    if (audit.vulnerabilities) {
      results.dependencies.security = Object.keys(audit.vulnerabilities).map(pkg => ({
        package: pkg,
        severity: audit.vulnerabilities[pkg].severity,
        title: audit.vulnerabilities[pkg].title,
        recommendation: audit.vulnerabilities[pkg].recommendation,
      }));
    }

    // Check for unused dependencies
    try {
      const depcheckOutput = execSync('npx depcheck --json', { encoding: 'utf8', stdio: 'pipe' });
      const depcheck = JSON.parse(depcheckOutput);

      results.dependencies.unused = depcheck.dependencies || [];
      results.dependencies.duplicate = depcheck.duplicates || [];
    } catch (error) {
      console.warn('⚠️ Depcheck not available, skipping unused dependency analysis');
    }
  } catch (error) {
    console.error(`❌ Dependency analysis failed: ${error.message}`);
  }
}

/**
 * Security analysis
 */
async function analyzeSecurity() {
  console.info('🛡️ Running security analysis...');

  const securityPatterns = [
    {
      pattern: /(api_key|apiKey|secret|password|token)\s*[:=]\s*['"`][^'"`]+['"`]/gi,
      severity: 'high',
      description: 'Hardcoded credentials detected',
    },
    {
      pattern: /console\.(log|warn|error|info)\(/gi,
      severity: 'medium',
      description: 'Console statements in production code',
    },
    {
      pattern: /eval\(/gi,
      severity: 'high',
      description: 'Use of eval() function',
    },
    {
      pattern: /innerHTML\s*=/gi,
      severity: 'medium',
      description: 'Potential XSS vulnerability with innerHTML',
    },
    {
      pattern: /document\.write\(/gi,
      severity: 'high',
      description: 'Use of document.write()',
    },
  ];

  const files = getAllFiles(rootDir);

  for (const file of files) {
    if (shouldIgnoreFile(file) || !isTextFile(file)) continue;

    try {
      const content = fs.readFileSync(file, 'utf8');
      const relativePath = path.relative(rootDir, file);

      securityPatterns.forEach(({ pattern, severity, description }) => {
        const matches = content.match(pattern);
        if (matches) {
          results.security.suspiciousPatterns.push({
            file: relativePath,
            pattern: description,
            severity,
            count: matches.length,
            lines: getLineNumbers(content, pattern),
          });
        }
      });
    } catch (error) {
      console.warn(`⚠️ Could not read file ${file}: ${error.message}`);
    }
  }
}

/**
 * Code quality analysis
 */
async function analyzeCodeQuality() {
  console.info('🔍 Running code quality analysis...');

  try {
    // Run ESLint
    try {
      const eslintOutput = execSync('npm run lint -- --format json', {
        encoding: 'utf8',
        stdio: 'pipe',
      });
      const eslintResults = JSON.parse(eslintOutput);

      eslintResults.forEach(result => {
        result.messages.forEach(message => {
          results.quality.lintingIssues.push({
            file: result.filePath,
            line: message.line,
            column: message.column,
            severity: message.severity,
            message: message.message,
            rule: message.ruleId,
          });
        });
      });
    } catch (error) {
      console.warn('⚠️ ESLint analysis failed, continuing...');
    }

    // Run Prettier check
    try {
      const prettierOutput = execSync(
        'npx prettier --check --list-different "**/*.{js,jsx,ts,tsx,json,css,md}"',
        { encoding: 'utf8', stdio: 'pipe' }
      );
      const files = prettierOutput.trim().split('\n').filter(Boolean);

      files.forEach(file => {
        results.quality.formattingIssues.push({
          file,
          issue: 'Code formatting does not match Prettier standards',
        });
      });
    } catch (error) {
      // Prettier check failed, which means files are not formatted
      console.warn('⚠️ Prettier check failed, files need formatting');
    }

    // Analyze code complexity
    analyzeComplexity();
  } catch (error) {
    console.error(`❌ Code quality analysis failed: ${error.message}`);
  }
}

/**
 * Analyze code complexity
 */
function analyzeComplexity() {
  const files = getAllFiles(rootDir).filter(
    file =>
      file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')
  );

  for (const file of files) {
    if (shouldIgnoreFile(file)) continue;

    try {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      const relativePath = path.relative(rootDir, file);

      // Check line length
      lines.forEach((line, index) => {
        if (line.length > CONFIG.securityRules.maxLineLength) {
          results.quality.complexityIssues.push({
            file: relativePath,
            line: index + 1,
            issue: `Line length (${line.length}) exceeds maximum (${CONFIG.securityRules.maxLineLength})`,
            severity: 'medium',
          });
        }
      });

      // Check function length (simple heuristic)
      const functionMatches = content.match(/function\s+\w+\s*\([^)]*\)\s*\{/g);
      if (functionMatches) {
        // This is a simplified check - in a real implementation you'd use a proper parser
        results.quality.complexityIssues.push({
          file: relativePath,
          issue: `Found ${functionMatches.length} functions - consider breaking down large functions`,
          severity: 'low',
        });
      }
    } catch (error) {
      console.warn(`⚠️ Could not analyze complexity for ${file}: ${error.message}`);
    }
  }
}

/**
 * Generate recommendations
 */
function generateRecommendations() {
  const recommendations = [];

  // Security recommendations
  if (results.dependencies.security.length > 0) {
    recommendations.push({
      category: 'Security',
      priority: 'high',
      message: `Found ${results.dependencies.security.length} security vulnerabilities in dependencies. Run 'npm audit fix' to resolve.`,
    });
  }

  if (results.security.suspiciousPatterns.length > 0) {
    const highSeverity = results.security.suspiciousPatterns.filter(p => p.severity === 'high');
    if (highSeverity.length > 0) {
      recommendations.push({
        category: 'Security',
        priority: 'high',
        message: `Found ${highSeverity.length} high-severity security issues. Review and fix immediately.`,
      });
    }
  }

  // Quality recommendations
  if (results.quality.lintingIssues.length > 0) {
    recommendations.push({
      category: 'Code Quality',
      priority: 'medium',
      message: `Found ${results.quality.lintingIssues.length} linting issues. Run 'npm run lint --fix' to auto-fix.`,
    });
  }

  if (results.quality.formattingIssues.length > 0) {
    recommendations.push({
      category: 'Code Quality',
      priority: 'low',
      message: `Found ${results.quality.formattingIssues.length} formatting issues. Run 'npx prettier --write' to fix.`,
    });
  }

  // Dependency recommendations
  if (results.dependencies.outdated.length > 0) {
    recommendations.push({
      category: 'Dependencies',
      priority: 'medium',
      message: `Found ${results.dependencies.outdated.length} outdated packages. Consider updating for security and features.`,
    });
  }

  if (results.dependencies.unused.length > 0) {
    recommendations.push({
      category: 'Dependencies',
      priority: 'low',
      message: `Found ${results.dependencies.unused.length} unused dependencies. Consider removing to reduce bundle size.`,
    });
  }

  results.recommendations = recommendations;
}

/**
 * Apply automated fixes
 */
async function applyFixes() {
  if (!CONFIG.autoFix) {
    console.info('🔧 Auto-fix disabled. Run with AUTO_FIX=true to apply fixes automatically.');
    return;
  }

  console.info('🔧 Applying automated fixes...');

  try {
    // Fix linting issues
    if (results.quality.lintingIssues.length > 0) {
      console.info('🔧 Fixing linting issues...');
      execSync('npm run lint -- --fix', { stdio: 'inherit' });
      results.fixes.push('Linting issues auto-fixed');
    }

    // Fix formatting issues
    if (results.quality.formattingIssues.length > 0) {
      console.info('🔧 Fixing formatting issues...');
      execSync('npx prettier --write "**/*.{js,jsx,ts,tsx,json,css,md}"', { stdio: 'inherit' });
      results.fixes.push('Formatting issues auto-fixed');
    }

    // Fix security vulnerabilities
    if (results.dependencies.security.length > 0) {
      console.info('🔧 Fixing security vulnerabilities...');
      execSync('npm audit fix', { stdio: 'inherit' });
      results.fixes.push('Security vulnerabilities auto-fixed');
    }
  } catch (error) {
    console.error(`❌ Auto-fix failed: ${error.message}`);
  }
}

/**
 * Generate analysis report
 */
function generateReport() {
  // Calculate summary
  results.summary.totalFiles = getAllFiles(rootDir).length;
  results.summary.analyzedFiles = getAllFiles(rootDir).filter(f => !shouldIgnoreFile(f)).length;
  results.summary.issues =
    results.quality.lintingIssues.length +
    results.quality.formattingIssues.length +
    results.quality.complexityIssues.length +
    results.security.suspiciousPatterns.length +
    results.dependencies.security.length;

  results.summary.securityIssues =
    results.security.suspiciousPatterns.length + results.dependencies.security.length;

  results.summary.qualityIssues =
    results.quality.lintingIssues.length +
    results.quality.formattingIssues.length +
    results.quality.complexityIssues.length;

  const report = {
    timestamp: results.timestamp,
    config: CONFIG,
    summary: results.summary,
    security: results.security,
    quality: results.quality,
    dependencies: results.dependencies,
    recommendations: results.recommendations,
    fixes: results.fixes,
  };

  const reportPath = path.join(rootDir, 'code-analysis-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.info(`📊 Code analysis report saved to: ${reportPath}`);

  // Print summary
  console.info('\n📋 Code Analysis Summary:');
  console.info('═'.repeat(50));
  console.info(`Files Analyzed: ${results.summary.analyzedFiles}/${results.summary.totalFiles}`);
  console.info(`Total Issues: ${results.summary.issues}`);
  console.info(`Security Issues: ${results.summary.securityIssues}`);
  console.info(`Quality Issues: ${results.summary.qualityIssues}`);
  console.info('');

  if (results.recommendations.length > 0) {
    console.info('🎯 Recommendations:');
    results.recommendations.forEach((rec, index) => {
      console.info(`${index + 1}. [${rec.priority.toUpperCase()}] ${rec.category}: ${rec.message}`);
    });
  }

  if (results.fixes.length > 0) {
    console.info('\n🔧 Applied Fixes:');
    results.fixes.forEach((fix, index) => {
      console.info(`${index + 1}. ✅ ${fix}`);
    });
  }
}

/**
 * Utility functions
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  try {
    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(fullPath);
      }
    });
  } catch (error) {
    // Directory doesn't exist or can't be read
  }

  return arrayOfFiles;
}

function isTextFile(filePath) {
  const textExtensions = ['.js', '.jsx', '.ts', '.tsx', '.json', '.md', '.css', '.html', '.txt'];
  return textExtensions.some(ext => filePath.endsWith(ext));
}

function getLineNumbers(content, pattern) {
  const lines = content.split('\n');
  const lineNumbers = [];

  lines.forEach((line, index) => {
    if (pattern.test(line)) {
      lineNumbers.push(index + 1);
    }
  });

  return lineNumbers;
}

/**
 * Main analysis runner
 */
async function runCodeAnalysis() {
  console.info('🚀 Starting Automated Code Analysis...');

  try {
    // Run all analyses
    await analyzeDependencies();
    await analyzeSecurity();
    await analyzeCodeQuality();

    // Generate recommendations
    generateRecommendations();

    // Apply fixes if enabled
    await applyFixes();

    // Generate report
    generateReport();

    // Exit with appropriate code
    const hasCriticalIssues = results.recommendations.some(r => r.priority === 'high');
    process.exit(hasCriticalIssues ? 1 : 0);
  } catch (error) {
    console.error(`❌ Code analysis failed: ${error.message}`);
    process.exit(1);
  }
}

// Run analysis if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runCodeAnalysis();
}

export { runCodeAnalysis, CONFIG };
