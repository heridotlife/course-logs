#!/bin/bash
# Test Execution Examples for Course-Logs
# Run this script to see various test scenarios

set -e

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║      Course-Logs Comprehensive Test Suite Examples            ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

show_menu() {
    echo ""
    echo "${BLUE}Select test scenario:${NC}"
    echo ""
    echo "  1) Run all tests (all devices)"
    echo "  2) Run tests on desktop only"
    echo "  3) Run tests on mobile only"
    echo "  4) Run tests on tablet only"
    echo "  5) Run specific test - Dark Mode"
    echo "  6) Run specific test - Accessibility"
    echo "  7) Run specific test - Performance"
    echo "  8) Run tests in headed mode (see browser)"
    echo "  9) Run tests in debug mode (interactive)"
    echo " 10) View latest test report"
    echo " 11) Run tests with UI"
    echo " 12) Run stress tests only"
    echo " 13) Run tests matching pattern"
    echo " 14) Exit"
    echo ""
    echo -n "Enter your choice (1-14): "
}

run_test() {
    local description=$1
    local command=$2
    
    echo ""
    echo "${YELLOW}→ $description${NC}"
    echo "${BLUE}Command: $command${NC}"
    echo ""
    
    read -p "Run this test? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        eval $command
        if [ $? -eq 0 ]; then
            echo "${GREEN}✓ Test completed successfully${NC}"
        else
            echo "${RED}✗ Test failed${NC}"
        fi
    else
        echo "Skipped"
    fi
}

while true; do
    show_menu
    read choice
    
    case $choice in
        1)
            run_test "Running all tests across all devices (Desktop, Mobile, Tablet)" \
                "npm run test:all-devices"
            ;;
        2)
            run_test "Running tests on Desktop (1920×1080) only" \
                "npm run test:functional"
            ;;
        3)
            run_test "Running tests on Mobile (Pixel 5, 393×851) only" \
                "npm run test:mobile"
            ;;
        4)
            run_test "Running tests on Tablet (iPad Pro, 1024×1366) only" \
                "npm run test:tablet"
            ;;
        5)
            run_test "Running Dark Mode tests" \
                "npx playwright test -g 'Dark Mode'"
            ;;
        6)
            run_test "Running Accessibility (WCAG AA) tests" \
                "npx playwright test -g 'Accessibility'"
            ;;
        7)
            run_test "Running Performance tests" \
                "npx playwright test -g 'Performance'"
            ;;
        8)
            run_test "Running tests in headed mode (see browser)" \
                "npm run test:headed"
            ;;
        9)
            run_test "Running tests in debug mode (interactive)" \
                "npm run test:debug"
            ;;
        10)
            run_test "Viewing latest test report" \
                "npm run test:report"
            ;;
        11)
            run_test "Running tests with UI mode" \
                "npm run test:ui"
            ;;
        12)
            run_test "Running Stress tests only" \
                "npx playwright test -g 'Stress'"
            ;;
        13)
            echo ""
            echo "${YELLOW}Available patterns:${NC}"
            echo "  - Page Load"
            echo "  - Responsive"
            echo "  - Menu"
            echo "  - Dark Mode"
            echo "  - Language"
            echo "  - Course"
            echo "  - Auto-Map"
            echo "  - Persistence"
            echo "  - Accessibility"
            echo "  - Error"
            echo "  - Stress"
            echo "  - Visual"
            echo ""
            read -p "Enter pattern to match: " pattern
            run_test "Running tests matching pattern: $pattern" \
                "npx playwright test -g '$pattern'"
            ;;
        14)
            echo ""
            echo "${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo "${RED}Invalid choice. Please enter 1-14.${NC}"
            ;;
    esac
done
