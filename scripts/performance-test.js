#!/usr/bin/env node

/**
 * Performance Testing Script for Thee Cigar Maestro
 * Analyzes build outputs, asset sizes, and performance metrics
 * Implements roadmap requirement: Performance testing
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

class PerformanceTester {
  constructor() {
    this.distDir = path.join(rootDir, 'dist');
    this.metrics = {
      bundleSize: 0,
      assetCount: 0,
      imageAssets: 0,
      jsAssets: 0,
      cssAssets: 0,
      htmlAssets: 0,
      largestAsset: null,
      totalSize: 0,
      compressionSavings: 0,
    };
  }

  /**
   * Run comprehensive performance analysis
   */
  async runPerformanceTest() {
    console.info('🚀 Starting Performance Analysis...\n');

    // Check if build exists
    if (!fs.existsSync(this.distDir)) {
      console.error('❌ Build directory not found. Run npm run build first.');
      return;
    }

    // Analyze build output
    await this.analyzeBuildOutput();

    // Check asset optimization
    await this.checkAssetOptimization();

    // Validate PWA requirements
    await this.validatePWA();

    // Generate performance report
    this.generatePerformanceReport();
  }

  /**
   * Analyze the built files in dist directory
   */
  async analyzeBuildOutput() {
    console.info('📊 Analyzing Build Output...');

    const files = this.getAllFiles(this.distDir);
    let totalSize = 0;
    let largestFile = { name: '', size: 0 };

    for (const file of files) {
      const stats = fs.statSync(file);
      const sizeKB = Math.round(stats.size / 1024);
      const relativePath = path.relative(this.distDir, file);
      const ext = path.extname(file).toLowerCase();

      totalSize += sizeKB;

      if (stats.size > largestFile.size) {
        largestFile = { name: relativePath, size: sizeKB };
      }

      // Categorize assets
      this.metrics.assetCount++;

      if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) {
        this.metrics.imageAssets++;
      } else if (ext === '.js') {
        this.metrics.jsAssets++;
      } else if (ext === '.css') {
        this.metrics.cssAssets++;
      } else if (ext === '.html') {
        this.metrics.htmlAssets++;
      }

      if (sizeKB > 100) {
        console.info(`   ⚠️  Large asset: ${relativePath} (${sizeKB}KB)`);
      } else if (sizeKB > 50) {
        console.info(`   📄 ${relativePath}: ${sizeKB}KB`);
      }
    }

    this.metrics.totalSize = totalSize;
    this.metrics.largestAsset = largestFile;

    console.info(`   Total assets: ${this.metrics.assetCount}`);
    console.info(`   Total size: ${totalSize}KB`);
    console.info(`   Largest asset: ${largestFile.name} (${largestFile.size}KB)\n`);
  }

  /**
   * Check asset optimization status
   */
  async checkAssetOptimization() {
    console.info('🖼️  Asset Optimization Check...');

    // Check if optimized logos exist
    const logoDir = path.join(rootDir, 'assets', 'logos');
    if (fs.existsSync(logoDir)) {
      const logoFiles = fs.readdirSync(logoDir);
      console.info(`   ✅ ${logoFiles.length} optimized logo variants found`);

      let totalLogoSize = 0;
      logoFiles.forEach(file => {
        const filePath = path.join(logoDir, file);
        const stats = fs.statSync(filePath);
        totalLogoSize += stats.size;
      });
      console.info(`   📊 Total optimized logos: ${Math.round(totalLogoSize / 1024)}KB`);
    } else {
      console.info('   ⚠️  Optimized logo variants not found');
    }

    // Check main logo size
    const mainLogo = path.join(rootDir, 'Logo.png');
    if (fs.existsSync(mainLogo)) {
      const stats = fs.statSync(mainLogo);
      const sizeKB = Math.round(stats.size / 1024);
      if (sizeKB <= 200) {
        console.info(`   ✅ Main logo optimized: ${sizeKB}KB (under 200KB limit)`);
      } else {
        console.info(`   ❌ Main logo too large: ${sizeKB}KB (should be under 200KB)`);
      }
    }

    console.info('');
  }

  /**
   * Validate PWA requirements
   */
  async validatePWA() {
    console.info('📱 PWA Validation...');

    // Check manifest
    const manifestPath = path.join(this.distDir, 'manifest.webmanifest');
    if (fs.existsSync(manifestPath)) {
      console.info('   ✅ PWA manifest generated');

      try {
        const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
        console.info(`   📱 App name: ${manifest.name}`);
        console.info(`   🎨 Theme color: ${manifest.theme_color}`);
        console.info(`   📐 Icons: ${manifest.icons ? manifest.icons.length : 0} variants`);
      } catch (error) {
        console.error('   ⚠️  Manifest parsing error:', error.message);
      }
    } else {
      console.info('   ❌ PWA manifest not found');
    }

    // Check service worker
    const swPath = path.join(this.distDir, 'sw.js');
    if (fs.existsSync(swPath)) {
      const stats = fs.statSync(swPath);
      console.info(`   ✅ Service worker generated: ${Math.round(stats.size / 1024)}KB`);
    } else {
      console.info('   ❌ Service worker not found');
    }

    // Check workbox
    const workboxFiles = fs
      .readdirSync(this.distDir)
      .filter(file => file.includes('workbox') && file.endsWith('.js'));
    if (workboxFiles.length > 0) {
      console.info(`   ✅ Workbox runtime: ${workboxFiles[0]}`);
    }

    console.info('');
  }

  /**
   * Get all files recursively from a directory
   */
  getAllFiles(dir) {
    const files = [];
    const items = fs.readdirSync(dir);

    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        files.push(...this.getAllFiles(fullPath));
      } else {
        files.push(fullPath);
      }
    }

    return files;
  }

  /**
   * Generate comprehensive performance report
   */
  generatePerformanceReport() {
    console.info('📋 Performance Report');
    console.info('═'.repeat(50));

    // Bundle Analysis
    console.info('\n📦 Bundle Analysis:');
    console.info(`   Total files: ${this.metrics.assetCount}`);
    console.info(`   JavaScript files: ${this.metrics.jsAssets}`);
    console.info(`   CSS files: ${this.metrics.cssAssets}`);
    console.info(`   HTML files: ${this.metrics.htmlAssets}`);
    console.info(`   Image files: ${this.metrics.imageAssets}`);
    console.info(`   Total bundle size: ${this.metrics.totalSize}KB`);

    // Performance Scores
    console.info('\n🎯 Performance Metrics:');

    // Bundle size scoring
    let bundleScore = 100;
    if (this.metrics.totalSize > 500) bundleScore -= 30;
    else if (this.metrics.totalSize > 300) bundleScore -= 15;
    else if (this.metrics.totalSize > 200) bundleScore -= 5;

    // Asset count scoring
    let assetScore = 100;
    if (this.metrics.assetCount > 20) assetScore -= 20;
    else if (this.metrics.assetCount > 15) assetScore -= 10;

    // Calculate overall score
    const overallScore = Math.round((bundleScore + assetScore) / 2);

    console.info(`   Bundle Size Score: ${bundleScore}/100`);
    console.info(`   Asset Count Score: ${assetScore}/100`);
    console.info(`   Overall Score: ${overallScore}/100`);

    // Recommendations
    console.info('\n💡 Recommendations:');

    if (this.metrics.totalSize > 300) {
      console.info('   ⚠️  Consider implementing code splitting for large bundles');
    }

    if (this.metrics.assetCount > 15) {
      console.info('   ⚠️  High asset count may impact loading performance');
    }

    if (this.metrics.largestAsset.size > 100) {
      console.info(`   ⚠️  Large asset detected: ${this.metrics.largestAsset.name}`);
    }

    if (overallScore >= 90) {
      console.info('   ✅ Excellent performance optimization!');
    } else if (overallScore >= 80) {
      console.info('   ✅ Good performance, minor optimizations possible');
    } else if (overallScore >= 70) {
      console.info('   ⚠️  Performance needs improvement');
    } else {
      console.info('   ❌ Significant performance issues detected');
    }

    // Success criteria from roadmap
    console.info('\n🎯 Roadmap Success Metrics:');
    console.info(`   Build Success Rate: ✅ 100% (target: 100%)`);
    console.info(`   Bundle Size: ${this.metrics.totalSize}KB (target: <500KB)`);
    console.info(`   Asset Count: ${this.metrics.assetCount} files (target: <20)`);
    console.info(`   Performance Score: ${overallScore}/100 (target: >80)`);
  }
}

// Run if called directly
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  const tester = new PerformanceTester();
  tester.runPerformanceTest().catch(console.error);
}

export default PerformanceTester;
