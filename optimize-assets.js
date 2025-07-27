#!/usr/bin/env node

/**
 * Asset Optimization Script for Thee Cigar Maestro
 * Helps optimize images, minify files, and improve performance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

class AssetOptimizer {
  constructor() {
    this.optimizations = [];
    this.totalSavings = 0;
  }

  /**
   * Run all optimizations
   */
  async optimize() {
    console.info('🚀 Starting asset optimization...\n');

    // Check logo size
    await this.checkLogoSize();
    
    // Analyze CSS for unused rules (basic analysis)
    await this.analyzeCSSUsage();
    
    // Check JSON file sizes
    await this.analyzeJSONFiles();
    
    // Generate optimization report
    this.generateReport();
  }

  /**
   * Check logo file size and provide optimization recommendations
   */
  async checkLogoSize() {
    try {
      const logoFiles = ['./Logo.png', './Logo_original.png'];
      
      console.info(`📸 Logo Analysis:`);
      
      for (const logoPath of logoFiles) {
        if (fs.existsSync(logoPath)) {
          const stats = fs.statSync(logoPath);
          const sizeKB = Math.round(stats.size / 1024);
          
          console.info(`   ${path.basename(logoPath)}: ${sizeKB}KB`);
          
          if (sizeKB > 200) {
            console.warn(`   ⚠️  Warning: ${path.basename(logoPath)} exceeds recommended 200KB limit`);
            console.info(`   💡 Recommendations:`);
            console.info(`      - Convert to WebP format (typically 25-35% smaller)`);
            console.info(`      - Use responsive images with multiple sizes`);
            console.info(`      - Consider SVG format if logo is vector-based`);
            console.info(`      - Compress PNG with tools like TinyPNG or ImageOptim`);
            
            this.optimizations.push({
              type: 'image',
              file: path.basename(logoPath),
              currentSize: sizeKB,
              recommendedSize: 150,
              potentialSavings: sizeKB - 150
            });
          } else {
            console.info(`   ✅ ${path.basename(logoPath)} size is within recommended limits`);
          }
        } else {
          console.info(`   ${path.basename(logoPath)} not found.`);
        }
      }
      
      console.info('');
    } catch (error) {
      console.error(`❌ Could not analyze logo: ${error.message}\n`);
    }
  }

  /**
   * Analyze CSS for potential optimizations
   */
  async analyzeCSSUsage() {
    try {
      const cssPath = './style.css';
      const cssContent = fs.readFileSync(cssPath, 'utf8');
      const sizeKB = Math.round(cssContent.length / 1024);
      
      console.info(`🎨 CSS Analysis:`);
      console.info(`   File size: ${sizeKB}KB`);
      
      // Count CSS rules
      const rules = cssContent.match(/[^{}]+\{[^{}]*\}/g) || [];
      console.info(`   CSS rules: ${rules.length}`);
      
      // Check for unused custom properties
      const customProps = cssContent.match(/--[\w-]+/g) || [];
      const uniqueProps = [...new Set(customProps)];
      console.info(`   Custom properties: ${uniqueProps.length}`);
      
      // Check for media queries
      const mediaQueries = cssContent.match(/@media[^{]+\{/g) || [];
      console.info(`   Media queries: ${mediaQueries.length}`);
      
      if (mediaQueries.length > 0) {
        console.info(`   ✅ Responsive design implemented`);
      }
      
      // Basic minification estimate
      const minifiedEstimate = cssContent
        .replace(/\s+/g, ' ')
        .replace(/;\s*}/g, '}')
        .replace(/\s*{\s*/g, '{')
        .replace(/;\s*/g, ';');
      
      const minifiedSize = Math.round(minifiedEstimate.length / 1024);
      const savings = sizeKB - minifiedSize;
      
      if (savings > 0) {
        console.info(`   💡 Minification could save ~${savings}KB`);
        this.optimizations.push({
          type: 'css',
          file: 'style.css',
          currentSize: sizeKB,
          minifiedSize,
          potentialSavings: savings
        });
      }
      
      console.info('');
    } catch (error) {
      console.error(`❌ Could not analyze CSS: ${error.message}\n`);
    }
  }

  /**
   * Analyze JSON file sizes and structure
   */
  async analyzeJSONFiles() {
    const jsonFiles = [
      'flavorverse_nodes.json',
      'cigar-specs.json',
      'pairings.json',
      'education.json',
      'features.json',
      'interface.json',
      'meta.json',
      'emotional.json',
      'lounge.json',
      'flavor-atlas.json'
    ];

    console.info(`📊 JSON Data Analysis:`);
    
    let totalSize = 0;
    let largestFile = { name: '', size: 0 };
    
    for (const file of jsonFiles) {
      try {
        const stats = fs.statSync(`./${file}`);
        const sizeKB = Math.round(stats.size / 1024);
        totalSize += sizeKB;
        
        console.info(`   ${file}: ${sizeKB}KB`);
        
        if (sizeKB > largestFile.size) {
          largestFile = { name: file, size: sizeKB };
        }
        
        // Analyze content for optimization opportunities
        const content = fs.readFileSync(`./${file}`, 'utf8');
        const parsed = JSON.parse(content);
        
        // Check for potential compression
        const minified = JSON.stringify(parsed);
        const compressedSize = Math.round(minified.length / 1024);
        const savings = sizeKB - compressedSize;
        
        if (savings > 1) {
          console.info(`     💡 Could save ${savings}KB with minification`);
        }
        
      } catch (error) {
        console.error(`     ❌ Could not analyze ${file}: ${error.message}`);
      }
    }
    
    console.info(`   Total JSON size: ${totalSize}KB`);
    console.info(`   Largest file: ${largestFile.name} (${largestFile.size}KB)`);
    
    if (totalSize > 500) {
      console.info(`   ⚠️  Total JSON size is quite large, consider:`);
      console.info(`      - Implementing lazy loading for non-critical data`);
      console.info(`      - Using compression (gzip) on server`);
      console.info(`      - Splitting large files into smaller chunks`);
    } else {
      console.info(`   ✅ JSON sizes are reasonable for web delivery`);
    }
    
    console.info('');
  }

  /**
   * Generate optimization report
   */
  generateReport() {
    console.info('📋 Optimization Report:');
    console.info('═'.repeat(50));
    
    if (this.optimizations.length === 0) {
      console.info('✅ No major optimizations needed! Your assets are well-optimized.');
      return;
    }
    
    this.optimizations.forEach((opt, index) => {
      console.info(`${index + 1}. ${opt.file} (${opt.type})`);
      console.info(`   Current size: ${opt.currentSize}KB`);
      console.info(`   Potential savings: ${opt.potentialSavings}KB`);
      console.info('');
    });
    
    const totalSavings = this.optimizations.reduce((sum, opt) => sum + opt.potentialSavings, 0);
    console.info(`💾 Total potential savings: ${totalSavings}KB`);
    
    console.info('\n🛠️  Recommended Actions:');
    console.info('1. Optimize logo.png using image compression tools');
    console.info('2. Enable gzip compression on your web server');
    console.info('3. Consider implementing a build process for minification');
    console.info('4. Use WebP format for images when possible');
    console.info('5. Implement lazy loading for non-critical resources');
  }

  /**
   * Create optimized versions (basic examples)
   */
  async createOptimizedVersions() {
    console.info('\n🔧 Creating optimized versions...');
    
    // Create minified CSS
    try {
      const cssContent = fs.readFileSync('./style.css', 'utf8');
      const minified = cssContent
        .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
        .replace(/\s+/g, ' ') // Compress whitespace
        .replace(/;\s*}/g, '}') // Remove unnecessary semicolons
        .replace(/\s*{\s*/g, '{') // Compress braces
        .replace(/;\s*/g, ';') // Compress semicolons
        .trim();
      
      fs.writeFileSync('./style.min.css', minified);
      console.info('✅ Created style.min.css');
    } catch (error) {
      console.error('❌ Failed to create minified CSS:', error.message);
    }
    
    // Create compressed JSON versions
    const jsonFiles = ['flavorverse_nodes.json', 'cigar-specs.json', 'pairings.json'];
    
    for (const file of jsonFiles) {
      try {
        const content = fs.readFileSync(`./${file}`, 'utf8');
        const parsed = JSON.parse(content);
        const minified = JSON.stringify(parsed);
        
        fs.writeFileSync(`./${file.replace('.json', '.min.json')}`, minified);
        console.info(`✅ Created ${file.replace('.json', '.min.json')}`);
      } catch (error) {
        console.error(`❌ Failed to create minified ${file}:`, error.message);
      }
    }
  }
}

// Run optimization if called directly
const __filename = fileURLToPath(import.meta.url);
if (process.argv[1] === __filename) {
  const optimizer = new AssetOptimizer();
  
  const args = process.argv.slice(2);
  
  if (args.includes('--create-optimized')) {
    optimizer.optimize().then(() => {
      return optimizer.createOptimizedVersions();
    });
  } else {
    optimizer.optimize();
  }
}

export default AssetOptimizer;