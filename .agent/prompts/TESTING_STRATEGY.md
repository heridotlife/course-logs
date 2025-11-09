# Testing Strategy & CI/CD

This document outlines the testing architecture and CI/CD integration for the `course-logs` project. A 100% pass rate is mandatory for all changes.

## Testing Architecture

The project uses **Playwright** for comprehensive end-to-end testing.

### Test Structure
-   **Device Profiles**: Tests run against three profiles: Desktop (1920x1080), Mobile (393x851), and Tablet (1024x1366).
-   **Test Utilities**: `tests/test-utils.js` contains helper functions for common test operations, such as waiting for Alpine.js to initialize.
-   **Main Suite**: `tests/comprehensive.spec.js` contains the main body of tests, covering all application features.

### Test Categories
The test suite is organized into categories, including:
-   Initial State & Page Load
-   CRUD Operations
-   Semester Configuration
-   Credit Validation
-   Data Persistence (LocalStorage)
-   Import/Export
-   Performance (Core Web Vitals)
-   Accessibility (WCAG)

## Test Commands

```bash
# Run all tests (132 test runs across 3 profiles)
pnpm run test

# Run tests for a specific device profile
pnpm run test -- --project=chromium-desktop

# Run tests for a specific category (e.g., Performance)
pnpm run test -- -g "Performance"

# Debug and UI modes
pnpm run test:debug   # Interactive debugging
pnpm run test:ui      # Playwright UI mode
```
**Note**: Tests require a local server on port 8080, which Playwright starts automatically.

## CI/CD Integration

The project uses **GitHub Actions** for continuous integration and deployment.

-   **`playwright-tests.yml`**: The main CI/CD workflow that runs on every push and pull request. It includes three parallel jobs for testing, performance, and accessibility.
-   **`scheduled-tests.yml`**: A nightly regression testing workflow that runs daily and automatically creates a GitHub issue if any tests fail.

## Testing Best Practices
-   **Always wait for Alpine.js to initialize** before interacting with the page. Use the `waitForAlpineInit()` helper from `tests/test-utils.js`.
-   **Use condition-based waits**, not arbitrary timeouts (`waitForTimeout`).
-   **Test across all device profiles** to catch responsive design issues.
-   **Verify `localStorage` persistence** after actions that modify data.
-   **Ensure all new features have corresponding tests** added to `tests/comprehensive.spec.js`.
