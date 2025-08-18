#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📝 Pull Request Creation Instructions${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Get current branch and repository info
CURRENT_BRANCH=$(git branch --show-current)
REPO_URL="https://github.com/mikelhmltn2/Thee-Cigar-Maestro"

echo -e "${GREEN}✅ Your changes have been pushed to:${NC}"
echo -e "   Branch: ${YELLOW}$CURRENT_BRANCH${NC}"
echo ""

echo -e "${GREEN}📋 To create the Pull Request:${NC}"
echo ""
echo -e "1. ${YELLOW}Click this link to create the PR:${NC}"
echo -e "   ${BLUE}$REPO_URL/pull/new/$CURRENT_BRANCH${NC}"
echo ""
echo -e "2. ${YELLOW}Set the PR title to:${NC}"
echo -e "   🔧 Fix: Deployment and CI/CD Pipeline Issues"
echo ""
echo -e "3. ${YELLOW}Copy the PR description from:${NC}"
echo -e "   ${BLUE}PR_DESCRIPTION_FIXES.md${NC}"
echo ""
echo -e "4. ${YELLOW}Make sure:${NC}"
echo -e "   • Base branch is set to: ${GREEN}main${NC}"
echo -e "   • Head branch is set to: ${GREEN}$CURRENT_BRANCH${NC}"
echo ""
echo -e "5. ${YELLOW}Click 'Create Pull Request'${NC}"
echo ""

# Try to open the URL in the browser (works on most systems)
echo -e "${GREEN}🌐 Attempting to open GitHub in your browser...${NC}"

# Check which command is available to open URLs
if command -v xdg-open > /dev/null 2>&1; then
    xdg-open "$REPO_URL/pull/new/$CURRENT_BRANCH" 2>/dev/null
elif command -v open > /dev/null 2>&1; then
    open "$REPO_URL/pull/new/$CURRENT_BRANCH" 2>/dev/null
elif command -v start > /dev/null 2>&1; then
    start "$REPO_URL/pull/new/$CURRENT_BRANCH" 2>/dev/null
else
    echo -e "${YELLOW}⚠️  Could not open browser automatically.${NC}"
    echo -e "${YELLOW}   Please manually navigate to the URL above.${NC}"
fi

echo ""
echo -e "${GREEN}✨ Your PR is ready to be created!${NC}"
echo ""

# Display the PR description for easy copying
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}PR DESCRIPTION (for easy copying):${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
cat PR_DESCRIPTION_FIXES.md