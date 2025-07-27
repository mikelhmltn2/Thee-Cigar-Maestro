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
    console.log('🚀 Starting asset optimization...\n');

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
      
      console.log(`📸 Logo Analysis:`);
      
      for (const logoPath of logoFiles) {
        if (fs.existsSync(logoPath)) {
          const stats = fs.statSync(logoPath);
          const sizeKB = Math.round(stats.size / 1024);
          
          console.log(`   ${path.basename(logoPath)}: ${sizeKB}KB`);
          
          if (sizeKB > 200) {
            console.log(`   ⚠️  Warning: ${path.basename(logoPath)} exceeds recommended 200KB limit`);
            console.log(`   💡 Recommendations:`);
            console.log(`      - Convert to WebP format (typically 25-35% smaller)`);
            console.log(`      - Use responsive images with multiple sizes`);
            console.log(`      - Consider SVG format if logo is vector-based`);
            console.log(`      - Compress PNG with tools like TinyPNG or ImageOptim`);
            
            this.optimizations.push({
              type: 'image',
              file: path.basename(logoPath),
              currentSize: sizeKB,
              recommendedSize: 150,
              potentialSavings: sizeKB - 150
            });
          } else {
            console.log(`   ✅ ${path.basename(logoPath)} size is within recommended limits`);
          }
        } else {
          console.log(`   ${path.basename(logoPath)} not found.`);
        }
      }
      
      console.log('');
    } catch (error) {
      console.log(`❌ Could not analyze logo: ${error.message}\n`);
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
      
      console.log(`🎨 CSS Analysis:`);
      console.log(`   File size: ${sizeKB}KB`);
      
      // Count CSS rules
      const rules = cssContent.match(/[^{}]+\{[^{}]*\}/g) || [];
      console.log(`   CSS rules: ${rules.length}`);
      
      // Check for unused custom properties
      const customProps = cssContent.match(/--[\w-]+/g) || [];
      const uniqueProps = [...new Set(customProps)];
      console.log(`   Custom properties: ${uniqueProps.length}`);
      
      // Check for media queries
      const mediaQueries = cssContent.match(/@media[^{]+\{/g) || [];
      console.log(`   Media queries: ${mediaQueries.length}`);
      
      if (mediaQueries.length > 0) {
        console.log(`   ✅ Responsive design implemented`);
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
        console.log(`   💡 Minification could save ~${savings}KB`);
        this.optimizations.push({
          type: 'css',
          file: 'style.css',
          currentSize: sizeKB,
          minifiedSize,
          potentialSavings: savings
        });
      }
      
      console.log('');
    } catch (error) {
      console.log(`❌ Could not analyze CSS: ${error.message}\n`);
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

    console.log(`📊 JSON Data Analysis:`);
    
    let totalSize = 0;
    let largestFile = { name: '', size: 0 };
    
    for (const file of jsonFiles) {
      try {
        const stats = fs.statSync(`./${file}`);
        const sizeKB = Math.round(stats.size / 1024);
        totalSize += sizeKB;
        
        console.log(`   ${file}: ${sizeKB}KB`);
        
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
          console.log(`     💡 Could save ${savings}KB with minification`);
        }
        
      } catch (error) {
        console.log(`     ❌ Could not analyze ${file}: ${error.message}`);
      }
    }
    
    console.log(`   Total JSON size: ${totalSize}KB`);
    console.log(`   Largest file: ${largestFile.name} (${largestFile.size}KB)`);
    
    if (totalSize > 500) {
      console.log(`   ⚠️  Total JSON size is quite large, consider:`);
      console.log(`      - Implementing lazy loading for non-critical data`);
      console.log(`      - Using compression (gzip) on server`);
      console.log(`      - Splitting large files into smaller chunks`);
    } else {
      console.log(`   ✅ JSON sizes are reasonable for web delivery`);
    }
    
    console.log('');
  }

  /**
   * Generate optimization report
   */
  generateReport() {
    console.log('📋 Optimization Report:');
    console.log('═'.repeat(50));
    
    if (this.optimizations.length === 0) {
      console.log('✅ No major optimizations needed! Your assets are well-optimized.');
      return;
    }
    
    this.optimizations.forEach((opt, index) => {
      console.log(`${index + 1}. ${opt.file} (${opt.type})`);
      console.log(`   Current size: ${opt.currentSize}KB`);
      console.log(`   Potential savings: ${opt.potentialSavings}KB`);
      console.log('');
    });
    
    const totalSavings = this.optimizations.reduce((sum, opt) => sum + opt.potentialSavings, 0);
    console.log(`💾 Total potential savings: ${totalSavings}KB`);
    
    console.log('\n🛠️  Recommended Actions:');
    console.log('1. Optimize logo.png using image compression tools');
    console.log('2. Enable gzip compression on your web server');
    console.log('3. Consider implementing a build process for minification');
    console.log('4. Use WebP format for images when possible');
    console.log('5. Implement lazy loading for non-critical resources');
  }

  /**
   * Create optimized versions (basic examples)
   */
  async createOptimizedVersions() {
    console.log('\n🔧 Creating optimized versions...');
    
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
      console.log('✅ Created style.min.css');
    } catch (error) {
      console.log('❌ Failed to create minified CSS:', error.message);
    }
    
    // Create compressed JSON versions
    const jsonFiles = ['flavorverse_nodes.json', 'cigar-specs.json', 'pairings.json'];
    
    for (const file of jsonFiles) {
      try {
        const content = fs.readFileSync(`./${file}`, 'utf8');
        const parsed = JSON.parse(content);
        const minified = JSON.stringify(parsed);
        
        fs.writeFileSync(`./${file.replace('.json', '.min.json')}`, minified);
        console.log(`✅ Created ${file.replace('.json', '.min.json')}`);
      } catch (error) {
        console.log(`❌ Failed to create minified ${file}:`, error.message);
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