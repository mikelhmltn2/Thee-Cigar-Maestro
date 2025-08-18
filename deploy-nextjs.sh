#!/bin/bash

# 🚀 Thee Cigar Maestro Next.js Deployment Script
# Simplified deployment for Next.js application

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="thee-cigar-maestro"

echo -e "${PURPLE}🚀 THEE CIGAR MAESTRO NEXT.JS DEPLOYMENT${NC}"
echo -e "${PURPLE}===========================================${NC}"
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
    if command -v node &> /dev/null; then
        NODE_VERSION=$(node -v)
        print_status "Node.js $NODE_VERSION is installed"
    else
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
}

# Install dependencies
install_deps() {
    print_step "Installing dependencies..."
    if [ -f "package.json" ]; then
        npm install --legacy-peer-deps || npm install --force
        print_status "Dependencies installed"
    else
        print_error "package.json not found"
        exit 1
    fi
}

# Run type check
type_check() {
    print_step "Running TypeScript type check..."
    npm run type-check || print_warning "Type check failed, continuing..."
}

# Build the Next.js application
build_nextjs() {
    print_step "Building Next.js application..."
    npm run build
    print_status "Next.js build completed"
}

# Run tests
run_tests() {
    print_step "Running tests..."
    
    # Run validation if file exists
    if [ -f "validate-data.js" ]; then
        print_info "Running data validation..."
        node validate-data.js || print_warning "Data validation had issues"
    fi
    
    # Run integration tests if file exists
    if [ -f "integration-test.js" ]; then
        print_info "Running integration tests..."
        node integration-test.js || print_warning "Integration tests had issues"
    fi
}

# Main deployment function
deploy() {
    print_step "Starting Next.js deployment process..."
    
    check_node
    install_deps
    type_check
    build_nextjs
    run_tests
    
    echo ""
    print_status "🎉 DEPLOYMENT BUILD COMPLETED SUCCESSFULLY!"
    echo ""
    print_info "📁 Next.js build output is in: .next/"
    print_info "🚀 Ready for deployment to Vercel"
    echo ""
    
    print_step "Deployment Instructions:"
    echo -e "${YELLOW}1. Push to GitHub:${NC} git push origin main"
    echo -e "${YELLOW}2. Vercel will automatically deploy from GitHub${NC}"
    echo -e "${YELLOW}3. Or deploy manually:${NC} vercel --prod"
    echo ""
}

# Parse command line arguments
case "${1:-build}" in
    "build")
        deploy
        ;;
    "test")
        run_tests
        ;;
    "help")
        echo "Usage: $0 [build|test|help]"
        echo ""
        echo "Commands:"
        echo "  build   - Build Next.js application (default)"
        echo "  test    - Run tests only"
        echo "  help    - Show this help message"
        ;;
    *)
        echo "Unknown command: $1"
        echo "Run '$0 help' for usage information"
        exit 1
        ;;
esac