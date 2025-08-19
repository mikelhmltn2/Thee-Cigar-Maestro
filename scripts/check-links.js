#!/usr/bin/env node

/**
 * Link Checker for Thee Cigar Maestro
 * Validates all external links and CDN resources
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Configuration
const TIMEOUT = 10000; // 10 seconds
const USER_AGENT = 'Mozilla/5.0 (compatible; Link-Checker/1.0)';
const MAX_RETRIES = 2;

// Results tracking
const results = {
  tested: 0,
  passed: 0,
  failed: 0,
  warnings: 0,
  errors: [],
};

/**
 * Check if URL is accessible
 */
async function checkUrl(url, context = '') {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': USER_AGENT,
        },
        signal: AbortSignal.timeout(TIMEOUT),
      });

      results.tested++;

      if (response.ok) {
        console.info(`✅ ${url} - HTTP ${response.status}`);
        results.passed++;
        return { success: true, status: response.status, url, context };
      } else {
        console.info(`❌ ${url} - HTTP ${response.status} ${context ? `(${context})` : ''}`);
        results.failed++;
        results.errors.push({
          url,
          status: response.status,
          context,
          type: 'HTTP_ERROR',
        });
        return { success: false, status: response.status, url, context };
      }
    } catch (error) {
      if (attempt === MAX_RETRIES) {
        console.error(`❌ ${url} - ${error.message} ${context ? `(${context})` : ''}`);
        results.failed++;
        results.errors.push({
          url,
          error: error.message,
          context,
          type: 'NETWORK_ERROR',
        });
        return { success: false, error: error.message, url, context };
      } else {
        console.info(`⚠️  ${url} - Retry ${attempt}/${MAX_RETRIES}`);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second before retry
      }
    }
  }

  // This should never be reached, but return a fallback
  return { success: false, error: 'Max retries exceeded', url, context };
}

/**
 * Extract URLs from text content
 */
function extractUrls(content, fileType = 'html') {
  const urls = new Set();

  // HTTP/HTTPS URLs
  const httpRegex = /https?:\/\/[^\s"'<>)]+/gi;
  const httpMatches = content.match(httpRegex) || [];
  httpMatches.forEach(url => urls.add(url.replace(/['"<>)]*$/, '')));

  // HTML-specific patterns
  if (fileType === 'html' || fileType === 'md') {
    // src attributes
    const srcRegex = /src=["']([^"']+)["']/gi;
    let match;
    while ((match = srcRegex.exec(content)) !== null) {
      if (match[1].startsWith('http')) {
        urls.add(match[1]);
      }
    }

    // href attributes
    const hrefRegex = /href=["']([^"']+)["']/gi;
    while ((match = hrefRegex.exec(content)) !== null) {
      if (match[1].startsWith('http')) {
        urls.add(match[1]);
      }
    }

    // Markdown links
    const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/gi;
    while ((match = mdLinkRegex.exec(content)) !== null) {
      if (match[2].startsWith('http')) {
        urls.add(match[2]);
      }
    }
  }

  return Array.from(urls);
}

/**
 * Check links in a single file
 */
async function checkFileLinks(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const fileType = path.extname(filePath).slice(1);
  const urls = extractUrls(content, fileType);

  if (urls.length === 0) {
    return [];
  }

  console.info(`\n📄 Checking ${urls.length} links in ${path.relative(rootDir, filePath)}`);

  const results = [];
  for (const url of urls) {
    const result = await checkUrl(url, path.relative(rootDir, filePath));
    results.push(result);
  }

  return results;
}

/**
 * Find all relevant files to check
 */
function findFilesToCheck() {
  const files = [];
  const extensions = ['.html', '.md', '.js', '.json', '.css'];

  function scanDirectory(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        // Skip certain directories
        if (['node_modules', '.git', 'dist', 'coverage'].includes(item)) {
          continue;
        }
        scanDirectory(fullPath);
      } else if (extensions.includes(path.extname(item))) {
        files.push(fullPath);
      }
    }
  }

  scanDirectory(rootDir);
  return files;
}

/**
 * Generate report
 */
function generateReport() {
  console.info(`\n${'='.repeat(60)}`);
  console.info('📊 LINK CHECK SUMMARY');
  console.info('='.repeat(60));
  console.info(`Total URLs tested: ${results.tested}`);
  console.info(`✅ Passed: ${results.passed}`);
  console.error(`❌ Failed: ${results.failed}`);
  console.warn(`⚠️  Warnings: ${results.warnings}`);

  if (results.errors.length > 0) {
    console.info('\n🚨 FAILED LINKS:');
    console.info('-'.repeat(40));

    results.errors.forEach((error, index) => {
      console.error(`${index + 1}. ${error.url}`);
      console.error(`   Context: ${error.context}`);
      console.error(`   Error: ${error.status || error.error}`);
      console.error(`   Type: ${error.type}`);
      console.info('');
    });
  }

  // Write detailed report to file
  const reportPath = path.join(rootDir, 'link-check-report.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify(
      {
        timestamp: new Date().toISOString(),
        summary: {
          tested: results.tested,
          passed: results.passed,
          failed: results.failed,
          warnings: results.warnings,
        },
        errors: results.errors,
      },
      null,
      2
    )
  );

  console.info(`📄 Detailed report saved to: ${path.relative(rootDir, reportPath)}`);

  return results.failed === 0;
}

/**
 * Main execution
 */
async function main() {
  console.info('🔍 Starting Link Check for Thee Cigar Maestro');
  console.info('='.repeat(60));

  try {
    const files = findFilesToCheck();
    console.info(`📁 Found ${files.length} files to check`);

    for (const file of files) {
      await checkFileLinks(file);
    }

    const success = generateReport();

    if (success) {
      console.info('\n✅ All links are working correctly!');
      process.exit(0);
    } else {
      console.info('\n❌ Some links are broken. Please fix them.');
      process.exit(1);
    }
  } catch (error) {
    console.error('💥 Error during link checking:', error);
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { checkUrl, extractUrls, checkFileLinks };
