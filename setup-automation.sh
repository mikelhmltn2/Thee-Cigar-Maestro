#!/bin/bash

# 🚀 Thee Cigar Maestro - Automation Setup Script
# Initializes the complete automation infrastructure

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${PURPLE}🚀 THEE CIGAR MAESTRO AUTOMATION SETUP${NC}"
echo -e "${PURPLE}=====================================${NC}"
echo ""

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_step() {
    echo -e "${CYAN}🔄 $1${NC}"
}

# Check if Node.js is installed
check_node() {
    print_step "Checking Node.js installation..."
    
    if command -v node >/dev/null 2>&1; then
        NODE_VERSION=$(node --version)
        print_status "Node.js found: $NODE_VERSION"
        
        # Check if version is >= 18
        NODE_MAJOR=$(echo $NODE_VERSION | sed 's/v//' | cut -d. -f1)
        if [ "$NODE_MAJOR" -lt 18 ]; then
            print_warning "Node.js version should be >= 18 for optimal performance"
        fi
    else
        print_error "Node.js not found. Please install Node.js 18 or higher."
        exit 1
    fi
}

# Check if npm is installed
check_npm() {
    print_step "Checking npm installation..."
    
    if command -v npm >/dev/null 2>&1; then
        NPM_VERSION=$(npm --version)
        print_status "npm found: $NPM_VERSION"
    else
        print_error "npm not found. Please install npm."
        exit 1
    fi
}

# Install dependencies
install_dependencies() {
    print_step "Installing project dependencies..."
    
    if [ -f "package.json" ]; then
        npm install --legacy-peer-deps
        print_status "Dependencies installed successfully"
    else
        print_error "package.json not found. Please run this script from the project root."
        exit 1
    fi
}

# Create necessary directories
create_directories() {
    print_step "Creating automation directories..."
    
    # Create backup directories
    mkdir -p backups/critical
    mkdir -p backups/daily
    mkdir -p backups/weekly
    mkdir -p backups/monthly
    
    # Create reports directory
    mkdir -p reports
    
    # Create logs directory
    mkdir -p logs
    
    print_status "Directories created successfully"
}

# Set script permissions
set_permissions() {
    print_step "Setting script permissions..."
    
    chmod +x scripts/*.js
    chmod +x deploy.sh
    chmod +x setup-automation.sh
    
    print_status "Permissions set successfully"
}

# Initialize Git hooks (if Git is available)
setup_git_hooks() {
    print_step "Setting up Git hooks..."
    
    if [ -d ".git" ]; then
        # Create pre-commit hook
        cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
# Run automation checks before commit

echo "🔍 Running pre-commit automation checks..."

# Run linting
npm run lint || exit 1

# Run security scan
npm run security:scan || exit 1

echo "✅ Pre-commit checks passed"
EOF
        
        chmod +x .git/hooks/pre-commit
        print_status "Git hooks configured"
    else
        print_warning "Not a Git repository, skipping Git hooks setup"
    fi
}

# Run initial system check
run_initial_check() {
    print_step "Running initial system check..."
    
    # Run health check
    npm run health:check || print_warning "Health check completed with warnings"
    
    # Run security scan
    npm run security:scan || print_warning "Security scan completed with warnings"
    
    print_status "Initial system check completed"
}

# Create environment file template
create_env_template() {
    print_step "Creating environment configuration template..."
    
    cat > .env.example << 'EOF'
# Automation Configuration

# Monitoring Alerts
ALERT_EMAIL=admin@example.com
ALERT_WEBHOOK=https://hooks.slack.com/your-webhook-url
SLACK_WEBHOOK=https://hooks.slack.com/your-slack-webhook

# Cloud Backup Configuration
BACKUP_CLOUD_ENABLED=false
BACKUP_CLOUD_PROVIDER=s3
BACKUP_CLOUD_BUCKET=your-backup-bucket
BACKUP_CLOUD_ACCESS_KEY=your-access-key
BACKUP_CLOUD_SECRET_KEY=your-secret-key

# Performance Configuration
PERFORMANCE_BUDGET_JS=1048576
PERFORMANCE_BUDGET_CSS=524288

# Security Configuration
SECURITY_ALERT_LEVEL=high

# Monitoring Thresholds
ALERT_THRESHOLD_CPU=80
ALERT_THRESHOLD_MEMORY=85
ALERT_THRESHOLD_DISK=90
EOF
    
    print_status "Environment template created (.env.example)"
    print_info "Copy .env.example to .env and configure your settings"
}

# Display automation summary
show_summary() {
    echo ""
    echo -e "${PURPLE}🎉 AUTOMATION SETUP COMPLETE${NC}"
    echo -e "${PURPLE}============================${NC}"
    echo ""
    
    echo -e "${CYAN}📊 Available Commands:${NC}"
    echo -e "  ${GREEN}npm run dashboard:start${NC}     - Start automation dashboard"
    echo -e "  ${GREEN}npm run automation:all${NC}      - Run all automation checks"
    echo -e "  ${GREEN}npm run health:check${NC}        - System health check"
    echo -e "  ${GREEN}npm run security:scan${NC}       - Security vulnerability scan"
    echo -e "  ${GREEN}npm run backup:daily${NC}        - Create daily backup"
    echo -e "  ${GREEN}npm run monitor:start${NC}       - Start continuous monitoring"
    echo ""
    
    echo -e "${CYAN}📁 Directory Structure:${NC}"
    echo -e "  ${BLUE}scripts/${NC}                    - Automation scripts"
    echo -e "  ${BLUE}backups/${NC}                    - Backup storage"
    echo -e "  ${BLUE}.github/workflows/${NC}          - CI/CD pipelines"
    echo -e "  ${BLUE}reports/${NC}                    - Generated reports"
    echo ""
    
    echo -e "${CYAN}📚 Documentation:${NC}"
    echo -e "  ${BLUE}AUTOMATION_GUIDE.md${NC}         - Comprehensive automation guide"
    echo -e "  ${BLUE}.env.example${NC}                - Environment configuration template"
    echo ""
    
    echo -e "${CYAN}🚀 Quick Start:${NC}"
    echo -e "  1. Copy .env.example to .env and configure"
    echo -e "  2. Run: ${GREEN}npm run dashboard:start${NC}"
    echo -e "  3. View: ${GREEN}AUTOMATION_GUIDE.md${NC} for detailed instructions"
    echo ""
    
    echo -e "${GREEN}✨ Automation is now ready to use!${NC}"
}

# Main setup process
main() {
    print_info "Starting automation setup..."
    echo ""
    
    check_node
    check_npm
    install_dependencies
    create_directories
    set_permissions
    setup_git_hooks
    create_env_template
    run_initial_check
    
    show_summary
}

# Run setup if script is executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi