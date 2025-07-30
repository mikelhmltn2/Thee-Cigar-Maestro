# 🤖 Automation System - Thee Cigar Maestro

A comprehensive automation system for the Thee Cigar Maestro application, providing code quality analysis, performance testing, security scanning, monitoring, and automated deployments.

## 🚀 Quick Start

### 1. Start the Automation Dashboard
```bash
npm run automation:dashboard
```
Visit `http://localhost:3001` to access the web dashboard.

### 2. Run Full Automation Suite
```bash
npm run automation:full
```

### 3. Start Monitoring
```bash
npm run automation:monitor
```

## 📋 Available Automation Scripts

### Core Automation Commands
- `npm run automation:full` - Run complete automation suite (code analysis + performance testing)
- `npm run automation:code` - Run code quality and security analysis
- `npm run automation:performance` - Run performance testing and Lighthouse audits
- `npm run automation:health` - Run comprehensive health checks
- `npm run automation:fix` - Automatically fix code quality issues
- `npm run automation:deploy` - Build and deploy with full automation
- `npm run automation:maintenance` - Update dependencies and perform maintenance
- `npm run automation:dashboard` - Start the automation dashboard

### Individual Scripts
- `node scripts/automated-code-analysis.js` - Code analysis with auto-fix capabilities
- `node scripts/enhanced-performance-test.js` - Performance testing with Lighthouse
- `node scripts/automated-monitoring.js` - Real-time monitoring and alerting
- `node scripts/automation-dashboard.js` - Web-based automation control center

## 🔧 Automation Components

### 1. Code Quality & Security Analysis
**Script**: `scripts/automated-code-analysis.js`

**Features**:
- 🔍 **ESLint Analysis** - Code style and quality checks
- 🛡️ **Security Scanning** - Vulnerability detection and suspicious pattern analysis
- 📦 **Dependency Analysis** - Outdated packages, security vulnerabilities, unused dependencies
- 🎨 **Formatting Checks** - Prettier compliance verification
- 🔧 **Auto-Fix Capabilities** - Automatic resolution of common issues

**Configuration**:
```bash
# Enable auto-fix mode
AUTO_FIX=true npm run automation:code

# Set security level
SECURITY_LEVEL=high npm run automation:code

# Set maximum issues threshold
MAX_ISSUES=100 npm run automation:code
```

### 2. Performance Testing
**Script**: `scripts/enhanced-performance-test.js`

**Features**:
- ⚡ **Lighthouse Audits** - Performance, accessibility, best practices, and SEO scoring
- 🔄 **Load Testing** - Concurrent user simulation and response time analysis
- 📦 **Bundle Analysis** - JavaScript bundle size optimization
- 📊 **Performance Metrics** - Comprehensive performance reporting
- 🎯 **Recommendations** - Actionable performance improvement suggestions

**Configuration**:
```bash
# Test against specific URL
BASE_URL=http://localhost:3000 npm run automation:performance

# Custom Lighthouse thresholds
LIGHTHOUSE_PERFORMANCE=90 npm run automation:performance
```

### 3. Automated Monitoring
**Script**: `scripts/automated-monitoring.js`

**Features**:
- 🏥 **Health Checks** - Endpoint availability and response time monitoring
- 💻 **System Resources** - Memory, CPU, and disk usage tracking
- 🛡️ **Security Monitoring** - Real-time security issue detection
- 📢 **Alerting** - Email, Slack, and Discord notifications
- 📊 **Metrics Collection** - Historical performance data

**Configuration**:
```bash
# Set check interval (in milliseconds)
CHECK_INTERVAL=60000 npm run automation:monitor

# Configure notifications
ALERT_EMAIL=admin@example.com npm run automation:monitor
SLACK_WEBHOOK=https://hooks.slack.com/... npm run automation:monitor
DISCORD_WEBHOOK=https://discord.com/api/webhooks/... npm run automation:monitor
```

### 4. Automation Dashboard
**Script**: `scripts/automation-dashboard.js`

**Features**:
- 🌐 **Web Interface** - Beautiful, responsive dashboard
- 🔧 **Task Management** - One-click automation task execution
- 📊 **Real-time Monitoring** - Live system status and metrics
- 📋 **Task History** - Complete automation task history
- 📝 **Log Viewer** - Real-time log monitoring

**Access**: `http://localhost:3001`

## 🔄 GitHub Actions Integration

### Automated Workflows
The system includes comprehensive GitHub Actions workflows:

1. **🤖 Comprehensive Automation Pipeline** (`.github/workflows/automation.yml`)
   - Code quality checks
   - Performance testing
   - Security scanning
   - Automated deployment
   - Maintenance tasks

2. **🏥 Health Check & Link Validation** (`.github/workflows/link-check.yml`)
   - External link validation
   - Security audits
   - Automated reporting

3. **🚀 Deploy Thee Cigar Maestro** (`.github/workflows/deploy.yml`)
   - Production deployment pipeline
   - Testing and validation
   - Build optimization

### Manual Workflow Triggers
You can manually trigger specific automation tasks:

```bash
# Trigger specific automation task
gh workflow run automation.yml -f task=code-quality
gh workflow run automation.yml -f task=performance
gh workflow run automation.yml -f task=security
gh workflow run automation.yml -f task=deployment
gh workflow run automation.yml -f task=maintenance
```

## 📊 Reports and Outputs

### Generated Reports
The automation system generates comprehensive reports:

1. **Code Analysis Report** (`code-analysis-report.json`)
   - Security vulnerabilities
   - Code quality issues
   - Dependency analysis
   - Recommendations

2. **Performance Report** (`performance-report.json`)
   - Lighthouse scores
   - Load test results
   - Bundle analysis
   - Performance recommendations

3. **Health Check Report** (`health-check-report.json`)
   - System health status
   - Dependency health
   - External service status

4. **Monitoring Logs** (`monitoring.log`)
   - Real-time monitoring data
   - Alert history
   - System metrics

### Report Locations
- `performance-report.json` - Performance testing results
- `code-analysis-report.json` - Code quality analysis
- `health-check-report.json` - Health check results
- `monitoring.log` - Monitoring system logs
- `metrics.json` - System metrics data

## ⚙️ Configuration

### Environment Variables

#### Code Analysis
```bash
AUTO_FIX=true                    # Enable automatic fixes
SECURITY_LEVEL=moderate          # Security scanning level (low/moderate/high)
MAX_ISSUES=50                    # Maximum issues threshold
```

#### Performance Testing
```bash
BASE_URL=http://localhost:3000   # Application URL to test
LIGHTHOUSE_PERFORMANCE=80        # Performance score threshold
LIGHTHOUSE_ACCESSIBILITY=90      # Accessibility score threshold
```

#### Monitoring
```bash
CHECK_INTERVAL=300000            # Health check interval (ms)
ALERT_EMAIL=admin@example.com    # Email for alerts
SLACK_WEBHOOK=https://...        # Slack webhook URL
DISCORD_WEBHOOK=https://...      # Discord webhook URL
```

#### Dashboard
```bash
DASHBOARD_PORT=3001              # Dashboard port
DASHBOARD_HOST=localhost         # Dashboard host
```

### Thresholds and Limits

#### Performance Thresholds
- **Response Time**: 2000ms
- **Error Rate**: 5%
- **Memory Usage**: 80%
- **Disk Usage**: 85%
- **CPU Usage**: 80%

#### Quality Thresholds
- **Lighthouse Performance**: 80
- **Lighthouse Accessibility**: 90
- **Lighthouse Best Practices**: 85
- **Lighthouse SEO**: 90
- **Max Line Length**: 120 characters
- **Max Function Length**: 50 lines

## 🚨 Alerting and Notifications

### Supported Notification Channels
1. **Email Notifications**
   - Configure with `ALERT_EMAIL` environment variable
   - HTML formatted alerts with detailed information

2. **Slack Notifications**
   - Configure with `SLACK_WEBHOOK` environment variable
   - Rich message formatting with attachments

3. **Discord Notifications**
   - Configure with `DISCORD_WEBHOOK` environment variable
   - Embedded messages with color coding

### Alert Severity Levels
- 🔴 **High** - Critical issues requiring immediate attention
- 🟡 **Medium** - Important issues that should be addressed soon
- 🟢 **Low** - Minor issues for future consideration

## 🔧 Troubleshooting

### Common Issues

#### 1. Performance Tests Failing
```bash
# Check if application is running
curl http://localhost:3000

# Verify Lighthouse installation
npm install -g lighthouse

# Check network connectivity
ping google.com
```

#### 2. Code Analysis Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Update dependencies
npm update

# Fix security vulnerabilities
npm audit fix
```

#### 3. Monitoring Not Working
```bash
# Check if monitoring log exists
ls -la monitoring.log

# Verify environment variables
echo $CHECK_INTERVAL
echo $ALERT_EMAIL

# Restart monitoring
pkill -f "automated-monitoring"
npm run automation:monitor
```

#### 4. Dashboard Not Loading
```bash
# Check if port is available
lsof -i :3001

# Verify dashboard is running
ps aux | grep automation-dashboard

# Check firewall settings
sudo ufw status
```

### Debug Mode
Enable debug logging for troubleshooting:

```bash
# Enable debug mode
DEBUG=true npm run automation:code
DEBUG=true npm run automation:performance
DEBUG=true npm run automation:monitor
```

## 📈 Best Practices

### 1. Regular Maintenance
- Run `npm run automation:maintenance` weekly
- Review and update dependencies monthly
- Monitor performance metrics regularly

### 2. Security
- Enable security scanning in CI/CD pipeline
- Review security alerts immediately
- Keep dependencies updated

### 3. Performance
- Monitor Lighthouse scores regularly
- Optimize bundle sizes
- Implement performance budgets

### 4. Monitoring
- Set up alerting for critical issues
- Monitor system resources
- Track application health metrics

## 🤝 Contributing

### Adding New Automation Tasks
1. Create new script in `scripts/` directory
2. Add npm script to `package.json`
3. Update dashboard configuration
4. Add to GitHub Actions workflow
5. Update documentation

### Customizing Automation
1. Modify configuration in script files
2. Adjust thresholds in environment variables
3. Customize alerting rules
4. Add new monitoring endpoints

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review generated reports
3. Check monitoring logs
4. Consult the dashboard for system status

## 📄 License

This automation system is part of the Thee Cigar Maestro project and follows the same licensing terms.

---

**🤖 Automation System v2.0** - Empowering development with intelligent automation