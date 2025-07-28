#!/usr/bin/env node

/**
 * Debug Automation Script
 * Automates debugging tasks, log generation, and health monitoring
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

class DebugAutomation {
  constructor() {
    this.debugLogPath = path.join(process.cwd(), 'DEBUG_LOG.md');
    this.timestamp = new Date().toISOString();
    this.errors = [];
    this.warnings = [];
    this.info = [];
  }

  /**
   * Main automation entry point
   */
  async run() {
    console.log('🔧 Starting Debug Automation...');
    
    try {
      // Collect system information
      await this.collectSystemInfo();
      
      // Run health checks
      await this.runHealthChecks();
      
      // Check build status
      await this.checkBuildStatus();
      
      // Analyze code quality
      await this.analyzeCodeQuality();
      
      // Check dependencies
      await this.checkDependencies();
      
      // Generate updated debug log
      await this.generateDebugLog();
      
      // Generate summary report
      this.generateSummaryReport();
      
    } catch (error) {
      this.errors.push(`Automation failed: ${error.message}`);
      console.error('❌ Debug automation failed:', error.message);
    }
  }

  /**
   * Collect system and environment information
   */
  async collectSystemInfo() {
    console.log('📊 Collecting system information...');
    
    try {
      const nodeVersion = process.version;
      const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
      const platform = process.platform;
      const arch = process.arch;
      
      this.info.push(`Node.js: ${nodeVersion}`);
      this.info.push(`NPM: ${npmVersion}`);
      this.info.push(`Platform: ${platform}-${arch}`);
      
      // Check if in git repository
      try {
        const gitBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
        const gitCommit = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
        this.info.push(`Git branch: ${gitBranch}`);
        this.info.push(`Git commit: ${gitCommit}`);
      } catch (e) {
        this.warnings.push('Not in a git repository or git not available');
      }
      
    } catch (error) {
      this.errors.push(`System info collection failed: ${error.message}`);
    }
  }

  /**
   * Run comprehensive health checks
   */
  async runHealthChecks() {
    console.log('🏥 Running health checks...');
    
    // Check if package.json exists and is valid
    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(packagePath)) {
        const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        this.info.push(`Project: ${packageJson.name} v${packageJson.version}`);
      } else {
        this.errors.push('package.json not found');
      }
    } catch (error) {
      this.errors.push(`Package.json validation failed: ${error.message}`);
    }

    // Check critical files
    const criticalFiles = [
      'index.html',
      'style.css',
      'vite.config.js',
      'eslint.config.js'
    ];

    criticalFiles.forEach(file => {
      if (fs.existsSync(file)) {
        this.info.push(`✅ ${file} exists`);
      } else {
        this.warnings.push(`⚠️ ${file} missing`);
      }
    });

    // Check scripts directory
    const scriptsDir = path.join(process.cwd(), 'scripts');
    if (fs.existsSync(scriptsDir)) {
      const scripts = fs.readdirSync(scriptsDir);
      this.info.push(`Scripts available: ${scripts.join(', ')}`);
    }
  }

  /**
   * Check build status and validate configuration
   */
  async checkBuildStatus() {
    console.log('🏗️ Checking build status...');
    
    try {
      // Test build command
      const buildOutput = execSync('npm run build', { 
        encoding: 'utf8',
        timeout: 30000 // 30 second timeout
      });
      
      this.info.push('✅ Build successful');
      
      // Check if dist directory was created
      if (fs.existsSync('dist')) {
        const distFiles = fs.readdirSync('dist');
        this.info.push(`Build output: ${distFiles.length} files generated`);
      }
      
    } catch (error) {
      this.errors.push(`Build failed: ${error.message}`);
    }
  }

  /**
   * Analyze code quality using linting and testing
   */
  async analyzeCodeQuality() {
    console.log('🧹 Analyzing code quality...');
    
    try {
      // Run linting
      const lintOutput = execSync('npm run lint', { 
        encoding: 'utf8',
        timeout: 20000
      });
      this.info.push('✅ Linting passed');
    } catch (error) {
      this.warnings.push(`Linting issues found: ${error.message}`);
    }

    try {
      // Run tests
      const testOutput = execSync('npm run test -- --run', { 
        encoding: 'utf8',
        timeout: 30000
      });
      this.info.push('✅ Tests passed');
    } catch (error) {
      this.warnings.push(`Test issues found: ${error.message}`);
    }
  }

  /**
   * Check dependency status and security
   */
  async checkDependencies() {
    console.log('📦 Checking dependencies...');
    
    try {
      // Check for security vulnerabilities
      const auditOutput = execSync('npm audit --audit-level=high', { 
        encoding: 'utf8',
        timeout: 15000
      });
      this.info.push('✅ No high-severity vulnerabilities found');
    } catch (error) {
      this.warnings.push(`Security vulnerabilities detected: ${error.message}`);
    }

    try {
      // Check for outdated packages
      const outdatedOutput = execSync('npm outdated --depth=0', { 
        encoding: 'utf8',
        timeout: 15000
      });
      if (outdatedOutput.trim()) {
        this.warnings.push('Some packages are outdated');
      } else {
        this.info.push('✅ All packages up to date');
      }
    } catch (error) {
      // npm outdated returns exit code 1 when packages are outdated
      this.warnings.push('Some packages may be outdated');
    }
  }

  /**
   * Generate or update the DEBUG_LOG.md file
   */
  async generateDebugLog() {
    console.log('📝 Generating debug log...');
    
    const logContent = this.createDebugLogContent();
    
    try {
      // If debug log exists, append to it, otherwise create new
      if (fs.existsSync(this.debugLogPath)) {
        const existingContent = fs.readFileSync(this.debugLogPath, 'utf8');
        const newContent = existingContent + '\n\n---\n\n' + logContent;
        fs.writeFileSync(this.debugLogPath, newContent);
        this.info.push('✅ Debug log updated');
      } else {
        fs.writeFileSync(this.debugLogPath, logContent);
        this.info.push('✅ Debug log created');
      }
    } catch (error) {
      this.errors.push(`Failed to write debug log: ${error.message}`);
    }
  }

  /**
   * Create the debug log content
   */
  createDebugLogContent() {
    const date = new Date().toISOString().split('T')[0];
    const time = new Date().toLocaleTimeString();
    
    return `# Automated Debug Report - ${date} ${time}

## System Information
${this.info.map(item => `- ${item}`).join('\n')}

## Warnings
${this.warnings.length > 0 ? this.warnings.map(item => `- ⚠️ ${item}`).join('\n') : '- ✅ No warnings'}

## Errors
${this.errors.length > 0 ? this.errors.map(item => `- ❌ ${item}`).join('\n') : '- ✅ No errors'}

## Summary
- **Status**: ${this.errors.length === 0 ? '✅ HEALTHY' : '❌ ISSUES DETECTED'}
- **Warnings**: ${this.warnings.length}
- **Errors**: ${this.errors.length}
- **Generated**: ${this.timestamp}

## Recommended Actions
${this.generateRecommendations()}

---
*Auto-generated by debug automation script*`;
  }

  /**
   * Generate recommendations based on findings
   */
  generateRecommendations() {
    const recommendations = [];
    
    if (this.errors.length > 0) {
      recommendations.push('🔴 **CRITICAL**: Fix all errors before proceeding');
    }
    
    if (this.warnings.length > 0) {
      recommendations.push('🟡 **WARNING**: Review and address warnings when possible');
    }
    
    if (this.warnings.some(w => w.includes('outdated'))) {
      recommendations.push('📦 Consider updating outdated packages: `npm update`');
    }
    
    if (this.warnings.some(w => w.includes('vulnerabilities'))) {
      recommendations.push('🔒 Review security vulnerabilities: `npm audit fix`');
    }
    
    if (this.errors.some(e => e.includes('Build failed'))) {
      recommendations.push('🏗️ Fix build configuration before deployment');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('🎉 **ALL GOOD**: System is healthy and ready for development');
    }
    
    return recommendations.map(rec => `- ${rec}`).join('\n');
  }

  /**
   * Generate a summary report to console
   */
  generateSummaryReport() {
    console.log('\n📋 Debug Automation Summary:');
    console.log(`   Timestamp: ${this.timestamp}`);
    console.log(`   Errors: ${this.errors.length}`);
    console.log(`   Warnings: ${this.warnings.length}`);
    console.log(`   Info: ${this.info.length}`);
    
    if (this.errors.length === 0) {
      console.log('✅ System is healthy!');
    } else {
      console.log('❌ Issues detected - check DEBUG_LOG.md for details');
    }
  }
}

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const debugAutomation = new DebugAutomation();
  debugAutomation.run().catch(console.error);
}

export default DebugAutomation;