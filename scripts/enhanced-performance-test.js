#!/usr/bin/env node

/**
 * Enhanced Performance Testing for Thee Cigar Maestro
 * Comprehensive performance analysis including load testing, Lighthouse audits, and metrics
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Performance test configuration
const CONFIG = {
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  concurrentUsers: 10,
  testDuration: 60, // seconds
  lighthouseThresholds: {
    performance: 80,
    accessibility: 90,
    bestPractices: 85,
    seo: 90,
  },
  loadTestThresholds: {
    responseTime: 2000, // ms
    errorRate: 5, // percentage
    throughput: 100, // requests per second
  },
};

// Results storage
const results = {
  timestamp: new Date().toISOString(),
  summary: {
    overall: 'unknown',
    performance: 0,
    accessibility: 0,
    bestPractices: 0,
    seo: 0,
  },
  loadTest: {
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    averageResponseTime: 0,
    maxResponseTime: 0,
    minResponseTime: 0,
    throughput: 0,
  },
  lighthouse: {},
  recommendations: [],
};

/**
 * Run Lighthouse audit
 */
async function runLighthouseAudit(url, device = 'desktop') {
  console.info(`🔍 Running Lighthouse audit for ${url} (${device})...`);

  try {
    // Check if lighthouse is installed
    try {
      execSync('lighthouse --version', { stdio: 'ignore' });
    } catch {
      console.warn('⚠️ Lighthouse not found, installing...');
      execSync('npm install -g lighthouse', { stdio: 'inherit' });
    }

    const outputPath = path.join(rootDir, `lighthouse-${device}.json`);
    const command = `lighthouse ${url} --output=json --output-path=${outputPath} --chrome-flags="--headless --no-sandbox" --only-categories=performance,accessibility,best-practices,seo`;

    execSync(command, { stdio: 'inherit', timeout: 60000 });

    const report = JSON.parse(fs.readFileSync(outputPath, 'utf8'));

    return {
      performance: Math.round(report.categories.performance.score * 100),
      accessibility: Math.round(report.categories.accessibility.score * 100),
      bestPractices: Math.round(report.categories['best-practices'].score * 100),
      seo: Math.round(report.categories.seo.score * 100),
      metrics: report.audits,
    };
  } catch (error) {
    console.error(`❌ Lighthouse audit failed: ${error.message}`);
    return null;
  }
}

/**
 * Simple load testing function
 */
async function runLoadTest(url, endpoints = ['/']) {
  console.info(`⚡ Running load test for ${url}...`);

  const startTime = Date.now();
  const requests = [];
  const errors = [];

  // Generate test requests
  for (let i = 0; i < CONFIG.concurrentUsers; i++) {
    for (const endpoint of endpoints) {
      const testUrl = `${url}${endpoint}`;
      requests.push(testUrl);
    }
  }

  // Execute requests concurrently
  const promises = requests.map(async testUrl => {
    const requestStart = Date.now();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), CONFIG.timeout);

      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'User-Agent': 'PerformanceTest/1.0',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseTime = Date.now() - requestStart;

      return {
        success: response.ok,
        status: response.status,
        responseTime,
        url: testUrl,
      };
    } catch (error) {
      const responseTime = Date.now() - requestStart;
      errors.push({
        error: error.message,
        responseTime,
        url: testUrl,
      });

      return {
        success: false,
        error: error.message,
        responseTime,
        url: testUrl,
      };
    }
  });

  const responses = await Promise.all(promises);
  const endTime = Date.now();

  // Calculate metrics
  const successfulRequests = responses.filter(r => r.success);
  const failedRequests = responses.filter(r => !r.success);
  const responseTimes = successfulRequests.map(r => r.responseTime);

  const loadTestResults = {
    totalRequests: responses.length,
    successfulRequests: successfulRequests.length,
    failedRequests: failedRequests.length,
    averageResponseTime:
      responseTimes.length > 0
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
        : 0,
    maxResponseTime: responseTimes.length > 0 ? Math.max(...responseTimes) : 0,
    minResponseTime: responseTimes.length > 0 ? Math.min(...responseTimes) : 0,
    throughput: responses.length / ((endTime - startTime) / 1000),
    errorRate: (failedRequests.length / responses.length) * 100,
    duration: endTime - startTime,
  };

  return loadTestResults;
}

/**
 * Check bundle size and performance
 */
function analyzeBundleSize() {
  console.info('📦 Analyzing bundle size...');

  try {
    const distPath = path.join(rootDir, 'dist');
    const nextPath = path.join(rootDir, '.next');

    let totalSize = 0;
    const fileSizes = {};

    // Check if dist directory exists
    if (fs.existsSync(distPath)) {
      const files = getAllFiles(distPath);
      files.forEach(file => {
        const stats = fs.statSync(file);
        const relativePath = path.relative(distPath, file);
        fileSizes[relativePath] = stats.size;
        totalSize += stats.size;
      });
    }

    // Check if .next directory exists
    if (fs.existsSync(nextPath)) {
      const files = getAllFiles(nextPath);
      files.forEach(file => {
        const stats = fs.statSync(file);
        const relativePath = path.relative(nextPath, file);
        fileSizes[relativePath] = stats.size;
        totalSize += stats.size;
      });
    }

    return {
      totalSize,
      fileSizes,
      totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
    };
  } catch (error) {
    console.error(`❌ Bundle analysis failed: ${error.message}`);
    return null;
  }
}

/**
 * Get all files in directory recursively
 */
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

/**
 * Generate performance recommendations
 */
function generateRecommendations(lighthouseResults, loadTestResults, bundleResults) {
  const recommendations = [];

  // Lighthouse recommendations
  if (lighthouseResults) {
    if (lighthouseResults.performance < CONFIG.lighthouseThresholds.performance) {
      recommendations.push({
        category: 'Performance',
        priority: 'high',
        message: `Performance score is ${lighthouseResults.performance}/100. Consider optimizing images, reducing bundle size, and implementing code splitting.`,
      });
    }

    if (lighthouseResults.accessibility < CONFIG.lighthouseThresholds.accessibility) {
      recommendations.push({
        category: 'Accessibility',
        priority: 'medium',
        message: `Accessibility score is ${lighthouseResults.accessibility}/100. Review ARIA labels, color contrast, and keyboard navigation.`,
      });
    }
  }

  // Load test recommendations
  if (loadTestResults) {
    if (loadTestResults.averageResponseTime > CONFIG.loadTestThresholds.responseTime) {
      recommendations.push({
        category: 'Response Time',
        priority: 'high',
        message: `Average response time (${loadTestResults.averageResponseTime.toFixed(0)}ms) exceeds threshold (${CONFIG.loadTestThresholds.responseTime}ms). Consider server optimization.`,
      });
    }

    if (loadTestResults.errorRate > CONFIG.loadTestThresholds.errorRate) {
      recommendations.push({
        category: 'Error Rate',
        priority: 'high',
        message: `Error rate (${loadTestResults.errorRate.toFixed(1)}%) exceeds threshold (${CONFIG.loadTestThresholds.errorRate}%). Review server stability.`,
      });
    }
  }

  // Bundle size recommendations
  if (bundleResults && bundleResults.totalSizeMB > 5) {
    recommendations.push({
      category: 'Bundle Size',
      priority: 'medium',
      message: `Bundle size (${bundleResults.totalSizeMB}MB) is large. Consider code splitting, tree shaking, and lazy loading.`,
    });
  }

  return recommendations;
}

/**
 * Generate performance report
 */
function generateReport() {
  const report = {
    timestamp: results.timestamp,
    config: CONFIG,
    summary: results.summary,
    loadTest: results.loadTest,
    lighthouse: results.lighthouse,
    bundleAnalysis: results.bundleAnalysis,
    recommendations: results.recommendations,
  };

  const reportPath = path.join(rootDir, 'performance-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

  console.info(`📊 Performance report saved to: ${reportPath}`);

  // Print summary
  console.info('\n📋 Performance Test Summary:');
  console.info('═'.repeat(50));
  console.info(`Overall Score: ${results.summary.overall}`);
  console.info(`Performance: ${results.summary.performance}/100`);
  console.info(`Accessibility: ${results.summary.accessibility}/100`);
  console.info(`Best Practices: ${results.summary.bestPractices}/100`);
  console.info(`SEO: ${results.summary.seo}/100`);
  console.info('');
  console.info('Load Test Results:');
  console.info(`Total Requests: ${results.loadTest.totalRequests}`);
  console.info(
    `Success Rate: ${((results.loadTest.successfulRequests / results.loadTest.totalRequests) * 100).toFixed(1)}%`
  );
  console.info(`Avg Response Time: ${results.loadTest.averageResponseTime.toFixed(0)}ms`);
  console.info(`Throughput: ${results.loadTest.throughput.toFixed(1)} req/s`);

  if (results.recommendations.length > 0) {
    console.info('\n🎯 Recommendations:');
    results.recommendations.forEach((rec, index) => {
      console.info(`${index + 1}. [${rec.priority.toUpperCase()}] ${rec.category}: ${rec.message}`);
    });
  }
}

/**
 * Main performance test runner
 */
async function runPerformanceTests() {
  console.info('🚀 Starting Enhanced Performance Tests...');
  console.info(`📍 Testing URL: ${CONFIG.baseUrl}`);

  try {
    // Test if server is running
    try {
      const response = await fetch(CONFIG.baseUrl, { timeout: 5000 });
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
    } catch (error) {
      console.error(`❌ Server not accessible at ${CONFIG.baseUrl}`);
      console.error('Please start the development server with: npm run dev');
      process.exit(1);
    }

    // Run Lighthouse audits
    console.info('\n🔍 Running Lighthouse audits...');
    const desktopAudit = await runLighthouseAudit(CONFIG.baseUrl, 'desktop');
    const mobileAudit = await runLighthouseAudit(CONFIG.baseUrl, 'mobile');

    results.lighthouse = {
      desktop: desktopAudit,
      mobile: mobileAudit,
    };

    // Calculate overall scores
    if (desktopAudit) {
      results.summary.performance = desktopAudit.performance;
      results.summary.accessibility = desktopAudit.accessibility;
      results.summary.bestPractices = desktopAudit.bestPractices;
      results.summary.seo = desktopAudit.seo;

      const avgScore =
        (desktopAudit.performance +
          desktopAudit.accessibility +
          desktopAudit.bestPractices +
          desktopAudit.seo) /
        4;
      results.summary.overall =
        avgScore >= 90 ? 'excellent' : avgScore >= 80 ? 'good' : avgScore >= 70 ? 'fair' : 'poor';
    }

    // Run load tests
    console.info('\n⚡ Running load tests...');
    const loadTestResults = await runLoadTest(CONFIG.baseUrl, ['/', '/education', '/pairing']);
    results.loadTest = loadTestResults;

    // Analyze bundle size
    console.info('\n📦 Analyzing bundle size...');
    const bundleResults = analyzeBundleSize();
    results.bundleAnalysis = bundleResults;

    // Generate recommendations
    results.recommendations = generateRecommendations(desktopAudit, loadTestResults, bundleResults);

    // Generate report
    generateReport();

    // Exit with appropriate code
    const hasCriticalIssues = results.recommendations.some(r => r.priority === 'high');
    process.exit(hasCriticalIssues ? 1 : 0);
  } catch (error) {
    console.error(`❌ Performance test failed: ${error.message}`);
    process.exit(1);
  }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runPerformanceTests();
}

export { runPerformanceTests, CONFIG };
