#!/usr/bin/env node

/**
 * Enhanced Security Check for Thee Cigar Maestro
 * Comprehensive security scanning and validation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

class SecurityChecker {
  constructor() {
    this.results = {
      timestamp: new Date().toISOString(),
      overall: 'unknown',
      categories: {
        dependencies: { status: 'unknown', issues: [] },
        secrets: { status: 'unknown', issues: [] },
        headers: { status: 'unknown', issues: [] },
        permissions: { status: 'unknown', issues: [] },
        csp: { status: 'unknown', issues: [] },
        ssl: { status: 'unknown', issues: [] }
      },
      summary: {
        total: 0,
        passed: 0,
        failed: 0,
        warnings: 0
      }
    };
  }

  async run() {
    console.info('🛡️ Starting comprehensive security check...\n');
    
    try {
      await this.checkDependencyVulnerabilities();
      await this.scanForSecrets();
      await this.validateSecurityHeaders();
      await this.checkFilePermissions();
      await this.validateCSP();
      await this.checkSSLConfiguration();
      
      this.calculateOverallStatus();
      this.generateReport();
      
    } catch (error) {
      console.error('❌ Security check failed:', error.message);
      process.exit(1);
    }
  }

  async checkDependencyVulnerabilities() {
    console.info('🔍 Checking dependency vulnerabilities...');
    
    try {
      const auditResult = execSync('npm audit --json', { 
        encoding: 'utf8', 
        cwd: rootDir 
      });
      
      const audit = JSON.parse(auditResult);
      const vulnerabilities = audit.vulnerabilities || {};
      
      const highSeverity = Object.keys(vulnerabilities).filter(
        dep => vulnerabilities[dep].severity === 'high' || 
               vulnerabilities[dep].severity === 'critical'
      );
      
      if (highSeverity.length > 0) {
        this.results.categories.dependencies.status = 'failed';
        this.results.categories.dependencies.issues = highSeverity.map(dep => ({
          dependency: dep,
          severity: vulnerabilities[dep].severity,
          title: vulnerabilities[dep].title,
          url: vulnerabilities[dep].url
        }));
        this.results.summary.failed++;
      } else {
        this.results.categories.dependencies.status = 'passed';
        this.results.summary.passed++;
      }
      
    } catch (error) {
      this.results.categories.dependencies.status = 'warning';
      this.results.categories.dependencies.issues.push({
        error: 'Failed to run dependency audit',
        message: error.message
      });
      this.results.summary.warnings++;
    }
  }

  async scanForSecrets() {
    console.info('🔐 Scanning for hardcoded secrets...');
    
    const secretPatterns = [
      { name: 'API Keys', pattern: /api[_-]?key\s*[:=]\s*['"][^'"]{16,}['"]/ },
      { name: 'JWT Tokens', pattern: /jwt[_-]?token\s*[:=]\s*['"][^'"]{50,}['"]/ },
      { name: 'Database URLs', pattern: /(mongodb|postgres|mysql):\/\/[^\s]+/ },
      { name: 'Private Keys', pattern: /-----BEGIN\s+(RSA\s+)?PRIVATE\s+KEY-----/ },
      { name: 'OAuth Secrets', pattern: /client[_-]?secret\s*[:=]\s*['"][^'"]{16,}['"]/ },
      { name: 'Stripe Keys', pattern: /(sk|pk)_(test|live)_[0-9a-zA-Z]{24,}/ }
    ];
    
    const filesToCheck = this.getJavaScriptFiles();
    const foundSecrets = [];
    
    for (const file of filesToCheck) {
      const content = await fs.promises.readFile(file, 'utf8');
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        for (const pattern of secretPatterns) {
          if (pattern.pattern.test(line) && 
              !line.includes('placeholder') && 
              !line.includes('example') &&
              !line.includes('REPLACE_WITH')) {
            foundSecrets.push({
              file: path.relative(rootDir, file),
              line: i + 1,
              type: pattern.name,
              content: line.trim()
            });
          }
        }
      }
    }
    
    if (foundSecrets.length > 0) {
      this.results.categories.secrets.status = 'failed';
      this.results.categories.secrets.issues = foundSecrets;
      this.results.summary.failed++;
    } else {
      this.results.categories.secrets.status = 'passed';
      this.results.summary.passed++;
    }
  }

  async validateSecurityHeaders() {
    console.info('🛡️ Validating security headers...');
    
    const htmlFiles = this.getHTMLFiles();
    const missingHeaders = [];
    
    const requiredHeaders = [
      'Content-Security-Policy',
      'X-Frame-Options',
      'X-Content-Type-Options',
      'Strict-Transport-Security'
    ];
    
    for (const file of htmlFiles) {
      const content = await fs.promises.readFile(file, 'utf8');
      
      for (const header of requiredHeaders) {
        if (!content.includes(header)) {
          missingHeaders.push({
            file: path.relative(rootDir, file),
            header: header
          });
        }
      }
    }
    
    if (missingHeaders.length > 0) {
      this.results.categories.headers.status = 'warning';
      this.results.categories.headers.issues = missingHeaders;
      this.results.summary.warnings++;
    } else {
      this.results.categories.headers.status = 'passed';
      this.results.summary.passed++;
    }
  }

  async checkFilePermissions() {
    console.info('📋 Checking file permissions...');
    
    const sensitiveFiles = [
      'package.json',
      'package-lock.json',
      '.env',
      '.env.local',
      'deploy.sh'
    ];
    
    const permissionIssues = [];
    
    for (const file of sensitiveFiles) {
      const filePath = path.join(rootDir, file);
      
      try {
        const stats = await fs.promises.stat(filePath);
        const mode = stats.mode.toString(8);
        
        // Check for world-writable files
        if (mode.endsWith('2') || mode.endsWith('6') || mode.endsWith('7')) {
          permissionIssues.push({
            file: file,
            permissions: mode,
            issue: 'World-writable permissions detected'
          });
        }
        
      } catch (error) {
        // File doesn't exist, which is okay for optional files like .env
      }
    }
    
    if (permissionIssues.length > 0) {
      this.results.categories.permissions.status = 'failed';
      this.results.categories.permissions.issues = permissionIssues;
      this.results.summary.failed++;
    } else {
      this.results.categories.permissions.status = 'passed';
      this.results.summary.passed++;
    }
  }

  async validateCSP() {
    console.info('🔒 Validating Content Security Policy...');
    
    const htmlFiles = this.getHTMLFiles();
    const cspIssues = [];
    
    for (const file of htmlFiles) {
      const content = await fs.promises.readFile(file, 'utf8');
      
      // Check for CSP header
      const cspMatch = content.match(/Content-Security-Policy[^>]*content=['"]([^'"]+)['"]/);
      
      if (cspMatch) {
        const csp = cspMatch[1];
        
        // Check for unsafe directives
        if (csp.includes("'unsafe-inline'") || csp.includes("'unsafe-eval'")) {
          cspIssues.push({
            file: path.relative(rootDir, file),
            issue: 'Unsafe CSP directives detected',
            directive: csp
          });
        }
      } else {
        cspIssues.push({
          file: path.relative(rootDir, file),
          issue: 'No CSP header found'
        });
      }
    }
    
    if (cspIssues.length > 0) {
      this.results.categories.csp.status = 'warning';
      this.results.categories.csp.issues = cspIssues;
      this.results.summary.warnings++;
    } else {
      this.results.categories.csp.status = 'passed';
      this.results.summary.passed++;
    }
  }

  async checkSSLConfiguration() {
    console.info('🔐 Checking SSL configuration...');
    
    const configFiles = [
      'next.config.js',
      'vite.config.js',
      'server.js'
    ];
    
    const sslIssues = [];
    
    for (const file of configFiles) {
      const filePath = path.join(rootDir, file);
      
      try {
        const content = await fs.promises.readFile(filePath, 'utf8');
        
        // Check for HTTPS enforcement
        if (!content.includes('https') && !content.includes('secure: true')) {
          sslIssues.push({
            file: file,
            issue: 'No HTTPS enforcement detected'
          });
        }
        
      } catch (error) {
        // File doesn't exist
      }
    }
    
    if (sslIssues.length > 0) {
      this.results.categories.ssl.status = 'warning';
      this.results.categories.ssl.issues = sslIssues;
      this.results.summary.warnings++;
    } else {
      this.results.categories.ssl.status = 'passed';
      this.results.summary.passed++;
    }
  }

  calculateOverallStatus() {
    if (this.results.summary.failed > 0) {
      this.results.overall = 'failed';
    } else if (this.results.summary.warnings > 0) {
      this.results.overall = 'warning';
    } else {
      this.results.overall = 'passed';
    }
    
    this.results.summary.total = 
      this.results.summary.passed + 
      this.results.summary.failed + 
      this.results.summary.warnings;
  }

  generateReport() {
    console.info('\n📊 Security Check Results:');
    console.info('═'.repeat(50));
    
    console.info(`Overall Status: ${this.getStatusIcon(this.results.overall)} ${this.results.overall.toUpperCase()}`);
    console.info(`Total Checks: ${this.results.summary.total}`);
    console.info(`✅ Passed: ${this.results.summary.passed}`);
    console.info(`❌ Failed: ${this.results.summary.failed}`);
    console.info(`⚠️ Warnings: ${this.results.summary.warnings}`);
    
    console.info('\n📋 Category Details:');
    for (const [category, result] of Object.entries(this.results.categories)) {
      console.info(`${this.getStatusIcon(result.status)} ${category}: ${result.status}`);
      
      if (result.issues.length > 0) {
        result.issues.forEach(issue => {
          console.info(`   - ${JSON.stringify(issue)}`);
        });
      }
    }
    
    // Save detailed report
    const reportPath = path.join(rootDir, 'security-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.results, null, 2));
    console.info(`\n📄 Detailed report saved to: ${reportPath}`);
    
    // Exit with appropriate code
    if (this.results.overall === 'failed') {
      process.exit(1);
    }
  }

  getStatusIcon(status) {
    switch (status) {
      case 'passed': return '✅';
      case 'failed': return '❌';
      case 'warning': return '⚠️';
      default: return '❓';
    }
  }

  getJavaScriptFiles() {
    const files = [];
    
    const scanDirectory = (dir) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && 
            !item.startsWith('.') && 
            item !== 'node_modules' && 
            item !== 'dist') {
          scanDirectory(fullPath);
        } else if (stat.isFile() && 
                   (item.endsWith('.js') || 
                    item.endsWith('.ts') || 
                    item.endsWith('.json'))) {
          files.push(fullPath);
        }
      }
    };
    
    scanDirectory(rootDir);
    return files;
  }

  getHTMLFiles() {
    const files = [];
    
    const scanDirectory = (dir) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory() && 
            !item.startsWith('.') && 
            item !== 'node_modules' && 
            item !== 'dist') {
          scanDirectory(fullPath);
        } else if (stat.isFile() && item.endsWith('.html')) {
          files.push(fullPath);
        }
      }
    };
    
    scanDirectory(rootDir);
    return files;
  }
}

// Run security check if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const checker = new SecurityChecker();
  checker.run().catch(console.error);
}

export default SecurityChecker;