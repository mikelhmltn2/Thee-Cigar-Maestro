#!/bin/bash

# 🚀 Thee Cigar Maestro - GitHub Push Script
# Automated repository creation and push to GitHub

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
REPO_NAME="thee-cigar-maestro"
REPO_DESCRIPTION="Premium cigar experience with AI-powered recommendations and immersive 3D Flavorverse"
GITHUB_USERNAME=""
BRANCH_NAME="main"

echo -e "${PURPLE}🚀 THEE CIGAR MAESTRO - GITHUB PUSH SCRIPT${NC}"
echo -e "${PURPLE}============================================${NC}"
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

# Get GitHub username
get_github_username() {
    if [ -z "$GITHUB_USERNAME" ]; then
        echo -e "${YELLOW}📝 Please enter your GitHub username:${NC}"
        read -p "Username: " GITHUB_USERNAME
        
        if [ -z "$GITHUB_USERNAME" ]; then
            print_error "GitHub username is required!"
            exit 1
        fi
    fi
    
    print_info "Using GitHub username: $GITHUB_USERNAME"
}

# Check if required tools are installed
check_dependencies() {
    print_step "Checking dependencies..."
    
    local missing_deps=()
    
    if ! command -v git &> /dev/null; then
        missing_deps+=("git")
    fi
    
    if ! command -v gh &> /dev/null; then
        print_warning "GitHub CLI (gh) not found - will use manual method"
    fi
    
    if [ ${#missing_deps[@]} -ne 0 ]; then
        print_error "Missing dependencies: ${missing_deps[*]}"
        print_info "Please install git and try again."
        exit 1
    fi
    
    print_status "Dependencies check completed"
}

# Check if we're in a git repository
check_git_repo() {
    print_step "Checking git repository status..."
    
    if ! git rev-parse --git-dir > /dev/null 2>&1; then
        print_error "Not in a git repository!"
        print_info "Please run this script from your project directory."
        exit 1
    fi
    
    # Check if there are any commits
    if ! git rev-parse HEAD > /dev/null 2>&1; then
        print_error "No commits found in repository!"
        print_info "Please commit your changes first: git add . && git commit -m 'Initial commit'"
        exit 1
    fi
    
    print_status "Git repository is ready"
}

# Check for existing remote
check_existing_remote() {
    print_step "Checking for existing remote..."
    
    if git remote get-url origin > /dev/null 2>&1; then
        local existing_remote=$(git remote get-url origin)
        print_warning "Remote 'origin' already exists: $existing_remote"
        
        echo -e "${YELLOW}Do you want to replace it? (y/N):${NC}"
        read -p "Replace remote: " replace_remote
        
        if [[ $replace_remote =~ ^[Yy]$ ]]; then
            git remote remove origin
            print_info "Existing remote removed"
        else
            print_info "Keeping existing remote"
            return 1
        fi
    fi
    
    return 0
}

# Create GitHub repository using GitHub CLI
create_repo_with_gh() {
    print_step "Creating GitHub repository with GitHub CLI..."
    
    if command -v gh &> /dev/null; then
        # Check if user is logged in
        if ! gh auth status > /dev/null 2>&1; then
            print_warning "GitHub CLI not authenticated"
            print_info "Please run: gh auth login"
            return 1
        fi
        
        # Create repository
        if gh repo create "$REPO_NAME" --public --description "$REPO_DESCRIPTION" --source=. --push; then
            print_status "Repository created and pushed successfully with GitHub CLI!"
            return 0
        else
            print_warning "GitHub CLI creation failed, falling back to manual method"
            return 1
        fi
    else
        return 1
    fi
}

# Manual repository creation instructions
create_repo_manual() {
    print_step "Setting up manual repository creation..."
    
    local repo_url="https://github.com/$GITHUB_USERNAME/$REPO_NAME.git"
    
    echo ""
    print_info "🌐 MANUAL REPOSITORY CREATION REQUIRED"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${CYAN}1. Go to: ${NC}${BLUE}https://github.com/new${NC}"
    echo -e "${CYAN}2. Repository name: ${NC}${GREEN}$REPO_NAME${NC}"
    echo -e "${CYAN}3. Description: ${NC}$REPO_DESCRIPTION"
    echo -e "${CYAN}4. Set to: ${NC}${GREEN}Public${NC}"
    echo -e "${CYAN}5. ${NC}${RED}DO NOT${NC}${CYAN} initialize with README, .gitignore, or license${NC}"
    echo -e "${CYAN}6. Click ${NC}${GREEN}'Create repository'${NC}"
    echo ""
    echo -e "${YELLOW}📋 After creating the repository, press ENTER to continue...${NC}"
    read -p ""
    
    # Add remote and push
    if check_existing_remote; then
        print_step "Adding GitHub remote..."
        git remote add origin "$repo_url"
        print_status "Remote added: $repo_url"
    fi
    
    # Push to GitHub
    push_to_github
}

# Push repository to GitHub
push_to_github() {
    print_step "Pushing repository to GitHub..."
    
    # Ensure we're on the main branch
    current_branch=$(git branch --show-current)
    if [ "$current_branch" != "$BRANCH_NAME" ]; then
        print_info "Switching to $BRANCH_NAME branch..."
        git checkout -B "$BRANCH_NAME"
    fi
    
    # Push to GitHub
    print_info "Pushing to GitHub..."
    if git push -u origin "$BRANCH_NAME"; then
        print_status "Repository successfully pushed to GitHub!"
    else
        print_error "Failed to push to GitHub"
        print_info "Please check your credentials and repository settings"
        exit 1
    fi
}

# Display repository information
show_repository_info() {
    local repo_url="https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    local pages_url="https://$GITHUB_USERNAME.github.io/$REPO_NAME"
    
    echo ""
    print_status "🎉 REPOSITORY SUCCESSFULLY CREATED!"
    echo ""
    echo -e "${PURPLE}📋 REPOSITORY INFORMATION${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${CYAN}🔗 Repository URL: ${NC}${BLUE}$repo_url${NC}"
    echo -e "${CYAN}🌍 GitHub Pages: ${NC}${BLUE}$pages_url${NC}"
    echo -e "${CYAN}📚 Documentation: ${NC}${BLUE}$repo_url/blob/main/README.md${NC}"
    echo -e "${CYAN}🚀 Actions: ${NC}${BLUE}$repo_url/actions${NC}"
    echo -e "${CYAN}📊 Insights: ${NC}${BLUE}$repo_url/pulse${NC}"
    echo ""
}

# Configure GitHub repository settings
configure_repository() {
    local repo_url="https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    
    echo -e "${YELLOW}🔧 NEXT STEPS - REPOSITORY CONFIGURATION${NC}"
    echo -e "${YELLOW}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${CYAN}1. ${NC}🌐 Enable GitHub Pages:"
    echo -e "   ${BLUE}$repo_url/settings/pages${NC}"
    echo -e "   • Source: Deploy from a branch"
    echo -e "   • Branch: ${GREEN}main${NC}"
    echo -e "   • Folder: ${GREEN}/ (root)${NC} or ${GREEN}/dist${NC}"
    echo ""
    echo -e "${CYAN}2. ${NC}🏷️ Add Repository Topics:"
    echo -e "   ${BLUE}$repo_url/settings${NC}"
    echo -e "   • Topics: ${GREEN}cigars, ai, machine-learning, 3d, pwa, javascript, nodejs, recommendations${NC}"
    echo ""
    echo -e "${CYAN}3. ${NC}🔒 Configure Secrets (for CI/CD):"
    echo -e "   ${BLUE}$repo_url/settings/secrets/actions${NC}"
    echo -e "   • NETLIFY_AUTH_TOKEN"
    echo -e "   • VERCEL_TOKEN"
    echo -e "   • (Optional deployment secrets)"
    echo ""
    echo -e "${CYAN}4. ${NC}📋 Enable Repository Features:"
    echo -e "   ${BLUE}$repo_url/settings${NC}"
    echo -e "   • ✅ Issues"
    echo -e "   • ✅ Wiki"
    echo -e "   • ✅ Discussions"
    echo -e "   • ✅ Projects"
    echo ""
}

# Display success message and next steps
show_success_message() {
    echo -e "${GREEN}🎊 SUCCESS! THEE CIGAR MAESTRO IS NOW ON GITHUB!${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "${CYAN}📊 Your repository includes:${NC}"
    echo -e "• ${GREEN}6,000+ lines${NC} of production-ready code"
    echo -e "• ${GREEN}🔐 Enterprise authentication${NC} system"
    echo -e "• ${GREEN}🤖 AI recommendation${NC} engine"
    echo -e "• ${GREEN}📱 Progressive Web App${NC} (PWA)"
    echo -e "• ${GREEN}🚀 CI/CD pipeline${NC} with GitHub Actions"
    echo -e "• ${GREEN}📖 Professional documentation${NC}"
    echo -e "• ${GREEN}🛡️ Security best practices${NC}"
    echo ""
    echo -e "${CYAN}🌐 Live in minutes:${NC}"
    echo -e "• Enable GitHub Pages for instant deployment"
    echo -e "• Share your repository with the world"
    echo -e "• Showcase your enterprise-level skills"
    echo ""
    echo -e "${PURPLE}🚀 Ready to change the cigar industry! 🚀${NC}"
}

# Main execution
main() {
    print_step "Starting GitHub repository creation process..."
    
    check_dependencies
    check_git_repo
    get_github_username
    
    # Try GitHub CLI first, fallback to manual
    if ! create_repo_with_gh; then
        create_repo_manual
    fi
    
    show_repository_info
    configure_repository
    show_success_message
    
    print_status "GitHub push process completed successfully!"
}

# Handle script arguments
case "${1:-main}" in
    "help")
        echo "Usage: $0 [help|check|main]"
        echo ""
        echo "Commands:"
        echo "  help   - Show this help message"
        echo "  check  - Check dependencies and git status"
        echo "  main   - Run full push process (default)"
        ;;
    "check")
        check_dependencies
        check_git_repo
        ;;
    "main")
        main
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for usage information"
        exit 1
        ;;
esac