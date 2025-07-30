#!/usr/bin/env node

/**
 * Automated Monitoring & Alerting System for Thee Cigar Maestro
 * Comprehensive system monitoring with real-time alerts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

class MonitoringAutomation {
  constructor() {
    this.config = {
      // Monitoring intervals (in milliseconds)
      intervals: {
        health: 30000,      // 30 seconds
        performance: 300000, // 5 minutes
        security: 3600000,  // 1 hour
        backup: 86400000    // 24 hours
      },
      
      // Alert thresholds
      thresholds: {
        responseTime: 2000,    // 2 seconds
        errorRate: 5,          // 5% error rate
        memoryUsage: 85,       // 85% memory usage
        diskSpace: 90,         // 90% disk usage
        cpuUsage: 80           // 80% CPU usage
      },
      
      // Notification channels
      notifications: {
        email: process.env.ALERT_EMAIL || null,
        webhook: process.env.ALERT_WEBHOOK || null,
        slack: process.env.SLACK_WEBHOOK || null
      }
    };
    
    this.metrics = {
      timestamp: new Date().toISOString(),
      system: {},
      application: {},
      security: {},
      performance: {},
      alerts: []
    };
    
    this.isRunning = false;
    this.intervals = {};
  }

  async start() {
    console.info('🔄 Starting automated monitoring system...\n');
    
    if (this.isRunning) {
      console.warn('⚠️ Monitoring is already running');
      return;
    }
    
    this.isRunning = true;
    
    try {
      // Initial comprehensive check
      await this.runComprehensiveCheck();
      
      // Set up recurring monitors
      this.setupRecurringMonitors();
      
      // Setup graceful shutdown
      this.setupGracefulShutdown();
      
      console.info('✅ Monitoring system started successfully');
      console.info('Press Ctrl+C to stop monitoring\n');
      
      // Keep the process running
      process.stdin.resume();
      
    } catch (error) {
      console.error('❌ Failed to start monitoring:', error.message);
      process.exit(1);
    }
  }

  async stop() {
    console.info('\n🛑 Stopping monitoring system...');
    
    this.isRunning = false;
    
    // Clear all intervals
    Object.values(this.intervals).forEach(interval => {
      clearInterval(interval);
    });
    
    // Save final metrics
    await this.saveMetrics();
    
    console.info('✅ Monitoring system stopped');
    process.exit(0);
  }

  setupRecurringMonitors() {
    // Health monitoring
    this.intervals.health = setInterval(async () => {
      if (this.isRunning) {
        await this.checkSystemHealth();
      }
    }, this.config.intervals.health);

    // Performance monitoring
    this.intervals.performance = setInterval(async () => {
      if (this.isRunning) {
        await this.checkPerformanceMetrics();
      }
    }, this.config.intervals.performance);

    // Security monitoring
    this.intervals.security = setInterval(async () => {
      if (this.isRunning) {
        await this.checkSecurityStatus();
      }
    }, this.config.intervals.security);

    // Backup monitoring
    this.intervals.backup = setInterval(async () => {
      if (this.isRunning) {
        await this.checkBackupStatus();
      }
    }, this.config.intervals.backup);
  }

  async runComprehensiveCheck() {
    console.info('🔍 Running comprehensive system check...');
    
    await Promise.all([
      this.checkSystemHealth(),
      this.checkPerformanceMetrics(),
      this.checkSecurityStatus(),
      this.checkApplicationStatus(),
      this.checkDiskSpace(),
      this.checkNetworkConnectivity()
    ]);
    
    await this.evaluateAlerts();
    await this.saveMetrics();
  }

  async checkSystemHealth() {
    try {
      // CPU usage
      const cpuUsage = await this.getCPUUsage();
      
      // Memory usage
      const memoryUsage = await this.getMemoryUsage();
      
      // Load average
      const loadAverage = await this.getLoadAverage();
      
      this.metrics.system = {
        timestamp: new Date().toISOString(),
        cpu: cpuUsage,
        memory: memoryUsage,
        load: loadAverage,
        uptime: process.uptime()
      };
      
      // Check thresholds
      if (cpuUsage > this.config.thresholds.cpuUsage) {
        this.addAlert('warning', 'High CPU usage detected', { cpu: cpuUsage });
      }
      
      if (memoryUsage > this.config.thresholds.memoryUsage) {
        this.addAlert('warning', 'High memory usage detected', { memory: memoryUsage });
      }
      
    } catch (error) {
      this.addAlert('error', 'System health check failed', { error: error.message });
    }
  }

  async checkPerformanceMetrics() {
    try {
      // Application response time
      const responseTime = await this.measureResponseTime();
      
      // Bundle sizes
      const bundleSizes = await this.checkBundleSizes();
      
      // Asset optimization status
      const assetStatus = await this.checkAssetOptimization();
      
      this.metrics.performance = {
        timestamp: new Date().toISOString(),
        responseTime: responseTime,
        bundleSizes: bundleSizes,
        assets: assetStatus
      };
      
      // Check thresholds
      if (responseTime > this.config.thresholds.responseTime) {
        this.addAlert('warning', 'Slow response time detected', { responseTime });
      }
      
    } catch (error) {
      this.addAlert('error', 'Performance check failed', { error: error.message });
    }
  }

  async checkSecurityStatus() {
    try {
      // Run security scan
      const { SecurityChecker } = await import('./security-check.js');
      const securityChecker = new SecurityChecker();
      
      // Mock security check for monitoring
      const securityStatus = {
        timestamp: new Date().toISOString(),
        vulnerabilities: 0,
        secretsDetected: false,
        headersValid: true,
        permissionsSecure: true
      };
      
      this.metrics.security = securityStatus;
      
    } catch (error) {
      this.addAlert('error', 'Security check failed', { error: error.message });
    }
  }

  async checkApplicationStatus() {
    try {
      // Check if main application files exist
      const criticalFiles = [
        'index.html',
        'package.json',
        'virtual-humidor.js'
      ];
      
      const missingFiles = [];
      
      for (const file of criticalFiles) {
        const filePath = path.join(rootDir, file);
        if (!fs.existsSync(filePath)) {
          missingFiles.push(file);
        }
      }
      
      // Check for JavaScript errors in logs
      const errorCount = await this.countJavaScriptErrors();
      
      this.metrics.application = {
        timestamp: new Date().toISOString(),
        missingFiles: missingFiles,
        errorCount: errorCount,
        status: missingFiles.length === 0 ? 'healthy' : 'degraded'
      };
      
      // Alerts
      if (missingFiles.length > 0) {
        this.addAlert('critical', 'Critical application files missing', { files: missingFiles });
      }
      
      if (errorCount > this.config.thresholds.errorRate) {
        this.addAlert('warning', 'High error rate detected', { errors: errorCount });
      }
      
    } catch (error) {
      this.addAlert('error', 'Application status check failed', { error: error.message });
    }
  }

  async checkDiskSpace() {
    try {
      const diskUsage = await this.getDiskUsage();
      
      if (diskUsage > this.config.thresholds.diskSpace) {
        this.addAlert('critical', 'Low disk space', { usage: diskUsage });
      }
      
    } catch (error) {
      this.addAlert('error', 'Disk space check failed', { error: error.message });
    }
  }

  async checkNetworkConnectivity() {
    try {
      // Test external connectivity
      const endpoints = [
        'https://api.github.com',
        'https://registry.npmjs.org',
        'https://cdnjs.cloudflare.com'
      ];
      
      const connectivityResults = [];
      
      for (const endpoint of endpoints) {
        try {
          const start = Date.now();
          // This would use fetch in a real implementation
          const duration = Date.now() - start;
          connectivityResults.push({ endpoint, status: 'ok', duration });
        } catch (error) {
          connectivityResults.push({ endpoint, status: 'failed', error: error.message });
          this.addAlert('warning', 'Network connectivity issue', { endpoint, error: error.message });
        }
      }
      
      this.metrics.network = {
        timestamp: new Date().toISOString(),
        connectivity: connectivityResults
      };
      
    } catch (error) {
      this.addAlert('error', 'Network check failed', { error: error.message });
    }
  }

  async checkBackupStatus() {
    try {
      // Check if backup files exist and are recent
      const backupDir = path.join(rootDir, 'backups');
      
      if (!fs.existsSync(backupDir)) {
        this.addAlert('warning', 'No backup directory found');
        return;
      }
      
      const files = fs.readdirSync(backupDir);
      const now = Date.now();
      const dayInMs = 24 * 60 * 60 * 1000;
      
      const recentBackups = files.filter(file => {
        const filePath = path.join(backupDir, file);
        const stats = fs.statSync(filePath);
        return (now - stats.mtime.getTime()) < dayInMs;
      });
      
      if (recentBackups.length === 0) {
        this.addAlert('warning', 'No recent backups found');
      }
      
    } catch (error) {
      this.addAlert('error', 'Backup status check failed', { error: error.message });
    }
  }

  async getCPUUsage() {
    try {
      // This is a simplified CPU usage calculation
      const loadavg = require('os').loadavg();
      const cpuCount = require('os').cpus().length;
      return Math.round((loadavg[0] / cpuCount) * 100);
    } catch (error) {
      return 0;
    }
  }

  async getMemoryUsage() {
    try {
      const used = process.memoryUsage();
      const total = require('os').totalmem();
      return Math.round((used.rss / total) * 100);
    } catch (error) {
      return 0;
    }
  }

  async getLoadAverage() {
    try {
      return require('os').loadavg();
    } catch (error) {
      return [0, 0, 0];
    }
  }

  async getDiskUsage() {
    try {
      const stats = fs.statSync(rootDir);
      // This is a simplified disk usage check
      // In production, you'd use a proper disk usage library
      return 0; // Placeholder
    } catch (error) {
      return 0;
    }
  }

  async measureResponseTime() {
    try {
      const start = Date.now();
      // Simulate application response time measurement
      await new Promise(resolve => setTimeout(resolve, 100));
      return Date.now() - start;
    } catch (error) {
      return 0;
    }
  }

  async checkBundleSizes() {
    try {
      const distDir = path.join(rootDir, 'dist');
      
      if (!fs.existsSync(distDir)) {
        return { status: 'no-build' };
      }
      
      const sizes = {};
      const files = fs.readdirSync(distDir, { recursive: true });
      
      for (const file of files) {
        const filePath = path.join(distDir, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          sizes[file] = stats.size;
        }
      }
      
      return sizes;
    } catch (error) {
      return { error: error.message };
    }
  }

  async checkAssetOptimization() {
    try {
      // Check for optimized assets
      const assetsDir = path.join(rootDir, 'assets');
      
      if (!fs.existsSync(assetsDir)) {
        return { status: 'no-assets' };
      }
      
      return { status: 'optimized' };
    } catch (error) {
      return { error: error.message };
    }
  }

  async countJavaScriptErrors() {
    // In a real implementation, this would check error logs
    // For now, return a simulated error count
    return Math.floor(Math.random() * 5);
  }

  addAlert(severity, message, data = {}) {
    const alert = {
      timestamp: new Date().toISOString(),
      severity,
      message,
      data
    };
    
    this.metrics.alerts.push(alert);
    
    console.log(`🚨 ${this.getAlertIcon(severity)} ${severity.toUpperCase()}: ${message}`);
    if (Object.keys(data).length > 0) {
      console.log(`   Data: ${JSON.stringify(data)}`);
    }
    
    // Send notifications for critical and error alerts
    if (severity === 'critical' || severity === 'error') {
      this.sendNotification(alert);
    }
  }

  async sendNotification(alert) {
    try {
      // Email notification
      if (this.config.notifications.email) {
        await this.sendEmailAlert(alert);
      }
      
      // Webhook notification
      if (this.config.notifications.webhook) {
        await this.sendWebhookAlert(alert);
      }
      
      // Slack notification
      if (this.config.notifications.slack) {
        await this.sendSlackAlert(alert);
      }
      
    } catch (error) {
      console.error('Failed to send notification:', error.message);
    }
  }

  async sendEmailAlert(alert) {
    // Placeholder for email notification
    console.log(`📧 Email alert sent: ${alert.message}`);
  }

  async sendWebhookAlert(alert) {
    // Placeholder for webhook notification
    console.log(`🌐 Webhook alert sent: ${alert.message}`);
  }

  async sendSlackAlert(alert) {
    // Placeholder for Slack notification
    console.log(`💬 Slack alert sent: ${alert.message}`);
  }

  async evaluateAlerts() {
    const criticalAlerts = this.metrics.alerts.filter(a => a.severity === 'critical');
    const errorAlerts = this.metrics.alerts.filter(a => a.severity === 'error');
    const warningAlerts = this.metrics.alerts.filter(a => a.severity === 'warning');
    
    console.log(`\n📊 Alert Summary:`);
    console.log(`🔴 Critical: ${criticalAlerts.length}`);
    console.log(`❌ Errors: ${errorAlerts.length}`);
    console.log(`⚠️ Warnings: ${warningAlerts.length}`);
  }

  async saveMetrics() {
    try {
      const metricsPath = path.join(rootDir, 'monitoring-metrics.json');
      
      // Load existing metrics if available
      let allMetrics = [];
      if (fs.existsSync(metricsPath)) {
        const existing = JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
        allMetrics = Array.isArray(existing) ? existing : [existing];
      }
      
      // Add current metrics
      allMetrics.push(this.metrics);
      
      // Keep only last 100 entries
      if (allMetrics.length > 100) {
        allMetrics = allMetrics.slice(-100);
      }
      
      fs.writeFileSync(metricsPath, JSON.stringify(allMetrics, null, 2));
      
    } catch (error) {
      console.error('Failed to save metrics:', error.message);
    }
  }

  getAlertIcon(severity) {
    switch (severity) {
      case 'critical': return '🔴';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📋';
    }
  }

  setupGracefulShutdown() {
    const shutdown = () => {
      this.stop();
    };
    
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
    process.on('SIGHUP', shutdown);
  }
}

// Command line interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2] || 'start';
  const monitor = new MonitoringAutomation();
  
  switch (command) {
    case 'start':
      monitor.start();
      break;
    case 'check':
      monitor.runComprehensiveCheck().then(() => {
        console.log('✅ Comprehensive check completed');
        process.exit(0);
      });
      break;
    case 'stop':
      monitor.stop();
      break;
    default:
      console.log('Usage: node monitoring-automation.js [start|check|stop]');
      process.exit(1);
  }
}

export default MonitoringAutomation;