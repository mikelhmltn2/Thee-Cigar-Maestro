#!/usr/bin/env node

/**
 * Logo Optimization Script for Thee Cigar Maestro
 * Creates optimized logo variants in multiple formats and sizes
 * Implements roadmap requirement: Asset Optimization - HIGH IMPACT
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

class LogoOptimizer {
  constructor() {
    this.inputLogo = path.join(rootDir, 'Logo.png');
    this.outputDir = path.join(rootDir, 'assets', 'logos');
    this.manifests = [];
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generate optimized logo variants
   */
  async optimizeLogos() {
    console.log('🖼️  Starting logo optimization...\n');

    if (!fs.existsSync(this.inputLogo)) {
      console.error(`❌ Logo file not found: ${this.inputLogo}`);
      return;
    }

    // Get original logo info
    const originalStats = fs.statSync(this.inputLogo);
    const originalSizeKB = Math.round(originalStats.size / 1024);
    console.log(`📸 Original logo: ${originalSizeKB}KB`);

    // Define logo variants as specified in roadmap
    const variants = [
      { size: 96, name: 'logo-96.png', format: 'png' },
      { size: 144, name: 'logo-144.png', format: 'png' },
      { size: 192, name: 'logo-192.png', format: 'png' },
      { size: 512, name: 'logo-512.png', format: 'png' },
      { size: 96, name: 'logo-96.webp', format: 'webp' },
      { size: 144, name: 'logo-144.webp', format: 'webp' },
      { size: 192, name: 'logo-192.webp', format: 'webp' },
      { size: 512, name: 'logo-512.webp', format: 'webp' },
      { size: null, name: 'logo-optimized.png', format: 'png', quality: 90 },
      { size: null, name: 'logo-optimized.webp', format: 'webp', quality: 85 }
    ];

    let totalSavings = 0;

    for (const variant of variants) {
      try {
        const outputPath = path.join(this.outputDir, variant.name);
        let processor = sharp(this.inputLogo);

        // Resize if size is specified
        if (variant.size) {
          processor = processor.resize(variant.size, variant.size, {
            fit: 'inside',
            withoutEnlargement: true
          });
        }

        // Apply format-specific optimizations
        if (variant.format === 'webp') {
          processor = processor.webp({ 
            quality: variant.quality || 85,
            effort: 6
          });
        } else if (variant.format === 'png') {
          processor = processor.png({ 
            quality: variant.quality || 90,
            compressionLevel: 9,
            progressive: true
          });
        }

        // Generate optimized image
        await processor.toFile(outputPath);

        // Calculate size and savings
        const newStats = fs.statSync(outputPath);
        const newSizeKB = Math.round(newStats.size / 1024);
        const savings = variant.size ? 0 : originalSizeKB - newSizeKB;
        totalSavings += savings;

        console.log(`✅ Generated ${variant.name}: ${newSizeKB}KB${savings > 0 ? ` (saved ${savings}KB)` : ''}`);

        // Add to manifest for PWA
        if (variant.format === 'png' && variant.size) {
          this.manifests.push({
            src: `assets/logos/${variant.name}`,
            sizes: `${variant.size}x${variant.size}`,
            type: 'image/png'
          });
        }
      } catch (error) {
        console.error(`❌ Failed to generate ${variant.name}:`, error.message);
      }
    }

    console.log(`\n💾 Total savings: ${totalSavings}KB`);
    console.log(`📱 Generated ${this.manifests.length} PWA manifest icons`);

    // Update the main logo with the optimized version
    await this.updateMainLogo();
    
    // Generate manifest suggestions
    this.generateManifestSuggestions();
  }

  /**
   * Replace the main logo with optimized version
   */
  async updateMainLogo() {
    try {
      const optimizedPath = path.join(this.outputDir, 'logo-optimized.png');
      if (fs.existsSync(optimizedPath)) {
        // Create backup of original
        const backupPath = path.join(rootDir, 'Logo_backup.png');
        if (!fs.existsSync(backupPath)) {
          fs.copyFileSync(this.inputLogo, backupPath);
        }

        // Replace main logo
        fs.copyFileSync(optimizedPath, this.inputLogo);
        
        const newStats = fs.statSync(this.inputLogo);
        const newSizeKB = Math.round(newStats.size / 1024);
        
        console.log(`\n🔄 Updated main Logo.png: ${newSizeKB}KB`);
        
        if (newSizeKB <= 200) {
          console.log(`✅ Logo now meets the <200KB requirement!`);
        }
      }
    } catch (error) {
      console.error(`❌ Failed to update main logo:`, error.message);
    }
  }

  /**
   * Generate PWA manifest suggestions
   */
  generateManifestSuggestions() {
    console.log('\n📱 PWA Manifest Icon Suggestions:');
    console.log('Add these to your manifest.json:');
    console.log(JSON.stringify(this.manifests, null, 2));
  }
}

// Run if called directly
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  const optimizer = new LogoOptimizer();
  optimizer.optimizeLogos().catch(console.error);
}

export default LogoOptimizer;