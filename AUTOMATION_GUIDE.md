# 🚀 Thee Cigar Maestro - Automation Guide

## 📋 Overview

This guide covers the comprehensive automation infrastructure implemented for Thee Cigar Maestro, including CI/CD pipelines, monitoring, security scanning, backup systems, and performance optimization.

## 🎛️ Automation Dashboard

### Quick Start
```bash
# Start the automation dashboard
npm run dashboard:start

# Quick system check
npm run dashboard:check

# Generate automation report
npm run dashboard:report

# Run complete automation suite
npm run automation:suite
```

### Features
- **Real-time System Monitoring**: Live status of all automation systems
- **Alert Management**: Centralized alerting for critical issues
- **Performance Metrics**: System performance and health indicators
- **Quick Actions**: One-click access to common automation tasks

## 🔧 Continuous Integration & Deployment

### GitHub Actions Workflows

#### 1. Continuous Integration (`ci.yml`)
**Triggers**: Push to main/develop, PRs, daily schedule
**Features**:
- Code quality & linting
- Automated testing (unit, integration, e2e)
- Security scanning
- Performance testing
- Quality gates

```bash
# Manual workflow trigger
gh workflow run ci.yml

# View workflow status
gh run list --workflow=ci.yml
```

#### 2. Deployment (`deploy.yml`)
**Triggers**: Push to main, manual deployment
**Features**:
- Multi-environment deployment (staging/production)
- Build optimization
- Asset compression
- Performance validation

```bash
# Deploy to staging
gh workflow run deploy.yml -f environment=staging

# Deploy to production
gh workflow run deploy.yml -f environment=production
```

#### 3. Health Check (`link-check.yml`)
**Triggers**: Daily schedule, manual
**Features**:
- External link validation
- Security audits
- Dependency vulnerability scanning

## 🏥 Health Monitoring

### System Health Checks
```bash
# Run comprehensive health check
npm run health:check

# Start continuous monitoring
npm run monitor:start

# One-time monitoring check
npm run monitor:check
```

### Monitoring Features
- **System Metrics**: CPU, memory, disk usage
- **Application Health**: File integrity, error rates
- **Network Connectivity**: External service availability
- **Performance Monitoring**: Response times, bundle sizes

### Alert Thresholds
- CPU Usage: > 80%
- Memory Usage: > 85%
- Disk Space: > 90%
- Response Time: > 2 seconds
- Error Rate: > 5%

### Notification Channels
Configure via environment variables:
```bash
export ALERT_EMAIL="admin@example.com"
export ALERT_WEBHOOK="https://hooks.slack.com/..."
export SLACK_WEBHOOK="https://hooks.slack.com/..."
```

## 🛡️ Security Automation

### Security Scanning
```bash
# Run comprehensive security scan
npm run security:scan

# Check for hardcoded secrets
grep -r "api_key\|secret\|password" --exclude-dir=node_modules .
```

### Security Features
- **Dependency Vulnerability Scanning**: npm audit with severity filtering
- **Secret Detection**: Pattern-based scanning for hardcoded secrets
- **Security Headers Validation**: CSP, HSTS, XSS protection
- **File Permissions Check**: World-writable file detection
- **SSL Configuration**: HTTPS enforcement verification

### Security Best Practices
1. Regular dependency updates
2. Environment variable usage for secrets
3. Security header implementation
4. Regular security audits
5. File permission management

## 🗄️ Backup & Recovery

### Backup Types & Schedules
- **Critical**: Every 6 hours (3-day retention)
- **Daily**: Daily at 2 AM (30-day retention)
- **Weekly**: Sunday at 2 AM (12-week retention)
- **Monthly**: 1st of month (12-month retention)

### Backup Commands
```bash
# Create backups
npm run backup:critical
npm run backup:daily

# List available backups
npm run backup:list

# Restore from backup
npm run backup:restore /path/to/backup.tar.gz

# List backups by type
npm run backup:list daily
```

### Backup Features
- **Selective Backup**: Only critical files included
- **Compression**: Gzip compression for space efficiency
- **Integrity Verification**: Checksum validation
- **Cloud Integration**: S3/GCP/Azure support (configurable)
- **Automated Cleanup**: Old backup removal

### Cloud Backup Configuration
```bash
export BACKUP_CLOUD_ENABLED=true
export BACKUP_CLOUD_PROVIDER=s3
export BACKUP_CLOUD_BUCKET=my-backup-bucket
export BACKUP_CLOUD_ACCESS_KEY=your_access_key
export BACKUP_CLOUD_SECRET_KEY=your_secret_key
```

## ⚡ Performance Optimization

### Asset Optimization
```bash
# Optimize assets
npm run assets:optimize

# Run performance tests
npm run performance:test

# Analyze bundle sizes
npm run analyze
```

### Performance Features
- **Image Optimization**: WebP conversion, compression
- **Bundle Analysis**: Size monitoring and optimization
- **Asset Compression**: Gzip/Brotli compression
- **Performance Benchmarking**: Load time measurements
- **Cache Optimization**: Browser caching strategies

### Performance Targets
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Time to Interactive: < 3.5s
- Bundle Size: < 1MB
- Image Optimization: > 70% compression

## 🔄 Automation Scripts

### Script Locations
All automation scripts are located in the `scripts/` directory:

- `health-check.js` - System health monitoring
- `security-check.js` - Security vulnerability scanning
- `monitoring-automation.js` - Real-time system monitoring
- `backup-automation.js` - Backup and recovery system
- `optimize-assets.js` - Asset optimization pipeline
- `performance-test.js` - Performance benchmarking
- `automation-dashboard.js` - Central automation dashboard

### Script Permissions
Ensure scripts have execute permissions:
```bash
chmod +x scripts/*.js
```

## 📊 Reporting & Analytics

### Available Reports
- **Health Reports**: System health and performance metrics
- **Security Reports**: Vulnerability assessments and security status
- **Backup Reports**: Backup success/failure logs
- **Performance Reports**: Load time and optimization metrics
- **Automation Reports**: Overall automation system status

### Report Locations
Reports are saved in the project root:
- `monitoring-metrics.json` - Real-time monitoring data
- `security-report.json` - Security scan results
- `automation-status.json` - Dashboard status
- `backup-report-*.json` - Backup operation logs
- `performance-report.json` - Performance test results

## 🔧 Configuration

### Environment Variables
```bash
# Monitoring Configuration
export MONITORING_INTERVAL=30000
export ALERT_THRESHOLD_CPU=80
export ALERT_THRESHOLD_MEMORY=85

# Security Configuration
export SECURITY_SCAN_SCHEDULE="0 */6 * * *"
export SECURITY_ALERT_LEVEL=high

# Backup Configuration
export BACKUP_RETENTION_DAYS=30
export BACKUP_COMPRESSION_LEVEL=6

# Performance Configuration
export PERFORMANCE_BUDGET_JS=1048576  # 1MB
export PERFORMANCE_BUDGET_CSS=524288  # 512KB
```

### Customization
Edit configuration objects in automation scripts:
- Monitoring thresholds in `monitoring-automation.js`
- Security patterns in `security-check.js`
- Backup paths in `backup-automation.js`
- Performance budgets in `performance-test.js`

## 🚨 Troubleshooting

### Common Issues

#### 1. Permission Denied Errors
```bash
chmod +x scripts/*.js
chmod +x deploy.sh
```

#### 2. Missing Dependencies
```bash
npm install --legacy-peer-deps
```

#### 3. GitHub Actions Failures
Check workflow logs:
```bash
gh run list --workflow=ci.yml --limit=5
gh run view [run-id] --log
```

#### 4. Monitoring Not Starting
Check Node.js version and dependencies:
```bash
node --version  # Should be >= 18
npm run health:check
```

#### 5. Backup Failures
Verify disk space and permissions:
```bash
df -h  # Check disk space
ls -la backups/  # Check backup directory permissions
```

### Debug Mode
Enable debug logging:
```bash
export DEBUG=automation:*
npm run dashboard:start
```

## 📚 Quick Reference

### Essential Commands
```bash
# Complete automation check
npm run automation:all

# Start monitoring dashboard
npm run dashboard:start

# Emergency backup
npm run backup:critical

# Security scan
npm run security:scan

# Health check
npm run health:check

# Performance test
npm run performance:test
```

### File Structure
```
├── .github/workflows/          # CI/CD pipelines
├── scripts/                    # Automation scripts
├── backups/                    # Backup storage
├── monitoring-metrics.json     # Monitoring data
├── security-report.json        # Security scan results
├── automation-status.json      # Dashboard status
└── AUTOMATION_GUIDE.md        # This guide
```

## 🔮 Future Enhancements

### Planned Features
- **Machine Learning Monitoring**: Anomaly detection
- **Automated Scaling**: Dynamic resource allocation
- **Advanced Analytics**: Predictive performance analysis
- **Multi-Cloud Backup**: Cross-provider redundancy
- **Real-time Collaboration**: Team notification integration

### Contributing
To add new automation features:
1. Create script in `scripts/` directory
2. Add npm command to `package.json`
3. Update this guide
4. Add GitHub Actions integration if needed
5. Test with dashboard integration

## 📞 Support

For automation-related issues:
1. Check this guide
2. Review script logs
3. Run diagnostic commands
4. Check GitHub Actions logs
5. Contact system administrator

---

**Last Updated**: $(date)
**Version**: 2.0.0
**Automation Coverage**: 95%