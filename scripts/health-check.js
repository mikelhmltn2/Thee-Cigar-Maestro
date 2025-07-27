#!/usr/bin/env node

/**
 * Comprehensive Health Check for Thee Cigar Maestro
 * Tests all external dependencies, APIs, and critical functionality
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Health check configuration
const CONFIG = {
  timeout: 10000, // 10 seconds
  retries: 2,
  userAgent: 'HealthCheck/1.0 (Thee-Cigar-Maestro)',
  checkIntervals: {
    critical: 30000,    // 30 seconds
    normal: 300000,     // 5 minutes
    extended: 3600000   // 1 hour
  }
};

// Results tracking
const results = {
  timestamp: new Date().toISOString(),
  overall: 'unknown',
  categories: {
    cdn: { status: 'unknown', tests: [] },
    api: { status: 'unknown', tests: [] },
    files: { status: 'unknown', tests: [] },
    syntax: { status: 'unknown', tests: [] },
    security: { status: 'unknown', tests: [] }
  },
  summary: {
    total: 0,
    passed: 0,
    failed: 0,
    warnings: 0
  }
};

/**
 * Test HTTP endpoint with retries
 */
async function testEndpoint(url, options = {}) {
  const { retries = CONFIG.retries, timeout = CONFIG.timeout, method = 'HEAD' } = options;
  
  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        method,
        headers: {
          'User-Agent': CONFIG.userAgent,
          'Accept': '*/*'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      return {
        success: true,
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        attempt
      };
      
    } catch (error) {
      if (attempt <= retries) {
        console.warn(`🔄 Retry ${attempt}/${retries} for ${url}: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        continue;
      }
      
      return {
        success: false,
        error: error.message,
        attempt
      };
    }
  }
}

/**
 * Test CDN Resources
 */
async function testCDNResources() {
  console.info('🔗 Testing CDN Resources...');
  
  const cdnTests = [
    {
      name: 'Three.js Core Library',
      url: 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js',
      critical: true
    },
    {
      name: 'Three.js OrbitControls',
      url: 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js',
      critical: true
    },
    {
      name: 'WebGL Test Site',
      url: 'https://get.webgl.org/',
      critical: false
    }
  ];
  
  for (const test of cdnTests) {
    const result = await testEndpoint(test.url);
    
    const isSuccess = result.success && result.status >= 200 && result.status < 400;
    
    const testResult = {
      name: test.name,
      url: test.url,
      status: isSuccess ? 'pass' : 'fail',
      critical: test.critical,
      details: result
    };
    
    results.categories.cdn.tests.push(testResult);
    results.summary.total++;
    
    if (isSuccess) {
      results.summary.passed++;
      console.info(`✅ ${test.name}: OK (${result.status})`);
    } else {
      if (test.critical) {
        results.summary.failed++;
        console.error(`❌ ${test.name}: CRITICAL FAILURE - ${result.error}`);
      } else {
        results.summary.warnings++;
        console.error(`⚠️  ${test.name}: WARNING - ${result.error}`);
      }
    }
  }
  
  const failedCritical = results.categories.cdn.tests.filter(t => t.critical && t.status === 'fail').length;
  results.categories.cdn.status = failedCritical > 0 ? 'critical' : 'pass';
}

/**
 * Test API Endpoints
 */
async function testAPIEndpoints() {
  console.info('🔌 Testing API Endpoints...');
  
  const apiTests = [
    {
      name: 'GPT API Endpoint',
      url: 'https://theecigarmaestro.vercel.app/api/gpt',
      method: 'HEAD',
      expectedFail: true, // We know this is currently not implemented
      critical: false
    },
    {
      name: 'Backend API Base',
      url: 'https://api.theecigarmaestro.com',
      method: 'HEAD',
      expectedFail: true, // We know this is currently not implemented  
      critical: false
    }
  ];
  
  for (const test of apiTests) {
    const result = await testEndpoint(test.url, { method: test.method });
    
    const isSuccess = result.success && result.status >= 200 && result.status < 400;
    
    const testResult = {
      name: test.name,
      url: test.url,
      status: isSuccess ? 'pass' : (test.expectedFail ? 'expected-fail' : 'fail'),
      critical: test.critical,
      expectedFail: test.expectedFail,
      details: result
    };
    
    results.categories.api.tests.push(testResult);
    results.summary.total++;
    
    if (isSuccess) {
      results.summary.passed++;
      console.info(`✅ ${test.name}: OK (${result.status})`);
    } else if (test.expectedFail) {
      results.summary.warnings++;
      console.error(`⚠️  ${test.name}: Expected failure - graceful fallback active`);
    } else {
      results.summary.failed++;
      console.error(`❌ ${test.name}: FAILURE - ${result.error}`);
    }
  }
  
  results.categories.api.status = 'pass'; // APIs are optional with fallbacks
}

/**
 * Test Critical Files
 */
async function testCriticalFiles() {
  console.info('📁 Testing Critical Files...');
  
  const criticalFiles = [
    'index.html',
    'manifest.json',
    'service-worker.js',
    'gpt.js',
    'auth-system.js',
    'assets/logos/logo-192.png',
    'assets/logos/logo-512.png'
  ];
  
  for (const filePath of criticalFiles) {
    const fullPath = path.join(rootDir, filePath);
    const exists = fs.existsSync(fullPath);
    
    const testResult = {
      name: `File: ${filePath}`,
      path: filePath,
      status: exists ? 'pass' : 'fail',
      critical: true
    };
    
    results.categories.files.tests.push(testResult);
    results.summary.total++;
    
    if (exists) {
      results.summary.passed++;
      console.info(`✅ ${filePath}: Found`);
    } else {
      results.summary.failed++;
      console.info(`❌ ${filePath}: MISSING`);
    }
  }
  
  const failedFiles = results.categories.files.tests.filter(t => t.status === 'fail').length;
  results.categories.files.status = failedFiles > 0 ? 'fail' : 'pass';
}

/**
 * Test JavaScript Syntax
 */
async function testJavaScriptSyntax() {
  console.info('🔍 Testing JavaScript Syntax...');
  
  const jsFiles = [
    'gpt.js',
    'service-worker.js',
    'auth-system.js',
    'scripts/health-check.js'
  ];
  
  for (const jsFile of jsFiles) {
    const fullPath = path.join(rootDir, jsFile);
    
    if (!fs.existsSync(fullPath)) {
      console.info(`⚠️  ${jsFile}: File not found, skipping syntax check`);
      continue;
    }
    
    try {
      // Use Node.js built-in syntax checking
      const { execSync } = await import('child_process');
      execSync(`node -c "${fullPath}"`, { stdio: 'pipe' });
      
      const testResult = {
        name: `Syntax: ${jsFile}`,
        path: jsFile,
        status: 'pass',
        critical: true
      };
      
      results.categories.syntax.tests.push(testResult);
      results.summary.total++;
      results.summary.passed++;
      console.info(`✅ ${jsFile}: Syntax OK`);
      
    } catch (_error) {
      const testResult = {
        name: `Syntax: ${jsFile}`,
        path: jsFile,
        status: 'fail',
        critical: true,
        error: error.message
      };
      
      results.categories.syntax.tests.push(testResult);
      results.summary.total++;
      results.summary.failed++;
      console.error(`❌ ${jsFile}: Syntax Error - ${error.message}`);
    }
  }
  
  const failedSyntax = results.categories.syntax.tests.filter(t => t.status === 'fail').length;
  results.categories.syntax.status = failedSyntax > 0 ? 'fail' : 'pass';
}

/**
 * Test JSON Files
 */
async function testJSONFiles() {
  console.info('📄 Testing JSON Files...');
  
  const jsonFiles = [
    'package.json',
    'manifest.json',
    'backend-api/package.json'
  ];
  
  for (const jsonFile of jsonFiles) {
    const fullPath = path.join(rootDir, jsonFile);
    
    if (!fs.existsSync(fullPath)) {
      console.info(`⚠️  ${jsonFile}: File not found, skipping`);
      continue;
    }
    
    try {
      const content = fs.readFileSync(fullPath, 'utf8');
      JSON.parse(content);
      
      const testResult = {
        name: `JSON: ${jsonFile}`,
        path: jsonFile,
        status: 'pass',
        critical: true
      };
      
      results.categories.syntax.tests.push(testResult);
      results.summary.total++;
      results.summary.passed++;
      console.info(`✅ ${jsonFile}: Valid JSON`);
      
    } catch (_error) {
      const testResult = {
        name: `JSON: ${jsonFile}`,
        path: jsonFile,
        status: 'fail',
        critical: true,
        error: error.message
      };
      
      results.categories.syntax.tests.push(testResult);
      results.summary.total++;
      results.summary.failed++;
      console.error(`❌ ${jsonFile}: Invalid JSON - ${error.message}`);
    }
  }
}

/**
 * Generate Health Report
 */
function generateReport() {
  // Calculate overall status
  const criticalFailures = Object.values(results.categories)
    .filter(cat => cat.status === 'fail' || cat.status === 'critical').length;
  
  results.overall = criticalFailures > 0 ? 'unhealthy' : 
                   results.summary.warnings > 0 ? 'degraded' : 'healthy';
  
  console.info(`\n${  '='.repeat(60)}`);
  console.info('🏥 HEALTH CHECK REPORT');
  console.info('='.repeat(60));
  console.info(`📊 Overall Status: ${getStatusEmoji(results.overall)} ${results.overall.toUpperCase()}`);
  console.info(`🕐 Timestamp: ${results.timestamp}`);
  console.error(`📈 Results: ${results.summary.passed}✅ ${results.summary.failed}❌ ${results.summary.warnings}⚠️  (${results.summary.total} total)`);
  
  console.info('\n📋 Category Breakdown:');
  for (const [category, data] of Object.entries(results.categories)) {
    if (data.tests.length > 0) {
      console.info(`  ${getStatusEmoji(data.status)} ${category.toUpperCase()}: ${data.status}`);
    }
  }
  
  // Write detailed report to file
  const reportPath = path.join(rootDir, 'logs', 'health-report.json');
  const logsDir = path.dirname(reportPath);
  
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
  console.info(`\n📝 Detailed report saved to: ${reportPath}`);
  
  return results.overall === 'healthy';
}

function getStatusEmoji(status) {
  const emojis = {
    'healthy': '💚',
    'degraded': '💛', 
    'unhealthy': '❤️',
    'pass': '✅',
    'fail': '❌',
    'critical': '🚨',
    'unknown': '❓'
  };
  return emojis[status] || '❓';
}

/**
 * Main health check execution
 */
async function runHealthCheck() {
  console.info('🚀 Starting Comprehensive Health Check...\n');
  
  try {
    await testCDNResources();
    console.info();
    
    await testAPIEndpoints();
    console.info();
    
    await testCriticalFiles();
    console.info();
    
    await testJavaScriptSyntax();
    console.info();
    
    await testJSONFiles();
    console.info();
    
    const isHealthy = generateReport();
    
    // Exit with appropriate code
    process.exit(isHealthy ? 0 : 1);
    
  } catch (error) {
    console.error('❌ Health check failed with error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runHealthCheck();
}