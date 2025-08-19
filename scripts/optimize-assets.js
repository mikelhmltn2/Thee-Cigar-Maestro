#!/usr/bin/env node

/**
 * Asset Optimization Script for Thee Cigar Maestro
 * Optimizes images, compresses assets, and generates WebP variants
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class AssetOptimizer {
  constructor() {
    this.inputDir = process.cwd();
    this.outputDir = path.join(process.cwd(), 'dist', 'assets');
    this.tempDir = path.join(process.cwd(), 'temp');
    this.stats = {
      originalSize: 0,
      optimizedSize: 0,
      filesProcessed: 0,
      webpGenerated: 0,
    };
  }

  async run() {
    console.info('🖼️  Starting asset optimization...\n');

    try {
      await this.ensureDirectories();
      await this.optimizeLogo();
      await this.optimizeImages();
      await this.compressJSON();
      await this.generateWebPVariants();
      await this.createOptimizedCSS();
      await this.generateAssetManifest();
      await this.cleanup();

      this.printStats();
    } catch (error) {
      console.error('❌ Optimization failed:', error.message);
      process.exit(1);
    }
  }

  async ensureDirectories() {
    try {
      await fs.mkdir(this.outputDir, { recursive: true });
      await fs.mkdir(this.tempDir, { recursive: true });
      console.info('✅ Created output directories');
    } catch (error) {
      console.warn('⚠️  Could not create directories:', error.message);
    }
  }

  async optimizeLogo() {
    const logoPath = path.join(this.inputDir, 'logo.png');

    try {
      const stats = await fs.stat(logoPath);
      const originalSize = stats.size;
      this.stats.originalSize += originalSize;

      console.info(`📸 Optimizing logo.png (${this.formatFileSize(originalSize)})`);

      // Create optimized versions
      await this.optimizePNG(logoPath, path.join(this.outputDir, 'logo.png'));
      await this.generateWebP(logoPath, path.join(this.outputDir, 'logo.webp'));

      // Create different sizes for PWA
      const sizes = [192, 256, 384, 512];
      for (const size of sizes) {
        const outputPath = path.join(this.outputDir, `logo-${size}.png`);
        const webpPath = path.join(this.outputDir, `logo-${size}.webp`);

        await this.resizeImage(logoPath, outputPath, size, size);
        await this.generateWebP(outputPath, webpPath);
      }

      // Generate favicon
      await this.generateFavicon(logoPath);

      this.stats.filesProcessed++;
      console.info('✅ Logo optimization complete');
    } catch (error) {
      console.warn('⚠️  Could not optimize logo:', error.message);
    }
  }

  async optimizeImages() {
    const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg'];
    const files = await this.findFiles(this.inputDir, imageExtensions);

    for (const file of files) {
      if (file.includes('logo.png')) {
        continue;
      } // Already processed

      try {
        const stats = await fs.stat(file);
        const originalSize = stats.size;
        this.stats.originalSize += originalSize;

        const fileName = path.basename(file);
        const outputPath = path.join(this.outputDir, fileName);

        console.info(`📸 Optimizing ${fileName} (${this.formatFileSize(originalSize)})`);

        const ext = path.extname(file).toLowerCase();

        if (ext === '.png') {
          await this.optimizePNG(file, outputPath);
        } else if (ext === '.jpg' || ext === '.jpeg') {
          await this.optimizeJPEG(file, outputPath);
        } else if (ext === '.svg') {
          await this.optimizeSVG(file, outputPath);
        }

        // Generate WebP variant for raster images
        if (['.png', '.jpg', '.jpeg'].includes(ext)) {
          const webpPath = path.join(this.outputDir, fileName.replace(ext, '.webp'));
          await this.generateWebP(file, webpPath);
          this.stats.webpGenerated++;
        }

        this.stats.filesProcessed++;
      } catch (error) {
        console.warn(`⚠️  Could not optimize ${file}:`, error.message);
      }
    }
  }

  async optimizePNG(inputPath, outputPath) {
    try {
      // Use optipng for PNG optimization
      execSync(`optipng -o7 -out "${outputPath}" "${inputPath}"`, { stdio: 'pipe' });
    } catch (_error) {
      // Fallback: just copy the file
      await fs.copyFile(inputPath, outputPath);
    }

    const stats = await fs.stat(outputPath);
    this.stats.optimizedSize += stats.size;
  }

  async optimizeJPEG(inputPath, outputPath) {
    try {
      // Use jpegoptim for JPEG optimization
      execSync(`jpegoptim --max=85 --dest="${path.dirname(outputPath)}" "${inputPath}"`, {
        stdio: 'pipe',
      });
    } catch (_error) {
      // Fallback: just copy the file
      await fs.copyFile(inputPath, outputPath);
    }

    const stats = await fs.stat(outputPath);
    this.stats.optimizedSize += stats.size;
  }

  async optimizeSVG(inputPath, outputPath) {
    try {
      // Use svgo for SVG optimization
      execSync(`svgo --input "${inputPath}" --output "${outputPath}"`, { stdio: 'pipe' });
    } catch (_error) {
      // Fallback: just copy the file
      await fs.copyFile(inputPath, outputPath);
    }

    const stats = await fs.stat(outputPath);
    this.stats.optimizedSize += stats.size;
  }

  async generateWebP(inputPath, outputPath) {
    try {
      execSync(`cwebp -q 85 "${inputPath}" -o "${outputPath}"`, { stdio: 'pipe' });
    } catch (error) {
      console.warn(`⚠️  Could not generate WebP for ${inputPath}:`, error.message);
    }
  }

  async resizeImage(inputPath, outputPath, width, height) {
    try {
      execSync(`convert "${inputPath}" -resize ${width}x${height} "${outputPath}"`, {
        stdio: 'pipe',
      });
    } catch (_error) {
      // Fallback to just copying if ImageMagick is not available
      await fs.copyFile(inputPath, outputPath);
    }
  }

  async generateFavicon(logoPath) {
    const faviconPath = path.join(this.outputDir, 'favicon.ico');

    try {
      execSync(`convert "${logoPath}" -resize 32x32 "${faviconPath}"`, { stdio: 'pipe' });
      console.info('✅ Generated favicon.ico');
    } catch (error) {
      console.warn('⚠️  Could not generate favicon:', error.message);
    }
  }

  async compressJSON() {
    const jsonFiles = await this.findFiles(this.inputDir, ['.json']);

    for (const file of jsonFiles) {
      try {
        const fileName = path.basename(file);
        const outputPath = path.join(this.outputDir, fileName);

        const content = await fs.readFile(file, 'utf8');
        const parsed = JSON.parse(content);
        const minified = JSON.stringify(parsed);

        await fs.writeFile(outputPath, minified);

        const originalSize = Buffer.byteLength(content);
        const compressedSize = Buffer.byteLength(minified);

        this.stats.originalSize += originalSize;
        this.stats.optimizedSize += compressedSize;
        this.stats.filesProcessed++;

        console.info(
          `📄 Compressed ${fileName}: ${this.formatFileSize(originalSize)} → ${this.formatFileSize(compressedSize)}`
        );
      } catch (error) {
        console.warn(`⚠️  Could not compress ${file}:`, error.message);
      }
    }
  }

  async generateWebPVariants() {
    console.info(`✅ Generated ${this.stats.webpGenerated} WebP variants`);
  }

  async createOptimizedCSS() {
    const cssFiles = await this.findFiles(this.inputDir, ['.css']);

    for (const file of cssFiles) {
      try {
        const fileName = path.basename(file);
        const outputPath = path.join(this.outputDir, fileName);

        const content = await fs.readFile(file, 'utf8');

        // Basic CSS minification
        const minified = content
          .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
          .replace(/\s+/g, ' ') // Compress whitespace
          .replace(/;\s*}/g, '}') // Remove unnecessary semicolons
          .replace(/\s*{\s*/g, '{') // Remove spaces around braces
          .replace(/;\s*/g, ';') // Remove spaces after semicolons
          .trim();

        await fs.writeFile(outputPath, minified);

        const originalSize = Buffer.byteLength(content);
        const compressedSize = Buffer.byteLength(minified);

        this.stats.originalSize += originalSize;
        this.stats.optimizedSize += compressedSize;
        this.stats.filesProcessed++;

        console.info(
          `🎨 Minified ${fileName}: ${this.formatFileSize(originalSize)} → ${this.formatFileSize(compressedSize)}`
        );
      } catch (error) {
        console.warn(`⚠️  Could not optimize ${file}:`, error.message);
      }
    }
  }

  async generateAssetManifest() {
    const manifest = {
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      assets: [],
      optimizationStats: this.stats,
    };

    try {
      const files = await fs.readdir(this.outputDir);

      for (const file of files) {
        const filePath = path.join(this.outputDir, file);
        const stats = await fs.stat(filePath);

        if (stats.isFile()) {
          manifest.assets.push({
            name: file,
            size: stats.size,
            type: this.getAssetType(file),
            hash: await this.generateFileHash(filePath),
          });
        }
      }

      await fs.writeFile(
        path.join(this.outputDir, 'manifest.json'),
        JSON.stringify(manifest, null, 2)
      );

      console.info('✅ Generated asset manifest');
    } catch (error) {
      console.warn('⚠️  Could not generate manifest:', error.message);
    }
  }

  async generateFileHash(filePath) {
    try {
      const crypto = require('crypto');
      const content = await fs.readFile(filePath);
      return crypto.createHash('md5').update(content).digest('hex').substring(0, 8);
    } catch (_error) {
      return 'unknown';
    }
  }

  getAssetType(fileName) {
    const ext = path.extname(fileName).toLowerCase();

    if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico'].includes(ext)) {
      return 'image';
    } else if (['.css'].includes(ext)) {
      return 'stylesheet';
    } else if (['.js'].includes(ext)) {
      return 'script';
    } else if (['.json'].includes(ext)) {
      return 'data';
    } else {
      return 'other';
    }
  }

  async findFiles(dir, extensions) {
    const files = [];

    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          files.push(...(await this.findFiles(fullPath, extensions)));
        } else if (entry.isFile()) {
          const ext = path.extname(entry.name).toLowerCase();
          if (extensions.includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️  Could not read directory ${dir}:`, error.message);
    }

    return files;
  }

  async cleanup() {
    try {
      await fs.rmdir(this.tempDir, { recursive: true });
      console.info('✅ Cleaned up temporary files');
    } catch (_error) {
      // Ignore cleanup errors
    }
  }

  formatFileSize(bytes) {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${Math.round(size * 100) / 100} ${units[unitIndex]}`;
  }

  printStats() {
    const savings = this.stats.originalSize - this.stats.optimizedSize;
    const percentage =
      this.stats.originalSize > 0 ? ((savings / this.stats.originalSize) * 100).toFixed(1) : 0;

    console.info('\n📊 Optimization Summary:');
    console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.info(`📁 Files processed: ${this.stats.filesProcessed}`);
    console.info(`🖼️  WebP variants: ${this.stats.webpGenerated}`);
    console.info(`📦 Original size: ${this.formatFileSize(this.stats.originalSize)}`);
    console.info(`📦 Optimized size: ${this.formatFileSize(this.stats.optimizedSize)}`);
    console.info(`💾 Space saved: ${this.formatFileSize(savings)} (${percentage}%)`);
    console.info('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.info('✅ Asset optimization complete!\n');
  }
}

// Run if called directly
if (require.main === module) {
  const optimizer = new AssetOptimizer();
  optimizer.run().catch(error => {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  });
}

module.exports = AssetOptimizer;
