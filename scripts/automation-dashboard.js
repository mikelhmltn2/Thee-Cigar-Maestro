#!/usr/bin/env node

/**
 * Automation Dashboard for Thee Cigar Maestro
 * Centralized control panel for all automation systems
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

class AutomationDashboard {
  constructor() {
    this.config = {
      refreshInterval: 30000, // 30 seconds
      maxLogEntries: 1000,
      dashboardPort: 3002
    };
    
    this.status = {
      timestamp: new Date().toISOString(),
      systems: {
        cicd: { status: 'unknown', lastCheck: null, details: {} },
        monitoring: { status: 'unknown', lastCheck: null, details: {} },
        security: { status: 'unknown', lastCheck: null, details: {} },
        backup: { status: 'unknown', lastCheck: null, details: {} },
        performance: { status: 'unknown', lastCheck: null, details: {} },
        health: { status: 'unknown', lastCheck: null, details: {} }
      },
      alerts: [],
      metrics: {},
      logs: []
    };
    
    this.isRunning = false;
  }

  async start() {
    console.info('🎛️ Starting Automation Dashboard...\n');
    
    if (this.isRunning) {
      console.warn('⚠️ Dashboard is already running');
      return;
    }
    
    this.isRunning = true;
    
    try {
      // Initial system check
      await this.checkAllSystems();
      
      // Start periodic monitoring
      this.startPeriodicChecks();
      
      // Setup graceful shutdown
      this.setupGracefulShutdown();
      
      // Display dashboard
      this.displayDashboard();
      
      console.info('\n✅ Automation Dashboard started successfully');
      console.info('Press Ctrl+C to stop dashboard\n');
      
      // Keep the process running
      process.stdin.resume();
      
    } catch (error) {
      console.error('❌ Failed to start dashboard:', error.message);
      process.exit(1);
    }
  }

  async stop() {
    console.info('\n🛑 Stopping Automation Dashboard...');
    
    this.isRunning = false;
    
    // Save final status
    await this.saveStatus();
    
    console.info('✅ Dashboard stopped');
    process.exit(0);
  }

  startPeriodicChecks() {
    setInterval(async () => {
      if (this.isRunning) {
        await this.checkAllSystems();
        this.displayDashboard();
      }
    }, this.config.refreshInterval);
  }

  async checkAllSystems() {
    const checks = [
      this.checkCICDStatus(),
      this.checkMonitoringStatus(),
      this.checkSecurityStatus(),
      this.checkBackupStatus(),
      this.checkPerformanceStatus(),
      this.checkHealthStatus()
    ];
    
    await Promise.allSettled(checks);
    
    // Update overall status
    this.status.timestamp = new Date().toISOString();
    
    // Save status to file
    await this.saveStatus();
  }

  async checkCICDStatus() {
    try {
      // Check GitHub Actions status
      const workflowsDir = path.join(rootDir, '.github', 'workflows');
      
      if (fs.existsSync(workflowsDir)) {
        const workflows = fs.readdirSync(workflowsDir);
        
        this.status.systems.cicd = {
          status: 'active',
          lastCheck: new Date().toISOString(),
          details: {
            workflows: workflows.length,
            files: workflows
          }
        };
      } else {
        this.status.systems.cicd = {
          status: 'inactive',
          lastCheck: new Date().toISOString(),
          details: { error: 'No workflows directory found' }
        };
      }
      
    } catch (error) {
      this.status.systems.cicd = {
        status: 'error',
        lastCheck: new Date().toISOString(),
        details: { error: error.message }
      };
    }
  }

  async checkMonitoringStatus() {
    try {
      const metricsFile = path.join(rootDir, 'monitoring-metrics.json');
      
      if (fs.existsSync(metricsFile)) {
        const metrics = JSON.parse(fs.readFileSync(metricsFile, 'utf8'));
        const latest = Array.isArray(metrics) ? metrics[metrics.length - 1] : metrics;
        
        this.status.systems.monitoring = {
          status: 'active',
          lastCheck: new Date().toISOString(),
          details: {
            lastMetrics: latest.timestamp,
            alertCount: latest.alerts?.length || 0
          }
        };
      } else {
        this.status.systems.monitoring = {
          status: 'inactive',
          lastCheck: new Date().toISOString(),
          details: { error: 'No monitoring metrics found' }
        };
      }
      
    } catch (error) {
      this.status.systems.monitoring = {
        status: 'error',
        lastCheck: new Date().toISOString(),
        details: { error: error.message }
      };
    }
  }

  async checkSecurityStatus() {
    try {
      const securityReport = path.join(rootDir, 'security-report.json');
      
      if (fs.existsSync(securityReport)) {
        const report = JSON.parse(fs.readFileSync(securityReport, 'utf8'));
        
        this.status.systems.security = {
          status: report.overall === 'passed' ? 'secure' : 'warning',
          lastCheck: new Date().toISOString(),
          details: {
            overall: report.overall,
            lastScan: report.timestamp,
            issues: report.summary
          }
        };
      } else {
        this.status.systems.security = {
          status: 'unknown',
          lastCheck: new Date().toISOString(),
          details: { error: 'No security report found' }
        };
      }
      
    } catch (error) {
      this.status.systems.security = {
        status: 'error',
        lastCheck: new Date().toISOString(),
        details: { error: error.message }
      };
    }
  }

  async checkBackupStatus() {
    try {
      const backupDir = path.join(rootDir, 'backups');
      
      if (fs.existsSync(backupDir)) {
        const types = ['critical', 'daily', 'weekly', 'monthly'];
        const backupCounts = {};
        
        for (const type of types) {
          const typeDir = path.join(backupDir, type);
          if (fs.existsSync(typeDir)) {
            backupCounts[type] = fs.readdirSync(typeDir).length;
          } else {
            backupCounts[type] = 0;
          }
        }
        
        this.status.systems.backup = {
          status: 'active',
          lastCheck: new Date().toISOString(),
          details: backupCounts
        };
      } else {
        this.status.systems.backup = {
          status: 'inactive',
          lastCheck: new Date().toISOString(),
          details: { error: 'No backup directory found' }
        };
      }
      
    } catch (error) {
      this.status.systems.backup = {
        status: 'error',
        lastCheck: new Date().toISOString(),
        details: { error: error.message }
      };
    }
  }

  async checkPerformanceStatus() {
    try {
      const performanceReport = path.join(rootDir, 'performance-report.json');
      
      if (fs.existsSync(performanceReport)) {
        const report = JSON.parse(fs.readFileSync(performanceReport, 'utf8'));
        
        this.status.systems.performance = {
          status: 'active',
          lastCheck: new Date().toISOString(),
          details: {
            lastTest: report.timestamp,
            metrics: report.summary
          }
        };
      } else {
        this.status.systems.performance = {
          status: 'unknown',
          lastCheck: new Date().toISOString(),
          details: { error: 'No performance report found' }
        };
      }
      
    } catch (error) {
      this.status.systems.performance = {
        status: 'error',
        lastCheck: new Date().toISOString(),
        details: { error: error.message }
      };
    }
  }

  async checkHealthStatus() {
    try {
      // Check if critical application files exist
      const criticalFiles = [
        'package.json',
        'index.html',
        'virtual-humidor.js'
      ];
      
      const missingFiles = criticalFiles.filter(file => 
        !fs.existsSync(path.join(rootDir, file))
      );
      
      this.status.systems.health = {
        status: missingFiles.length === 0 ? 'healthy' : 'degraded',
        lastCheck: new Date().toISOString(),
        details: {
          criticalFiles: criticalFiles.length,
          missingFiles: missingFiles
        }
      };
      
    } catch (error) {
      this.status.systems.health = {
        status: 'error',
        lastCheck: new Date().toISOString(),
        details: { error: error.message }
      };
    }
  }

  displayDashboard() {
    // Clear screen
    console.clear();
    
    // Dashboard header
    console.info('🎛️  THEE CIGAR MAESTRO - AUTOMATION DASHBOARD');
    console.info('═'.repeat(80));
    console.info(`📅 Last Updated: ${new Date().toLocaleString()}`);
    console.info('');
    
    // System status overview
    console.info('📊 SYSTEM STATUS OVERVIEW');
    console.info('─'.repeat(40));
    
    for (const [system, status] of Object.entries(this.status.systems)) {
      const icon = this.getStatusIcon(status.status);
      const statusText = status.status.toUpperCase().padEnd(10);
      const systemText = system.toUpperCase().padEnd(12);
      
      console.info(`${icon} ${systemText} ${statusText} (${this.getTimeAgo(status.lastCheck)})`);
    }
    
    console.info('');
    
    // Detailed status
    console.info('🔍 DETAILED STATUS');
    console.info('─'.repeat(40));
    
    for (const [system, status] of Object.entries(this.status.systems)) {
      if (status.details && Object.keys(status.details).length > 0) {
        console.info(`\n${system.toUpperCase()}:`);
        
        for (const [key, value] of Object.entries(status.details)) {
          if (typeof value === 'object') {
            console.info(`  ${key}: ${JSON.stringify(value)}`);
          } else {
            console.info(`  ${key}: ${value}`);
          }
        }
      }
    }
    
    // Recent alerts
    if (this.status.alerts.length > 0) {
      console.info('\n🚨 RECENT ALERTS');
      console.info('─'.repeat(40));
      
      this.status.alerts.slice(-5).forEach(alert => {
        const icon = this.getAlertIcon(alert.severity);
        console.info(`${icon} ${alert.message} (${this.getTimeAgo(alert.timestamp)})`);
      });
    }
    
    // Quick actions
    console.info('\n🎮 QUICK ACTIONS');
    console.info('─'.repeat(40));
    console.info('• npm run health:check     - Run health check');
    console.info('• npm run security:scan    - Run security scan');
    console.info('• npm run backup:daily     - Create daily backup');
    console.info('• npm run monitor:check    - Run monitoring check');
    console.info('• npm run automation:all   - Run all automation');
    
    console.info('');
  }

  getStatusIcon(status) {
    switch (status) {
      case 'active':
      case 'healthy':
      case 'secure': return '✅';
      case 'warning':
      case 'degraded': return '⚠️';
      case 'error':
      case 'inactive': return '❌';
      default: return '❓';
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

  getTimeAgo(timestamp) {
    if (!timestamp) return 'Never';
    
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now - time;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }

  async saveStatus() {
    try {
      const statusPath = path.join(rootDir, 'automation-status.json');
      fs.writeFileSync(statusPath, JSON.stringify(this.status, null, 2));
    } catch (error) {
      console.error('Failed to save status:', error.message);
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

  // Management commands
  async runAutomationSuite() {
    console.info('🚀 Running complete automation suite...\n');
    
    const tasks = [
      { name: 'Health Check', command: 'npm run health:check' },
      { name: 'Security Scan', command: 'npm run security:scan' },
      { name: 'Asset Optimization', command: 'npm run assets:optimize' },
      { name: 'Performance Test', command: 'npm run performance:test' }
    ];
    
    for (const task of tasks) {
      try {
        console.info(`🔄 Running ${task.name}...`);
        execSync(task.command, { stdio: 'inherit', cwd: rootDir });
        console.info(`✅ ${task.name} completed\n`);
      } catch (error) {
        console.error(`❌ ${task.name} failed: ${error.message}\n`);
      }
    }
    
    console.info('🎉 Automation suite completed!');
  }

  async generateReport() {
    console.info('📊 Generating automation report...\n');
    
    const report = {
      generated: new Date().toISOString(),
      summary: {
        systemsActive: Object.values(this.status.systems).filter(s => 
          ['active', 'healthy', 'secure'].includes(s.status)
        ).length,
        totalSystems: Object.keys(this.status.systems).length,
        alertsLast24h: this.status.alerts.filter(a => 
          new Date(a.timestamp) > new Date(Date.now() - 24 * 60 * 60 * 1000)
        ).length
      },
      systems: this.status.systems,
      recommendations: this.generateRecommendations()
    };
    
    const reportPath = path.join(rootDir, `automation-report-${Date.now()}.json`);
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    console.info(`📄 Report saved: ${reportPath}`);
    return report;
  }

  generateRecommendations() {
    const recommendations = [];
    
    for (const [system, status] of Object.entries(this.status.systems)) {
      if (status.status === 'inactive') {
        recommendations.push({
          priority: 'high',
          system,
          message: `${system} system is inactive and should be enabled`,
          action: `Review and restart ${system} automation`
        });
      } else if (status.status === 'error') {
        recommendations.push({
          priority: 'critical',
          system,
          message: `${system} system has errors that need attention`,
          action: `Investigate and fix ${system} errors`
        });
      }
    }
    
    return recommendations;
  }
}

// Command line interface
if (import.meta.url === `file://${process.argv[1]}`) {
  const command = process.argv[2] || 'start';
  const dashboard = new AutomationDashboard();
  
  switch (command) {
    case 'start':
      dashboard.start();
      break;
    case 'check':
      dashboard.checkAllSystems().then(() => {
        dashboard.displayDashboard();
        process.exit(0);
      });
      break;
    case 'report':
      dashboard.generateReport().then(() => {
        console.log('✅ Report generated');
        process.exit(0);
      });
      break;
    case 'run-all':
      dashboard.runAutomationSuite().then(() => {
        process.exit(0);
      });
      break;
    default:
      console.log('Usage: node automation-dashboard.js [start|check|report|run-all]');
      process.exit(1);
  }
}

export default AutomationDashboard;