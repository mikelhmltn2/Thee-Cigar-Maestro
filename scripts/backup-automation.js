#!/usr/bin/env node

/**
 * Automated Backup & Recovery System for Thee Cigar Maestro
 * Comprehensive data protection with automated backup and recovery
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { createGzip } from 'zlib';
import { pipeline } from 'stream/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

class BackupAutomation {
  constructor() {
    this.config = {
      // Backup configuration
      backupDir: path.join(rootDir, 'backups'),
      
      // Backup schedules
      schedules: {
        critical: '0 */6 * * *',    // Every 6 hours
        daily: '0 2 * * *',         // Daily at 2 AM
        weekly: '0 2 * * 0',        // Weekly on Sunday
        monthly: '0 2 1 * *'        // Monthly on 1st
      },
      
      // Retention policies
      retention: {
        critical: 72,    // 72 hours (3 days)
        daily: 30,       // 30 days
        weekly: 12,      // 12 weeks
        monthly: 12      // 12 months
      },
      
      // Critical files and directories
      criticalPaths: [
        'package.json',
        'package-lock.json',
        '*.json',
        '*.js',
        '*.html',
        '*.css',
        '.github/',
        'scripts/',
        'assets/',
        'src/'
      ],
      
      // Exclusions
      excludePaths: [
        'node_modules/',
        'dist/',
        '.git/',
        '.next/',
        'coverage/',
        '*.log',
        '*.tmp'
      ],
      
      // Compression settings
      compression: {
        enabled: true,
        level: 6  // Balanced compression
      },
      
      // Cloud storage settings
      cloud: {
        enabled: process.env.BACKUP_CLOUD_ENABLED === 'true',
        provider: process.env.BACKUP_CLOUD_PROVIDER || 'local',
        bucket: process.env.BACKUP_CLOUD_BUCKET,
        accessKey: process.env.BACKUP_CLOUD_ACCESS_KEY,
        secretKey: process.env.BACKUP_CLOUD_SECRET_KEY
      }
    };
    
    this.stats = {
      startTime: null,
      endTime: null,
      filesBackedUp: 0,
      totalSize: 0,
      compressedSize: 0,
      errors: []
    };
  }

  async run(type = 'daily') {
    console.info(`🗄️ Starting ${type} backup automation...\n`);
    
    this.stats.startTime = new Date();
    
    try {
      // Initialize backup directory
      await this.initializeBackupDirectory();
      
      // Create backup
      const backupPath = await this.createBackup(type);
      
      // Verify backup
      await this.verifyBackup(backupPath);
      
      // Upload to cloud if enabled
      if (this.config.cloud.enabled) {
        await this.uploadToCloud(backupPath, type);
      }
      
      // Clean up old backups
      await this.cleanupOldBackups(type);
      
      // Generate backup report
      this.generateBackupReport(type, backupPath);
      
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
      this.stats.errors.push(error.message);
      process.exit(1);
    } finally {
      this.stats.endTime = new Date();
    }
  }

  async initializeBackupDirectory() {
    try {
      await fs.promises.mkdir(this.config.backupDir, { recursive: true });
      
      // Create subdirectories for each backup type
      for (const type of Object.keys(this.config.schedules)) {
        const typeDir = path.join(this.config.backupDir, type);
        await fs.promises.mkdir(typeDir, { recursive: true });
      }
      
      console.info('✅ Backup directories initialized');
      
    } catch (error) {
      throw new Error(`Failed to initialize backup directory: ${error.message}`);
    }
  }

  async createBackup(type) {
    console.info(`📦 Creating ${type} backup...`);
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `backup-${type}-${timestamp}`;
    const backupDir = path.join(this.config.backupDir, type, backupName);
    
    try {
      // Create backup directory
      await fs.promises.mkdir(backupDir, { recursive: true });
      
      // Copy critical files
      await this.copyFiles(rootDir, backupDir);
      
      // Create backup manifest
      await this.createBackupManifest(backupDir, type);
      
      // Compress backup if enabled
      let finalPath = backupDir;
      if (this.config.compression.enabled) {
        finalPath = await this.compressBackup(backupDir);
        
        // Remove uncompressed directory
        await fs.promises.rm(backupDir, { recursive: true, force: true });
      }
      
      console.info(`✅ Backup created: ${path.basename(finalPath)}`);
      return finalPath;
      
    } catch (error) {
      throw new Error(`Failed to create backup: ${error.message}`);
    }
  }

  async copyFiles(sourceDir, targetDir) {
    try {
      const items = await fs.promises.readdir(sourceDir, { withFileTypes: true });
      
      for (const item of items) {
        const sourcePath = path.join(sourceDir, item.name);
        const targetPath = path.join(targetDir, item.name);
        
        // Check if item should be excluded
        if (this.shouldExclude(sourcePath)) {
          continue;
        }
        
        // Check if item should be included
        if (!this.shouldInclude(sourcePath)) {
          continue;
        }
        
        if (item.isDirectory()) {
          await fs.promises.mkdir(targetPath, { recursive: true });
          await this.copyFiles(sourcePath, targetPath);
        } else {
          await fs.promises.copyFile(sourcePath, targetPath);
          
          const stats = await fs.promises.stat(sourcePath);
          this.stats.filesBackedUp++;
          this.stats.totalSize += stats.size;
        }
      }
      
    } catch (error) {
      throw new Error(`Failed to copy files: ${error.message}`);
    }
  }

  shouldExclude(filePath) {
    const relativePath = path.relative(rootDir, filePath);
    
    return this.config.excludePaths.some(pattern => {
      if (pattern.endsWith('/')) {
        return relativePath.startsWith(pattern) || relativePath.includes('/' + pattern);
      }
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(relativePath);
      }
      return relativePath === pattern || relativePath.endsWith('/' + pattern);
    });
  }

  shouldInclude(filePath) {
    const relativePath = path.relative(rootDir, filePath);
    
    // If no critical paths specified, include everything (except excluded)
    if (this.config.criticalPaths.length === 0) {
      return true;
    }
    
    return this.config.criticalPaths.some(pattern => {
      if (pattern.endsWith('/')) {
        return relativePath.startsWith(pattern) || relativePath.includes('/' + pattern);
      }
      if (pattern.includes('*')) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(relativePath);
      }
      return relativePath === pattern || relativePath.endsWith('/' + pattern);
    });
  }

  async createBackupManifest(backupDir, type) {
    const manifest = {
      version: '1.0.0',
      type: type,
      timestamp: new Date().toISOString(),
      source: rootDir,
      files: [],
      metadata: {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        hostname: require('os').hostname()
      }
    };
    
    // Get file list recursively
    const getFiles = async (dir, baseDir = backupDir) => {
      const items = await fs.promises.readdir(dir, { withFileTypes: true });
      
      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        const relativePath = path.relative(baseDir, fullPath);
        
        if (item.isDirectory()) {
          await getFiles(fullPath, baseDir);
        } else {
          const stats = await fs.promises.stat(fullPath);
          manifest.files.push({
            path: relativePath,
            size: stats.size,
            modified: stats.mtime.toISOString(),
            checksum: await this.calculateChecksum(fullPath)
          });
        }
      }
    };
    
    await getFiles(backupDir);
    
    // Save manifest
    const manifestPath = path.join(backupDir, 'backup-manifest.json');
    await fs.promises.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.info(`📋 Backup manifest created with ${manifest.files.length} files`);
  }

  async calculateChecksum(filePath) {
    try {
      const crypto = await import('crypto');
      const hash = crypto.createHash('sha256');
      const data = await fs.promises.readFile(filePath);
      hash.update(data);
      return hash.digest('hex');
    } catch (error) {
      return null;
    }
  }

  async compressBackup(backupDir) {
    console.info('🗜️ Compressing backup...');
    
    const compressedPath = `${backupDir}.tar.gz`;
    
    try {
      // Use tar with gzip compression
      const command = `tar -czf "${compressedPath}" -C "${path.dirname(backupDir)}" "${path.basename(backupDir)}"`;
      execSync(command, { stdio: 'inherit' });
      
      // Get compressed size
      const stats = await fs.promises.stat(compressedPath);
      this.stats.compressedSize = stats.size;
      
      const compressionRatio = ((this.stats.totalSize - this.stats.compressedSize) / this.stats.totalSize * 100).toFixed(1);
      console.info(`✅ Backup compressed (${compressionRatio}% reduction)`);
      
      return compressedPath;
      
    } catch (error) {
      throw new Error(`Failed to compress backup: ${error.message}`);
    }
  }

  async verifyBackup(backupPath) {
    console.info('🔍 Verifying backup integrity...');
    
    try {
      // Check if backup file exists and is readable
      await fs.promises.access(backupPath, fs.constants.R_OK);
      
      // Get file stats
      const stats = await fs.promises.stat(backupPath);
      
      if (stats.size === 0) {
        throw new Error('Backup file is empty');
      }
      
      // If compressed, test the archive
      if (backupPath.endsWith('.tar.gz')) {
        execSync(`tar -tzf "${backupPath}" > /dev/null`, { stdio: 'pipe' });
      }
      
      console.info('✅ Backup verification successful');
      
    } catch (error) {
      throw new Error(`Backup verification failed: ${error.message}`);
    }
  }

  async uploadToCloud(backupPath, type) {
    console.info('☁️ Uploading backup to cloud storage...');
    
    try {
      switch (this.config.cloud.provider) {
        case 's3':
          await this.uploadToS3(backupPath, type);
          break;
        case 'gcp':
          await this.uploadToGCP(backupPath, type);
          break;
        case 'azure':
          await this.uploadToAzure(backupPath, type);
          break;
        default:
          console.warn('⚠️ Unknown cloud provider, skipping upload');
      }
      
    } catch (error) {
      console.error('❌ Cloud upload failed:', error.message);
      this.stats.errors.push(`Cloud upload failed: ${error.message}`);
    }
  }

  async uploadToS3(backupPath, type) {
    // Placeholder for S3 upload implementation
    console.info('📤 S3 upload would happen here');
  }

  async uploadToGCP(backupPath, type) {
    // Placeholder for Google Cloud Storage upload
    console.info('📤 GCP upload would happen here');
  }

  async uploadToAzure(backupPath, type) {
    // Placeholder for Azure Blob Storage upload
    console.info('📤 Azure upload would happen here');
  }

  async cleanupOldBackups(type) {
    console.info('🧹 Cleaning up old backups...');
    
    try {
      const typeDir = path.join(this.config.backupDir, type);
      const retentionHours = this.config.retention[type] * 24; // Convert days to hours
      const cutoffTime = Date.now() - (retentionHours * 60 * 60 * 1000);
      
      const items = await fs.promises.readdir(typeDir, { withFileTypes: true });
      let deletedCount = 0;
      
      for (const item of items) {
        const itemPath = path.join(typeDir, item.name);
        const stats = await fs.promises.stat(itemPath);
        
        if (stats.mtime.getTime() < cutoffTime) {
          if (item.isDirectory()) {
            await fs.promises.rm(itemPath, { recursive: true, force: true });
          } else {
            await fs.promises.unlink(itemPath);
          }
          deletedCount++;
        }
      }
      
      if (deletedCount > 0) {
        console.info(`🗑️ Deleted ${deletedCount} old backup(s)`);
      } else {
        console.info('✅ No old backups to clean up');
      }
      
    } catch (error) {
      console.error('❌ Cleanup failed:', error.message);
      this.stats.errors.push(`Cleanup failed: ${error.message}`);
    }
  }

  generateBackupReport(type, backupPath) {
    const duration = this.stats.endTime - this.stats.startTime;
    const durationSeconds = Math.round(duration / 1000);
    
    console.info('\n📊 Backup Report:');
    console.info('═'.repeat(50));
    console.info(`Type: ${type}`);
    console.info(`Duration: ${durationSeconds}s`);
    console.info(`Files backed up: ${this.stats.filesBackedUp}`);
    console.info(`Total size: ${this.formatBytes(this.stats.totalSize)}`);
    
    if (this.config.compression.enabled) {
      console.info(`Compressed size: ${this.formatBytes(this.stats.compressedSize)}`);
      const ratio = ((this.stats.totalSize - this.stats.compressedSize) / this.stats.totalSize * 100).toFixed(1);
      console.info(`Compression ratio: ${ratio}%`);
    }
    
    console.info(`Backup location: ${backupPath}`);
    
    if (this.stats.errors.length > 0) {
      console.warn(`\n⚠️ Errors (${this.stats.errors.length}):`);
      this.stats.errors.forEach(error => console.warn(`  - ${error}`));
    }
    
    // Save report to file
    const report = {
      type,
      timestamp: this.stats.endTime.toISOString(),
      duration: durationSeconds,
      stats: this.stats,
      backupPath,
      config: this.config
    };
    
    const reportPath = path.join(this.config.backupDir, `backup-report-${type}-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.info(`\n📄 Report saved: ${reportPath}`);
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async restore(backupPath, targetDir = rootDir) {
    console.info(`🔄 Starting restore from: ${backupPath}`);
    
    try {
      // Verify backup exists
      await fs.promises.access(backupPath, fs.constants.R_OK);
      
      // Create temporary extraction directory
      const tempDir = path.join(require('os').tmpdir(), `restore-${Date.now()}`);
      await fs.promises.mkdir(tempDir, { recursive: true });
      
      try {
        // Extract backup
        if (backupPath.endsWith('.tar.gz')) {
          execSync(`tar -xzf "${backupPath}" -C "${tempDir}"`, { stdio: 'inherit' });
        } else {
          // Copy directory
          await this.copyFiles(backupPath, tempDir);
        }
        
        // Find the backup content directory
        const items = await fs.promises.readdir(tempDir);
        const backupContentDir = items.length === 1 ? path.join(tempDir, items[0]) : tempDir;
        
        // Load and verify manifest
        const manifestPath = path.join(backupContentDir, 'backup-manifest.json');
        if (fs.existsSync(manifestPath)) {
          const manifest = JSON.parse(await fs.promises.readFile(manifestPath, 'utf8'));
          console.info(`📋 Restoring from backup: ${manifest.type} (${manifest.timestamp})`);
        }
        
        // Copy files to target directory
        await this.copyFiles(backupContentDir, targetDir);
        
        console.info('✅ Restore completed successfully');
        
      } finally {
        // Clean up temporary directory
        await fs.promises.rm(tempDir, { recursive: true, force: true });
      }
      
    } catch (error) {
      throw new Error(`Restore failed: ${error.message}`);
    }
  }

  async listBackups(type = null) {
    console.info('📋 Available backups:');
    console.info('═'.repeat(50));
    
    try {
      const types = type ? [type] : Object.keys(this.config.schedules);
      
      for (const backupType of types) {
        const typeDir = path.join(this.config.backupDir, backupType);
        
        if (!fs.existsSync(typeDir)) {
          console.info(`${backupType}: No backups found`);
          continue;
        }
        
        const items = await fs.promises.readdir(typeDir, { withFileTypes: true });
        const backups = [];
        
        for (const item of items) {
          const itemPath = path.join(typeDir, item.name);
          const stats = await fs.promises.stat(itemPath);
          
          backups.push({
            name: item.name,
            path: itemPath,
            size: this.formatBytes(stats.size),
            modified: stats.mtime.toISOString()
          });
        }
        
        backups.sort((a, b) => new Date(b.modified) - new Date(a.modified));
        
        console.info(`\n${backupType.toUpperCase()} (${backups.length} backups):`);
        backups.forEach(backup => {
          console.info(`  📦 ${backup.name}`);
          console.info(`     Size: ${backup.size}`);
          console.info(`     Date: ${backup.modified}`);
        });
      }
      
    } catch (error) {
      console.error('❌ Failed to list backups:', error.message);
    }
  }
}

// Command line interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2] || 'daily';
  const backup = new BackupAutomation();
  
  switch (command) {
    case 'critical':
    case 'daily':
    case 'weekly':
    case 'monthly':
      backup.run(command);
      break;
    case 'restore':
      const backupPath = process.argv[3];
      const targetDir = process.argv[4];
      if (!backupPath) {
        console.error('Usage: node backup-automation.js restore <backup-path> [target-dir]');
        process.exit(1);
      }
      backup.restore(backupPath, targetDir);
      break;
    case 'list':
      const type = process.argv[3];
      backup.listBackups(type);
      break;
    default:
      console.log('Usage: node backup-automation.js [critical|daily|weekly|monthly|restore|list]');
      process.exit(1);
  }
}

export default BackupAutomation;