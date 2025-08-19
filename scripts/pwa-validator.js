#!/usr/bin/env node

/**
 * PWA Validation Script for Thee Cigar Maestro
 * Validates PWA compliance and requirements
 * Implements roadmap requirement: PWA validation
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

class PWAValidator {
  constructor() {
    this.distDir = path.join(rootDir, 'dist');
    this.manifestPath = path.join(rootDir, 'manifest.json');
    this.checks = {
      manifest: false,
      serviceWorker: false,
      icons: false,
      offlineSupport: false,
      httpsReady: false,
      viewport: false,
      themeColor: false,
      startUrl: false,
      display: false,
    };
    this.issues = [];
    this.recommendations = [];
  }

  /**
   * Run comprehensive PWA validation
   */
  async validatePWA() {
    console.info('🔍 Starting PWA Validation...\n');

    // Validate manifest
    await this.validateManifest();

    // Validate service worker
    await this.validateServiceWorker();

    // Validate HTML requirements
    await this.validateHTMLRequirements();

    // Check build output
    await this.validateBuildOutput();

    // Generate validation report
    this.generateValidationReport();
  }

  /**
   * Validate PWA manifest file
   */
  async validateManifest() {
    console.info('📱 Validating PWA Manifest...');

    if (!fs.existsSync(this.manifestPath)) {
      this.issues.push('❌ manifest.json not found');
      return;
    }

    try {
      const manifestContent = fs.readFileSync(this.manifestPath, 'utf8');
      const manifest = JSON.parse(manifestContent);

      // Check required fields
      if (manifest.name) {
        console.info(`   ✅ App name: "${manifest.name}"`);
      } else {
        this.issues.push('❌ Missing required field: name');
      }

      if (manifest.short_name) {
        console.info(`   ✅ Short name: "${manifest.short_name}"`);
      } else {
        this.issues.push('❌ Missing required field: short_name');
      }

      if (manifest.start_url) {
        console.info(`   ✅ Start URL: "${manifest.start_url}"`);
        this.checks.startUrl = true;
      } else {
        this.issues.push('❌ Missing required field: start_url');
      }

      if (manifest.display) {
        console.info(`   ✅ Display mode: "${manifest.display}"`);
        this.checks.display = true;
        if (!['standalone', 'fullscreen', 'minimal-ui'].includes(manifest.display)) {
          this.recommendations.push(
            '💡 Consider using "standalone" display mode for better app-like experience'
          );
        }
      } else {
        this.issues.push('❌ Missing required field: display');
      }

      if (manifest.theme_color) {
        console.info(`   ✅ Theme color: "${manifest.theme_color}"`);
        this.checks.themeColor = true;
      } else {
        this.recommendations.push('💡 Add theme_color for better visual integration');
      }

      if (manifest.background_color) {
        console.info(`   ✅ Background color: "${manifest.background_color}"`);
      } else {
        this.recommendations.push('💡 Add background_color for splash screen');
      }

      // Validate icons
      if (manifest.icons && manifest.icons.length > 0) {
        console.info(`   ✅ Icons: ${manifest.icons.length} variants`);
        this.checks.icons = true;

        // Check for required icon sizes
        const iconSizes = manifest.icons.map(icon => icon.sizes);
        const requiredSizes = ['192x192', '512x512'];
        const missingSizes = requiredSizes.filter(
          size => !iconSizes.some(iconSize => iconSize && iconSize.includes(size))
        );

        if (missingSizes.length > 0) {
          this.issues.push(`❌ Missing required icon sizes: ${missingSizes.join(', ')}`);
        } else {
          console.info('   ✅ Required icon sizes present (192x192, 512x512)');
        }

        // Check icon file existence
        for (const icon of manifest.icons) {
          const iconPath = path.join(rootDir, icon.src.replace(/^\//, ''));
          if (fs.existsSync(iconPath)) {
            console.info(`   ✅ Icon exists: ${icon.src} (${icon.sizes})`);
          } else {
            this.issues.push(`❌ Icon file not found: ${icon.src}`);
          }
        }
      } else {
        this.issues.push('❌ No icons defined in manifest');
      }

      this.checks.manifest = true;
    } catch (error) {
      this.issues.push(`❌ Manifest parsing error: ${error.message}`);
    }

    console.info('');
  }

  /**
   * Validate service worker
   */
  async validateServiceWorker() {
    console.info('⚙️  Validating Service Worker...');

    // Check for service worker in dist
    const swPath = path.join(this.distDir, 'sw.js');
    if (fs.existsSync(swPath)) {
      console.info('   ✅ Service worker found in build output');
      this.checks.serviceWorker = true;

      const swContent = fs.readFileSync(swPath, 'utf8');

      // Check for common PWA features
      if (swContent.includes('fetch')) {
        console.info('   ✅ Fetch event handling implemented');
      } else {
        this.recommendations.push('💡 Implement fetch event handling for offline support');
      }

      if (swContent.includes('install') || swContent.includes('activate')) {
        console.info('   ✅ Lifecycle events implemented');
      } else {
        this.recommendations.push('💡 Implement install/activate events for better caching');
      }

      if (swContent.includes('precache') || swContent.includes('cache')) {
        console.info('   ✅ Caching strategy implemented');
        this.checks.offlineSupport = true;
      } else {
        this.recommendations.push('💡 Implement caching strategy for offline support');
      }
    } else {
      this.issues.push('❌ Service worker not found in build output');
    }

    // Check for Workbox
    const workboxFiles = fs.existsSync(this.distDir)
      ? fs.readdirSync(this.distDir).filter(file => file.includes('workbox'))
      : [];

    if (workboxFiles.length > 0) {
      console.info(`   ✅ Workbox runtime detected: ${workboxFiles[0]}`);
    }

    console.info('');
  }

  /**
   * Validate HTML requirements
   */
  async validateHTMLRequirements() {
    console.info('🌐 Validating HTML Requirements...');

    const htmlFiles = ['index.html'];

    for (const htmlFile of htmlFiles) {
      const htmlPath = path.join(rootDir, htmlFile);
      if (!fs.existsSync(htmlPath)) continue;

      const htmlContent = fs.readFileSync(htmlPath, 'utf8');

      // Check viewport meta tag
      if (htmlContent.includes('name="viewport"')) {
        console.info(`   ✅ Viewport meta tag found in ${htmlFile}`);
        this.checks.viewport = true;
      } else {
        this.issues.push(`❌ Missing viewport meta tag in ${htmlFile}`);
      }

      // Check theme-color meta tag
      if (htmlContent.includes('name="theme-color"')) {
        console.info(`   ✅ Theme color meta tag found in ${htmlFile}`);
      } else {
        this.recommendations.push(`💡 Add theme-color meta tag to ${htmlFile}`);
      }

      // Check manifest link
      if (htmlContent.includes('rel="manifest"')) {
        console.info(`   ✅ Manifest link found in ${htmlFile}`);
      } else {
        this.issues.push(`❌ Missing manifest link in ${htmlFile}`);
      }

      // Check for Apple touch icon
      if (htmlContent.includes('apple-touch-icon')) {
        console.info(`   ✅ Apple touch icon found in ${htmlFile}`);
      } else {
        this.recommendations.push(`💡 Add Apple touch icon for iOS compatibility`);
      }

      // Check for Apple mobile web app meta tags
      if (htmlContent.includes('apple-mobile-web-app-capable')) {
        console.info(`   ✅ Apple mobile web app meta tags found in ${htmlFile}`);
      } else {
        this.recommendations.push(`💡 Add Apple mobile web app meta tags for iOS`);
      }
    }

    console.info('');
  }

  /**
   * Validate build output
   */
  async validateBuildOutput() {
    console.info('🏗️  Validating Build Output...');

    if (!fs.existsSync(this.distDir)) {
      this.issues.push('❌ Build directory not found - run npm run build');
      return;
    }

    // Check for manifest in dist
    const distManifest = path.join(this.distDir, 'manifest.webmanifest');
    if (fs.existsSync(distManifest)) {
      console.info('   ✅ Manifest included in build output');
    } else {
      this.issues.push('❌ Manifest not included in build output');
    }

    // Check for registerSW
    const registerSW = path.join(this.distDir, 'registerSW.js');
    if (fs.existsSync(registerSW)) {
      console.info('   ✅ Service worker registration script found');
    } else {
      this.recommendations.push('💡 Add service worker registration script');
    }

    console.info('');
  }

  /**
   * Generate comprehensive validation report
   */
  generateValidationReport() {
    console.info('📋 PWA Validation Report');
    console.info('═'.repeat(50));

    // Calculate compliance score
    const totalChecks = Object.keys(this.checks).length;
    const passedChecks = Object.values(this.checks).filter(Boolean).length;
    const complianceScore = Math.round((passedChecks / totalChecks) * 100);

    console.info('\n🎯 PWA Compliance Checklist:');
    for (const [check, passed] of Object.entries(this.checks)) {
      const status = passed ? '✅' : '❌';
      const checkName = check.replace(/([A-Z])/g, ' $1').toLowerCase();
      console.info(`   ${status} ${checkName}`);
    }

    console.info(`\n📊 Overall Compliance: ${complianceScore}% (${passedChecks}/${totalChecks})`);

    // Issues
    if (this.issues.length > 0) {
      console.info('\n❌ Critical Issues:');
      this.issues.forEach(issue => console.info(`   ${issue}`));
    }

    // Recommendations
    if (this.recommendations.length > 0) {
      console.info('\n💡 Recommendations:');
      this.recommendations.forEach(rec => console.info(`   ${rec}`));
    }

    // PWA Readiness Assessment
    console.info('\n🚀 PWA Readiness Assessment:');

    if (complianceScore >= 90) {
      console.info('   ✅ Excellent! Your app meets PWA standards');
      console.info('   🎉 Ready for app store submission and installation');
    } else if (complianceScore >= 80) {
      console.info('   ✅ Good! Most PWA requirements met');
      console.info('   🔧 Address remaining issues for full compliance');
    } else if (complianceScore >= 70) {
      console.info('   ⚠️  Fair PWA compliance');
      console.info('   🛠️  Several improvements needed for full PWA status');
    } else {
      console.info('   ❌ Poor PWA compliance');
      console.info('   🚨 Significant work required to meet PWA standards');
    }

    // Roadmap alignment
    console.info('\n🎯 Roadmap Alignment:');
    console.info(`   PWA Compliance Score: ${complianceScore}% (target: >80%)`);
    console.info(`   Critical Issues: ${this.issues.length} (target: 0)`);
    console.info(`   Service Worker: ${this.checks.serviceWorker ? '✅' : '❌'} (required)`);
    console.info(`   Manifest: ${this.checks.manifest ? '✅' : '❌'} (required)`);
    console.info(`   Offline Support: ${this.checks.offlineSupport ? '✅' : '❌'} (target)`);
  }
}

// Run if called directly
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  const validator = new PWAValidator();
  validator.validatePWA().catch(console.error);
}

export default PWAValidator;
