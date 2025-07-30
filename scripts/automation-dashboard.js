#!/usr/bin/env node

/**
 * Automation Dashboard for Thee Cigar Maestro
 * Comprehensive overview and control center for all automation systems
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import http from 'http';
import url from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Dashboard configuration
const CONFIG = {
  port: process.env.DASHBOARD_PORT || 3001,
  host: process.env.DASHBOARD_HOST || 'localhost',
  refreshInterval: 30000, // 30 seconds
  maxLogLines: 1000,
  automationTasks: {
    'code-analysis': {
      name: 'Code Analysis',
      description: 'Run comprehensive code quality and security analysis',
      command: 'npm run automation:code',
      icon: '🔍',
      category: 'Quality'
    },
    'performance-test': {
      name: 'Performance Testing',
      description: 'Run Lighthouse audits and load testing',
      command: 'npm run automation:performance',
      icon: '⚡',
      category: 'Performance'
    },
    'health-check': {
      name: 'Health Check',
      description: 'Check application health and dependencies',
      command: 'npm run automation:health',
      icon: '🏥',
      category: 'Monitoring'
    },
    'auto-fix': {
      name: 'Auto Fix',
      description: 'Automatically fix code quality issues',
      command: 'npm run automation:fix',
      icon: '🔧',
      category: 'Quality'
    },
    'deployment': {
      name: 'Deployment',
      description: 'Build and deploy application',
      command: 'npm run automation:deploy',
      icon: '🚀',
      category: 'Deployment'
    },
    'maintenance': {
      name: 'Maintenance',
      description: 'Update dependencies and perform maintenance',
      command: 'npm run automation:maintenance',
      icon: '🛠️',
      category: 'Maintenance'
    }
  }
};

// Dashboard state
let dashboardState = {
  isRunning: false,
  lastUpdate: null,
  runningTasks: new Set(),
  taskHistory: [],
  systemStatus: {
    uptime: 0,
    memory: {},
    disk: {},
    processes: []
  },
  automationStatus: {
    monitoring: false,
    lastHealthCheck: null,
    lastPerformanceTest: null,
    lastCodeAnalysis: null
  }
};

/**
 * Get system status
 */
function getSystemStatus() {
  try {
    const memoryInfo = process.memoryUsage();
    const uptime = process.uptime();
    
    return {
      uptime,
      memory: {
        heapUsed: Math.round(memoryInfo.heapUsed / 1024 / 1024),
        heapTotal: Math.round(memoryInfo.heapTotal / 1024 / 1024),
        external: Math.round(memoryInfo.external / 1024 / 1024),
        rss: Math.round(memoryInfo.rss / 1024 / 1024)
      },
      disk: {
        // Simplified disk info
        free: 0,
        total: 0,
        used: 0
      },
      processes: [
        {
          name: 'Node.js',
          pid: process.pid,
          memory: Math.round(memoryInfo.rss / 1024 / 1024),
          cpu: 0
        }
      ]
    };
  } catch (error) {
    console.error(`❌ Failed to get system status: ${error.message}`);
    return null;
  }
}

/**
 * Get automation status
 */
function getAutomationStatus() {
  const status = {
    monitoring: false,
    lastHealthCheck: null,
    lastPerformanceTest: null,
    lastCodeAnalysis: null
  };
  
  try {
    // Check if monitoring is running
    const monitoringLog = path.join(rootDir, 'monitoring.log');
    if (fs.existsSync(monitoringLog)) {
      const stats = fs.statSync(monitoringLog);
      const lastModified = new Date(stats.mtime);
      status.monitoring = (Date.now() - lastModified.getTime()) < 300000; // 5 minutes
    }
    
    // Check last health check
    const healthReport = path.join(rootDir, 'health-check-report.json');
    if (fs.existsSync(healthReport)) {
      const report = JSON.parse(fs.readFileSync(healthReport, 'utf8'));
      status.lastHealthCheck = report.timestamp;
    }
    
    // Check last performance test
    const perfReport = path.join(rootDir, 'performance-report.json');
    if (fs.existsSync(perfReport)) {
      const report = JSON.parse(fs.readFileSync(perfReport, 'utf8'));
      status.lastPerformanceTest = report.timestamp;
    }
    
    // Check last code analysis
    const codeReport = path.join(rootDir, 'code-analysis-report.json');
    if (fs.existsSync(codeReport)) {
      const report = JSON.parse(fs.readFileSync(codeReport, 'utf8'));
      status.lastCodeAnalysis = report.timestamp;
    }
    
  } catch (error) {
    console.error(`❌ Failed to get automation status: ${error.message}`);
  }
  
  return status;
}

/**
 * Execute automation task
 */
async function executeTask(taskId) {
  const task = CONFIG.automationTasks[taskId];
  if (!task) {
    throw new Error(`Unknown task: ${taskId}`);
  }
  
  if (dashboardState.runningTasks.has(taskId)) {
    throw new Error(`Task ${taskId} is already running`);
  }
  
  console.info(`🚀 Starting task: ${task.name}`);
  
  dashboardState.runningTasks.add(taskId);
  
  const taskStart = new Date();
  const taskRecord = {
    id: taskId,
    name: task.name,
    startTime: taskStart.toISOString(),
    status: 'running',
    command: task.command
  };
  
  dashboardState.taskHistory.unshift(taskRecord);
  
  // Keep only last 50 tasks
  if (dashboardState.taskHistory.length > 50) {
    dashboardState.taskHistory = dashboardState.taskHistory.slice(0, 50);
  }
  
  try {
    const result = execSync(task.command, { 
      encoding: 'utf8', 
      cwd: rootDir,
      timeout: 300000 // 5 minutes
    });
    
    taskRecord.status = 'completed';
    taskRecord.endTime = new Date().toISOString();
    taskRecord.duration = Date.now() - taskStart.getTime();
    taskRecord.output = result;
    
    console.info(`✅ Task completed: ${task.name}`);
    
  } catch (error) {
    taskRecord.status = 'failed';
    taskRecord.endTime = new Date().toISOString();
    taskRecord.duration = Date.now() - taskStart.getTime();
    taskRecord.error = error.message;
    taskRecord.output = error.stdout || '';
    
    console.error(`❌ Task failed: ${task.name} - ${error.message}`);
  } finally {
    dashboardState.runningTasks.delete(taskId);
  }
  
  return taskRecord;
}

/**
 * Get recent logs
 */
function getRecentLogs() {
  const logs = [];
  
  try {
    // Check various log files
    const logFiles = [
      'monitoring.log',
      'npm-debug.log',
      'yarn-error.log'
    ];
    
    logFiles.forEach(logFile => {
      const logPath = path.join(rootDir, logFile);
      if (fs.existsSync(logPath)) {
        const content = fs.readFileSync(logPath, 'utf8');
        const lines = content.split('\n').filter(Boolean);
        
        // Get last 100 lines
        const recentLines = lines.slice(-100);
        recentLines.forEach(line => {
          try {
            const logEntry = JSON.parse(line);
            logs.push({
              file: logFile,
              timestamp: logEntry.timestamp,
              message: logEntry.message,
              data: logEntry.data
            });
          } catch {
            // Not JSON, treat as plain text
            logs.push({
              file: logFile,
              timestamp: new Date().toISOString(),
              message: line,
              data: null
            });
          }
        });
      }
    });
    
    // Sort by timestamp and return recent logs
    return logs
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, CONFIG.maxLogLines);
    
  } catch (error) {
    console.error(`❌ Failed to get logs: ${error.message}`);
    return [];
  }
}

/**
 * Generate dashboard HTML
 */
function generateDashboardHTML() {
  const systemStatus = dashboardState.systemStatus;
  const automationStatus = dashboardState.automationStatus;
  const runningTasks = Array.from(dashboardState.runningTasks);
  const recentTasks = dashboardState.taskHistory.slice(0, 10);
  const recentLogs = getRecentLogs().slice(0, 20);
  
  const tasksByCategory = {};
  Object.entries(CONFIG.automationTasks).forEach(([id, task]) => {
    if (!tasksByCategory[task.category]) {
      tasksByCategory[task.category] = [];
    }
    tasksByCategory[task.category].push({ id, ...task });
  });
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>🤖 Automation Dashboard - Thee Cigar Maestro</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }
        
        .header {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            margin-bottom: 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }
        
        .header h1 {
            font-size: 2.5rem;
            color: #2d3748;
            margin-bottom: 10px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: ${dashboardState.isRunning ? '#48bb78' : '#f56565'};
            margin-left: 10px;
        }
        
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 30px;
            margin-bottom: 30px;
        }
        
        .card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 30px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);
        }
        
        .card h2 {
            font-size: 1.5rem;
            color: #2d3748;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .task-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
        }
        
        .task-card {
            background: #f7fafc;
            border-radius: 15px;
            padding: 20px;
            border: 2px solid transparent;
            transition: all 0.3s ease;
            cursor: pointer;
        }
        
        .task-card:hover {
            border-color: #667eea;
            transform: translateY(-2px);
        }
        
        .task-card.running {
            border-color: #f6ad55;
            background: #fef5e7;
        }
        
        .task-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .task-icon {
            font-size: 1.5rem;
        }
        
        .task-name {
            font-weight: 600;
            color: #2d3748;
        }
        
        .task-description {
            color: #718096;
            font-size: 0.9rem;
            margin-bottom: 15px;
        }
        
        .task-actions {
            display: flex;
            gap: 10px;
        }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 8px;
            font-size: 0.9rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }
        
        .btn-primary {
            background: #667eea;
            color: white;
        }
        
        .btn-primary:hover {
            background: #5a67d8;
            transform: translateY(-1px);
        }
        
        .btn-secondary {
            background: #e2e8f0;
            color: #4a5568;
        }
        
        .btn-secondary:hover {
            background: #cbd5e0;
        }
        
        .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }
        
        .status-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .status-item {
            background: #f7fafc;
            padding: 15px;
            border-radius: 10px;
            text-align: center;
        }
        
        .status-value {
            font-size: 1.5rem;
            font-weight: 600;
            color: #2d3748;
        }
        
        .status-label {
            font-size: 0.9rem;
            color: #718096;
            margin-top: 5px;
        }
        
        .log-entry {
            background: #f7fafc;
            padding: 10px;
            border-radius: 8px;
            margin-bottom: 10px;
            font-family: 'Monaco', 'Menlo', monospace;
            font-size: 0.85rem;
        }
        
        .log-timestamp {
            color: #718096;
            font-size: 0.8rem;
        }
        
        .log-message {
            color: #2d3748;
            margin-top: 5px;
        }
        
        .refresh-info {
            text-align: center;
            color: #718096;
            font-size: 0.9rem;
            margin-top: 20px;
        }
        
        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .grid {
                grid-template-columns: 1fr;
            }
            
            .task-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>
                🤖 Automation Dashboard
                <span class="status-indicator"></span>
            </h1>
            <p>Comprehensive automation control center for Thee Cigar Maestro</p>
        </div>
        
        <div class="grid">
            <div class="card">
                <h2>📊 System Status</h2>
                <div class="status-grid">
                    <div class="status-item">
                        <div class="status-value">${Math.round(systemStatus.uptime / 3600)}h</div>
                        <div class="status-label">Uptime</div>
                    </div>
                    <div class="status-item">
                        <div class="status-value">${systemStatus.memory.heapUsed}MB</div>
                        <div class="status-label">Memory Used</div>
                    </div>
                    <div class="status-item">
                        <div class="status-value">${systemStatus.memory.rss}MB</div>
                        <div class="status-label">RSS</div>
                    </div>
                    <div class="status-item">
                        <div class="status-value">${runningTasks.length}</div>
                        <div class="status-label">Running Tasks</div>
                    </div>
                </div>
            </div>
            
            <div class="card">
                <h2>🔧 Automation Tasks</h2>
                <div class="task-grid">
                    ${Object.entries(tasksByCategory).map(([category, tasks]) => `
                        <div>
                            <h3 style="color: #4a5568; margin-bottom: 15px; font-size: 1.1rem;">${category}</h3>
                            ${tasks.map(task => `
                                <div class="task-card ${runningTasks.includes(task.id) ? 'running' : ''}">
                                    <div class="task-header">
                                        <span class="task-icon">${task.icon}</span>
                                        <span class="task-name">${task.name}</span>
                                    </div>
                                    <div class="task-description">${task.description}</div>
                                    <div class="task-actions">
                                        <button class="btn btn-primary" onclick="executeTask('${task.id}')" ${runningTasks.includes(task.id) ? 'disabled' : ''}>
                                            ${runningTasks.includes(task.id) ? 'Running...' : 'Run'}
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="card">
                <h2>📋 Recent Tasks</h2>
                ${recentTasks.length > 0 ? recentTasks.map(task => `
                    <div class="log-entry">
                        <div class="log-timestamp">${new Date(task.startTime).toLocaleString()}</div>
                        <div class="log-message">
                            <strong>${task.name}</strong> - ${task.status}
                            ${task.duration ? ` (${Math.round(task.duration / 1000)}s)` : ''}
                        </div>
                    </div>
                `).join('') : '<p style="color: #718096;">No recent tasks</p>'}
            </div>
            
            <div class="card">
                <h2>📝 Recent Logs</h2>
                ${recentLogs.length > 0 ? recentLogs.map(log => `
                    <div class="log-entry">
                        <div class="log-timestamp">${new Date(log.timestamp).toLocaleString()} [${log.file}]</div>
                        <div class="log-message">${log.message}</div>
                    </div>
                `).join('') : '<p style="color: #718096;">No recent logs</p>'}
            </div>
        </div>
        
        <div class="refresh-info">
            Auto-refreshing every ${CONFIG.refreshInterval / 1000} seconds
        </div>
    </div>
    
    <script>
        // Auto-refresh functionality
        setInterval(() => {
            location.reload();
        }, ${CONFIG.refreshInterval});
        
        // Task execution
        async function executeTask(taskId) {
            try {
                const response = await fetch('/api/execute-task', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ taskId })
                });
                
                if (response.ok) {
                    location.reload();
                } else {
                    const error = await response.text();
                    alert('Task execution failed: ' + error);
                }
            } catch (error) {
                alert('Failed to execute task: ' + error.message);
            }
        }
    </script>
</body>
</html>
  `;
}

/**
 * Create HTTP server
 */
function createServer() {
  const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    if (pathname === '/') {
      res.writeHead(200);
      res.end(generateDashboardHTML());
    } else if (pathname === '/api/execute-task' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          const { taskId } = JSON.parse(body);
          const result = await executeTask(taskId);
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end(error.message);
        }
      });
    } else if (pathname === '/api/status') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        systemStatus: dashboardState.systemStatus,
        automationStatus: dashboardState.automationStatus,
        runningTasks: Array.from(dashboardState.runningTasks),
        recentTasks: dashboardState.taskHistory.slice(0, 10)
      }));
    } else {
      res.writeHead(404);
      res.end('Not Found');
    }
  });
  
  return server;
}

/**
 * Main dashboard runner
 */
async function runDashboard() {
  console.info('🚀 Starting Automation Dashboard...');
  console.info(`🌐 Dashboard URL: http://${CONFIG.host}:${CONFIG.port}`);
  
  dashboardState.isRunning = true;
  
  // Update status periodically
  setInterval(() => {
    dashboardState.systemStatus = getSystemStatus();
    dashboardState.automationStatus = getAutomationStatus();
    dashboardState.lastUpdate = new Date().toISOString();
  }, 10000); // Every 10 seconds
  
  // Create and start server
  const server = createServer();
  
  server.listen(CONFIG.port, CONFIG.host, () => {
    console.info(`✅ Dashboard server running on http://${CONFIG.host}:${CONFIG.port}`);
  });
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.info('\n🛑 Stopping dashboard...');
    dashboardState.isRunning = false;
    server.close(() => {
      console.info('✅ Dashboard stopped');
      process.exit(0);
    });
  });
}

// Run dashboard if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDashboard();
}

export { runDashboard, getSystemStatus, getAutomationStatus, executeTask, CONFIG };