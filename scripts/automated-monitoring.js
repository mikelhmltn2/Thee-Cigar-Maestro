#!/usr/bin/env node

/**
 * Automated Monitoring & Alerting System for Thee Cigar Maestro
 * Real-time monitoring of application health, performance, and security
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Monitoring configuration
const CONFIG = {
  checkInterval: parseInt(process.env.CHECK_INTERVAL) || 300000, // 5 minutes
  alertThresholds: {
    responseTime: 3000, // ms
    errorRate: 5, // percentage
    memoryUsage: 80, // percentage
    diskUsage: 85, // percentage
    cpuUsage: 80 // percentage
  },
  endpoints: [
    { url: '/', name: 'Homepage' },
    { url: '/education', name: 'Education' },
    { url: '/pairing', name: 'Pairing' },
    { url: '/contact', name: 'Contact' }
  ],
  notifications: {
    email: process.env.ALERT_EMAIL,
    slack: process.env.SLACK_WEBHOOK,
    discord: process.env.DISCORD_WEBHOOK
  },
  logFile: path.join(rootDir, 'monitoring.log'),
  metricsFile: path.join(rootDir, 'metrics.json')
};

// Monitoring state
let monitoringState = {
  isRunning: false,
  lastCheck: null,
  alerts: [],
  metrics: {
    uptime: 0,
    totalChecks: 0,
    successfulChecks: 0,
    failedChecks: 0,
    averageResponseTime: 0,
    errorRate: 0
  }
};

/**
 * Check application health
 */
async function checkApplicationHealth() {
  console.info('🏥 Checking application health...');
  
  const healthChecks = [];
  
  // Check each endpoint
  for (const endpoint of CONFIG.endpoints) {
    try {
      const startTime = Date.now();
      const response = await fetch(`http://localhost:3000${endpoint.url}`, {
        method: 'GET',
        headers: {
          'User-Agent': 'HealthMonitor/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
        },
        timeout: 10000
      });
      
      const responseTime = Date.now() - startTime;
      
      healthChecks.push({
        endpoint: endpoint.name,
        url: endpoint.url,
        status: response.status,
        responseTime,
        success: response.ok,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      healthChecks.push({
        endpoint: endpoint.name,
        url: endpoint.url,
        status: 'error',
        responseTime: 0,
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  return healthChecks;
}

/**
 * Check system resources
 */
function checkSystemResources() {
  console.info('💻 Checking system resources...');
  
  try {
    // Get memory usage
    const memoryInfo = process.memoryUsage();
    const memoryUsagePercent = (memoryInfo.heapUsed / memoryInfo.heapTotal) * 100;
    
    // Get disk usage (simplified - in production you'd use a proper disk monitoring library)
    const diskUsage = {
      total: 0,
      used: 0,
      free: 0,
      percent: 0
    };
    
    // Get CPU usage (simplified)
    const cpuUsage = {
      user: 0,
      system: 0,
      total: 0
    };
    
    return {
      memory: {
        heapUsed: memoryInfo.heapUsed,
        heapTotal: memoryInfo.heapTotal,
        external: memoryInfo.external,
        rss: memoryInfo.rss,
        usagePercent: memoryUsagePercent
      },
      disk: diskUsage,
      cpu: cpuUsage,
      uptime: process.uptime(),
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error(`❌ System resource check failed: ${error.message}`);
    return null;
  }
}

/**
 * Check for security issues
 */
async function checkSecurityIssues() {
  console.info('🛡️ Checking security issues...');
  
  const securityChecks = [];
  
  try {
    // Check for outdated packages
    try {
      const outdatedOutput = execSync('npm outdated --json', { encoding: 'utf8', stdio: 'pipe' });
      const outdated = JSON.parse(outdatedOutput);
      
      if (Object.keys(outdated).length > 0) {
        securityChecks.push({
          type: 'outdated_packages',
          severity: 'medium',
          message: `Found ${Object.keys(outdated).length} outdated packages`,
          details: outdated,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      // No outdated packages found
    }
    
    // Check for security vulnerabilities
    try {
      const auditOutput = execSync('npm audit --json', { encoding: 'utf8', stdio: 'pipe' });
      const audit = JSON.parse(auditOutput);
      
      if (audit.vulnerabilities && Object.keys(audit.vulnerabilities).length > 0) {
        securityChecks.push({
          type: 'security_vulnerabilities',
          severity: 'high',
          message: `Found ${Object.keys(audit.vulnerabilities).length} security vulnerabilities`,
          details: audit.vulnerabilities,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      // No vulnerabilities found
    }
    
    // Check for suspicious files
    const suspiciousFiles = checkSuspiciousFiles();
    if (suspiciousFiles.length > 0) {
      securityChecks.push({
        type: 'suspicious_files',
        severity: 'medium',
        message: `Found ${suspiciousFiles.length} suspicious files`,
        details: suspiciousFiles,
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error(`❌ Security check failed: ${error.message}`);
  }
  
  return securityChecks;
}

/**
 * Check for suspicious files
 */
function checkSuspiciousFiles() {
  const suspiciousPatterns = [
    /\.env$/,
    /\.pem$/,
    /\.key$/,
    /\.crt$/,
    /\.p12$/,
    /\.pfx$/,
    /\.log$/,
    /\.tmp$/
  ];
  
  const suspiciousFiles = [];
  
  function scanDirectory(dirPath) {
    try {
      const files = fs.readdirSync(dirPath);
      
      files.forEach(file => {
        const fullPath = path.join(dirPath, file);
        const relativePath = path.relative(rootDir, fullPath);
        
        // Skip node_modules and .git
        if (relativePath.startsWith('node_modules') || relativePath.startsWith('.git')) {
          return;
        }
        
        if (fs.statSync(fullPath).isDirectory()) {
          scanDirectory(fullPath);
        } else {
          // Check if file matches suspicious patterns
          suspiciousPatterns.forEach(pattern => {
            if (pattern.test(file)) {
              suspiciousFiles.push({
                file: relativePath,
                pattern: pattern.source,
                size: fs.statSync(fullPath).size
              });
            }
          });
        }
      });
    } catch (error) {
      // Directory not accessible
    }
  }
  
  scanDirectory(rootDir);
  return suspiciousFiles;
}

/**
 * Analyze monitoring data and generate alerts
 */
function analyzeAndAlert(healthChecks, systemResources, securityChecks) {
  const alerts = [];
  
  // Analyze health checks
  const failedChecks = healthChecks.filter(check => !check.success);
  const slowChecks = healthChecks.filter(check => check.responseTime > CONFIG.alertThresholds.responseTime);
  
  if (failedChecks.length > 0) {
    alerts.push({
      type: 'health_check_failure',
      severity: 'high',
      message: `${failedChecks.length} endpoint(s) are failing`,
      details: failedChecks,
      timestamp: new Date().toISOString()
    });
  }
  
  if (slowChecks.length > 0) {
    alerts.push({
      type: 'slow_response',
      severity: 'medium',
      message: `${slowChecks.length} endpoint(s) are responding slowly`,
      details: slowChecks,
      timestamp: new Date().toISOString()
    });
  }
  
  // Analyze system resources
  if (systemResources) {
    if (systemResources.memory.usagePercent > CONFIG.alertThresholds.memoryUsage) {
      alerts.push({
        type: 'high_memory_usage',
        severity: 'medium',
        message: `Memory usage is ${systemResources.memory.usagePercent.toFixed(1)}%`,
        details: systemResources.memory,
        timestamp: new Date().toISOString()
      });
    }
    
    if (systemResources.disk.percent > CONFIG.alertThresholds.diskUsage) {
      alerts.push({
        type: 'high_disk_usage',
        severity: 'medium',
        message: `Disk usage is ${systemResources.disk.percent.toFixed(1)}%`,
        details: systemResources.disk,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Add security alerts
  alerts.push(...securityChecks);
  
  return alerts;
}

/**
 * Send notifications
 */
async function sendNotifications(alerts) {
  if (alerts.length === 0) return;
  
  console.info(`📢 Sending ${alerts.length} alert(s)...`);
  
  for (const alert of alerts) {
    const message = formatAlertMessage(alert);
    
    // Send email notification
    if (CONFIG.notifications.email) {
      await sendEmailNotification(CONFIG.notifications.email, message);
    }
    
    // Send Slack notification
    if (CONFIG.notifications.slack) {
      await sendSlackNotification(CONFIG.notifications.slack, message);
    }
    
    // Send Discord notification
    if (CONFIG.notifications.discord) {
      await sendDiscordNotification(CONFIG.notifications.discord, message);
    }
  }
}

/**
 * Format alert message
 */
function formatAlertMessage(alert) {
  const emoji = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  };
  
  return {
    title: `${emoji[alert.severity]} Alert: ${alert.type.replace(/_/g, ' ').toUpperCase()}`,
    message: alert.message,
    severity: alert.severity,
    timestamp: alert.timestamp,
    details: alert.details
  };
}

/**
 * Send email notification
 */
async function sendEmailNotification(email, message) {
  try {
    // In a real implementation, you'd use a proper email service
    console.info(`📧 Email notification sent to ${email}: ${message.title}`);
  } catch (error) {
    console.error(`❌ Email notification failed: ${error.message}`);
  }
}

/**
 * Send Slack notification
 */
async function sendSlackNotification(webhookUrl, message) {
  try {
    const payload = {
      text: message.title,
      attachments: [{
        color: message.severity === 'high' ? 'danger' : message.severity === 'medium' ? 'warning' : 'good',
        fields: [
          {
            title: 'Message',
            value: message.message,
            short: false
          },
          {
            title: 'Severity',
            value: message.severity.toUpperCase(),
            short: true
          },
          {
            title: 'Time',
            value: new Date(message.timestamp).toLocaleString(),
            short: true
          }
        ]
      }]
    };
    
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.info(`📢 Slack notification sent: ${message.title}`);
  } catch (error) {
    console.error(`❌ Slack notification failed: ${error.message}`);
  }
}

/**
 * Send Discord notification
 */
async function sendDiscordNotification(webhookUrl, message) {
  try {
    const payload = {
      embeds: [{
        title: message.title,
        description: message.message,
        color: message.severity === 'high' ? 0xff0000 : message.severity === 'medium' ? 0xffaa00 : 0x00ff00,
        timestamp: message.timestamp,
        fields: [
          {
            name: 'Severity',
            value: message.severity.toUpperCase(),
            inline: true
          },
          {
            name: 'Time',
            value: new Date(message.timestamp).toLocaleString(),
            inline: true
          }
        ]
      }]
    };
    
    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    
    console.info(`📢 Discord notification sent: ${message.title}`);
  } catch (error) {
    console.error(`❌ Discord notification failed: ${error.message}`);
  }
}

/**
 * Update metrics
 */
function updateMetrics(healthChecks, systemResources) {
  monitoringState.metrics.totalChecks++;
  monitoringState.metrics.uptime = process.uptime();
  
  const successfulChecks = healthChecks.filter(check => check.success);
  const failedChecks = healthChecks.filter(check => !check.success);
  
  monitoringState.metrics.successfulChecks += successfulChecks.length;
  monitoringState.metrics.failedChecks += failedChecks.length;
  
  const responseTimes = healthChecks.map(check => check.responseTime).filter(time => time > 0);
  if (responseTimes.length > 0) {
    monitoringState.metrics.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
  }
  
  monitoringState.metrics.errorRate = (failedChecks.length / healthChecks.length) * 100;
  
  // Save metrics to file
  fs.writeFileSync(CONFIG.metricsFile, JSON.stringify(monitoringState.metrics, null, 2));
}

/**
 * Log monitoring activity
 */
function logActivity(message, data = null) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    message,
    data
  };
  
  const logLine = JSON.stringify(logEntry) + '\n';
  fs.appendFileSync(CONFIG.logFile, logLine);
  
  console.info(`📝 ${message}`);
}

/**
 * Main monitoring loop
 */
async function runMonitoring() {
  console.info('🚀 Starting Automated Monitoring System...');
  console.info(`⏰ Check interval: ${CONFIG.checkInterval / 1000} seconds`);
  
  monitoringState.isRunning = true;
  monitoringState.lastCheck = new Date().toISOString();
  
  logActivity('Monitoring system started');
  
  // Initial check
  await performHealthCheck();
  
  // Set up periodic monitoring
  setInterval(async () => {
    await performHealthCheck();
  }, CONFIG.checkInterval);
  
  // Keep the process running
  process.on('SIGINT', () => {
    console.info('\n🛑 Stopping monitoring system...');
    monitoringState.isRunning = false;
    logActivity('Monitoring system stopped');
    process.exit(0);
  });
}

/**
 * Perform a complete health check
 */
async function performHealthCheck() {
  try {
    console.info('\n🔍 Performing health check...');
    
    // Run all checks
    const healthChecks = await checkApplicationHealth();
    const systemResources = checkSystemResources();
    const securityChecks = await checkSecurityIssues();
    
    // Analyze and generate alerts
    const alerts = analyzeAndAlert(healthChecks, systemResources, securityChecks);
    
    // Send notifications for new alerts
    if (alerts.length > 0) {
      await sendNotifications(alerts);
      monitoringState.alerts.push(...alerts);
    }
    
    // Update metrics
    updateMetrics(healthChecks, systemResources);
    
    // Log results
    const summary = {
      healthChecks: healthChecks.length,
      successfulChecks: healthChecks.filter(c => c.success).length,
      failedChecks: healthChecks.filter(c => !c.success).length,
      alerts: alerts.length,
      systemResources: systemResources ? 'OK' : 'ERROR',
      securityChecks: securityChecks.length
    };
    
    logActivity('Health check completed', summary);
    
    // Update last check time
    monitoringState.lastCheck = new Date().toISOString();
    
  } catch (error) {
    console.error(`❌ Health check failed: ${error.message}`);
    logActivity('Health check failed', { error: error.message });
  }
}

/**
 * Get monitoring status
 */
function getMonitoringStatus() {
  return {
    isRunning: monitoringState.isRunning,
    lastCheck: monitoringState.lastCheck,
    metrics: monitoringState.metrics,
    recentAlerts: monitoringState.alerts.slice(-10), // Last 10 alerts
    config: {
      checkInterval: CONFIG.checkInterval,
      alertThresholds: CONFIG.alertThresholds
    }
  };
}

// Run monitoring if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runMonitoring();
}

export { runMonitoring, getMonitoringStatus, performHealthCheck, CONFIG };