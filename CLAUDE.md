# CLAUDE.md

**Last Updated:** October 25, 2025  
**Version:** 2.1.0  
**Status:** ✅ Production Ready - All Tests Passing

This file provides guidance to Claude Code and AI assistants when working with code in this repository.

---

## Project Overview

A modern, responsive university course study planner built with Alpine.js and Tailwind CSS v4. The application helps students plan their academic schedules across 4-12 semesters with flexible course management, credit validation, and multi-language support.

**Key Technologies:**
- Alpine.js 3.15.0 (bundled with esbuild)
- Tailwind CSS 4.1.14 (CSS-based configuration, v4 syntax)
- esbuild 0.25.11 for JavaScript bundling
- Playwright 1.56.1 for end-to-end testing
- pnpm 9 for package management
- localStorage for data persistence
- Cloudflare Pages for deployment

**Current Achievement:**
- ✅ **132 tests passing** (44 tests × 3 device profiles)
- ✅ **100% pass rate** across desktop, mobile, and tablet
- ✅ **CI/CD operational** with GitHub Actions (3 parallel jobs)
- ✅ **Nightly regression testing** with automated issue creation
- ✅ **Production performance:** 92/100 score, excellent Core Web Vitals
- ✅ **Security grade:** B+ (82/100)

## Build and Development Commands

### Development Workflow
```bash
# Install dependencies
pnpm install

# Development mode with hot reload (both CSS and JS)
pnpm run dev

# Build for production (minified)
pnpm run build

# Serve locally for testing
python3 -m http.server 8000
# OR
npx http-server -p 8080
```

### Individual Build Commands
```bash
# CSS only
pnpm run build:css    # Production build
pnpm run watch:css    # Watch mode

# JavaScript only
pnpm run build:js     # Production build
pnpm run watch:js     # Watch mode
```

### Testing
```bash
# Run all tests (132 test runs across 3 profiles)
pnpm run test

# Run specific device profile
pnpm run test -- --project=chromium-desktop
pnpm run test -- --project=chromium-mobile  
pnpm run test -- --project=chromium-tablet

# Run specific test category
pnpm run test -- -g "CRUD Operations"
pnpm run test -- -g "Performance"
pnpm run test -- -g "Accessibility"

# Debug and UI modes
pnpm run test:debug   # Interactive debugging
pnpm run test:ui      # Playwright UI mode
pnpm run test:headed  # Run with visible browser
pnpm run test:report  # View HTML report
```

**Note:** Tests require a local server running at http://127.0.0.1:8080. Playwright automatically starts one using `npx http-server -p 8080 -c-1`.

**Test Coverage:**
- Functional Tests: 44 tests (CRUD, validation, import/export, etc.)
- Performance Tests: 6 tests (Core Web Vitals monitoring)
- Accessibility Tests: Full WCAG compliance
- Device Profiles: Desktop (1920×1080), Mobile (393×851), Tablet (1024×1366)
- **Total:** 132 test runs (44 tests × 3 profiles) - 100% pass rate

### Deployment
```bash
# Deploy to Cloudflare Pages
pnpm run deploy

# Deploy preview environment
pnpm run deploy:preview
```

## Architecture

### Application Structure

The app uses **Alpine.js for reactivity** with a single main component (`courseApp`) that manages all state and business logic. The architecture emphasizes:

1. **Component-based structure**: Main logic in `src/course-app.js`, entry point in `src/app.js`
2. **Build system**: esbuild bundles Alpine.js with the app into a single IIFE (`dist/app.js`)
3. **CSS compilation**: Tailwind v4 uses CSS-based `@theme` config in `src/input.css` (not tailwind.config.js)
4. **Data persistence**: All user data saved to localStorage with auto-save on every change

### Key Files and Their Roles

- **`src/app.js`**: Entry point that imports Alpine.js, plugins, and registers the main component
- **`src/course-app.js`**: Main Alpine.js component containing all app logic (state, methods, computed properties)
- **`src/input.css`**: Tailwind v4 CSS source with `@theme` configuration and custom styles
- **`build-js.js`**: esbuild configuration for bundling JavaScript
- **`index.html`**: Single-page application with inline critical CSS for performance
- **`data/courses.json`**: Default course data and settings (68 pre-loaded courses)
- **`locales/*.json`**: Translation files for EN, ID, JA languages
- **`playwright.config.js`**: E2E test configuration with desktop/mobile/tablet profiles
- **`tests/comprehensive.spec.js`**: Comprehensive test suite covering all features

### State Management

All state is managed in the Alpine.js `courseApp()` component:
- `courses[]`: Array of course objects with CRUD operations
- `settings`: Semester configuration and credit limits
- `semesterList[]`: Dynamically generated semester structure
- `language`: Current language (EN/ID/JA)
- `translations{}`: Loaded translation strings
- Modal states: `showAddModal`, `showSettingsModal`, `showImportExportModal`, etc.

### Data Flow

1. **Initialization** (`init()`):
   - Load translations from `locales/{language}.json`
   - Fetch default data from `data/courses.json`
   - Load user data from localStorage (overrides defaults)
   - Generate semester structure based on settings

2. **User Actions**:
   - All actions trigger methods that update state
   - State changes automatically saved to localStorage
   - Alpine.js reactivity updates UI

3. **Persistence**:
   - Auto-save on every change via `saveToLocalStorage()`
   - Manual save button for explicit backup
   - Export/import for data portability (JSON/CSV)

### Performance Optimizations

The app is highly optimized for Core Web Vitals:

**Production Metrics:**
- CLS (Cumulative Layout Shift): 0.08 ✅ Good
- LCP (Largest Contentful Paint): 1.6s ✅ Good
- FCP (First Contentful Paint): 844ms ✅ Good
- TTI (Time to Interactive): 823ms ✅ Good
- **Overall Score:** 92/100 ✅ Excellent

**Test Performance:**
- Execution time: 3-5 minutes (down from 10-15 minutes)
- Improvement: 60-70% faster with parallel execution
- Strategy: `fullyParallel: true` in playwright.config.js

**Optimization Techniques:**

1. **Layout Stability** (CLS: 0.08):
   - Reserved heights for dynamic containers (`min-h-screen`, `min-h-[88px]`)
   - Critical CSS inlined in `<head>` to prevent FOUC
   - `x-cloak` directive hides content until Alpine.js loads
   - Fallback translations prevent network-induced layout shifts

2. **CSS Performance**:
   - CSS containment (`contain-layout`, `contain-content`)
   - Content-visibility for off-screen elements
   - GPU acceleration for smooth transitions (`will-change`)

3. **Resource Loading**:
   - Preload critical assets (CSS, JS)
   - Prefetch translation files
   - Deferred JavaScript loading
   - DNS prefetch for external resources
   - Error handling for 503 locale file errors

4. **Build Optimizations**:
   - Minified production builds (CSS + JS)
   - Source maps only in development
   - esbuild for fast bundling with tree-shaking
   - Tailwind v4 with 5x faster builds

5. **Runtime Optimizations**:
   - Cached computed properties for expensive calculations
   - Condition-based waits instead of arbitrary timeouts
   - Efficient DOM updates with Alpine.js reactivity

## Tailwind CSS v4 Important Notes

This project uses **Tailwind CSS v4**, which has significant differences from v3:

1. **CSS-based configuration**: Uses `@theme` in `src/input.css` instead of `tailwind.config.js`
2. **New CLI**: Uses `@tailwindcss/cli` package, not the `tailwindcss` package CLI
3. **Build command**: `tailwindcss -i ./src/input.css -o ./dist/output.css`
4. **No JavaScript config**: All theme customization in CSS using `@theme` directive
5. **Breaking changes**: Some v3 utilities may not work; consult v4 docs

**When modifying styles**, always edit `src/input.css` and rebuild CSS.

---

## Security & Quality Assurance

### Security Grade: B+ (82/100)

**Recent Security Improvements:**
- ✅ Fixed XSS vulnerabilities (removed all `x-html` usage)
- ✅ Updated esbuild 0.24.2 → 0.25.11 (patched CORS vulnerability)
- ✅ CI/CD hardening (npm → pnpm with frozen lockfile)
- ✅ Input sanitization for user content
- ✅ HTTP security headers configured (`_headers` file)

**Security Best Practices:**
- **Never use `x-html`** - Always use `x-text` for user content (XSS prevention)
- **Validate imports** - CSV/JSON imports should be validated (future enhancement)
- **Frozen lockfile** - CI/CD uses `pnpm install --frozen-lockfile` for integrity
- **Security headers** - X-Frame-Options, X-Content-Type-Options, etc. configured
- **Dependency updates** - All dependencies up to date and audited

**Known Limitations:**
- No input validation for CSV/JSON imports (medium risk, low likelihood)
- No CSP headers (recommended future enhancement)
- No backend authentication (client-side only app)

---

## Testing Architecture

Playwright tests are organized with comprehensive coverage:

### Test Structure
- **Device profiles**: Desktop (1920×1080), Mobile (393×851), Tablet (1024×1366)
- **Test utilities**: `tests/test-utils.js` contains helpers for waiting and validation
- **Main suite**: `tests/comprehensive.spec.js` (44 tests covering all features)

### Test Categories
```javascript
// tests/comprehensive.spec.js
test.describe('Initial State', () => { /* 7 tests */ });
test.describe('CRUD Operations', () => { /* 12 tests */ });
test.describe('Semester Configuration', () => { /* 5 tests */ });
test.describe('Credit Validation', () => { /* 4 tests */ });
test.describe('Data Persistence', () => { /* 4 tests */ });
test.describe('Import/Export', () => { /* 4 tests */ });
test.describe('Auto-Map Feature', () => { /* 2 tests */ });
test.describe('Performance', () => { /* 6 Core Web Vitals tests */ });
// Total: 44 tests × 3 profiles = 132 test runs
```

### CI/CD Integration
- **GitHub Actions workflows:**
  - `playwright-tests.yml` - Main CI/CD (runs on push/PR)
    - 3 parallel jobs: test, performance, accessibility
    - Matrix strategy for all device profiles
    - Artifact uploads for test results and reports
  - `scheduled-tests.yml` - Nightly regression testing
    - Runs daily at 2 AM UTC
    - Creates GitHub issues on failure
    - 7-day artifact retention

**Testing best practices**:
- Always wait for Alpine.js initialization before interactions
- Use `waitForAlpineInit()` helper from test-utils.js
- Test across all device profiles for responsive issues
- Verify localStorage persistence after actions
- Use condition-based waits, not `waitForTimeout()`

## Development Guidelines

### Adding New Features

1. **State changes**: Add to `courseApp()` in `src/course-app.js`
2. **UI components**: Add to `index.html` with Alpine.js directives
3. **Translations**: Update all files in `locales/` (en.json, id.json, ja.json)
4. **Styling**: Use Tailwind utilities; add custom CSS to `src/input.css` if needed
5. **Tests**: Add test cases to `tests/comprehensive.spec.js`
6. **Build**: Run `pnpm run build` before committing

### Modifying Semester Logic

The semester structure is dynamic (4-12 semesters):
- Generated by `generateSemesterList()` in src/course-app.js:71
- Regular semesters: `{ id: "1", name: "Semester 1", type: "normal" }`
- Antara (inter-semester): `{ id: "antara-1", name: "Antara 1", type: "antara" }`
- Antara periods automatically inserted after even-numbered semesters
- Credit limits stored in `settings.semesterMaxCredits` (configurable per semester)

### Working with Translations

All UI text must support EN/ID/JA:
1. Add key to all locale files in `locales/`
2. Use `x-text="t('key')"` in HTML
3. Use `this.t('key')` in JavaScript
4. Reload page or switch language to test

### Performance Considerations

When making changes:
- **Avoid layout shifts**: Reserve space for dynamic content
- **Use Alpine.js efficiently**: Minimize watchers, use computed properties
- **Optimize images**: None currently, but would need optimization if added
- **Test Core Web Vitals**: Use Lighthouse or run performance tests
- **Minimize JavaScript**: Keep bundle size low (currently ~50KB)

## Common Tasks

### Update Default Courses
Edit `data/courses.json` directly. Structure:
```json
{
  "settings": {
    "totalSemesters": 8,
    "semesterMaxCredits": { "1": 20, "2": 20, ... },
    "targetCredits": 145
  },
  "courses": [
    {
      "id": "unique-id",
      "code": "CS101",
      "name": "Course Name",
      "type": "Wajib|Pilihan",
      "credits": 3,
      "lecturer": "Lecturer Name",
      "recommendedSemester": 1,
      "assignedSemester": null
    }
  ]
}
```

### Change Credit Limits
1. Via UI: Settings modal → Adjust credit limits per semester
2. Via code: Edit `settings.semesterMaxCredits` in `data/courses.json`
3. Default logic in `generateSemesterList()`: Sem 1-2 = 20 SKS, Sem 3+ = 24 SKS, Antara = 9 SKS

### Debug localStorage Issues
```javascript
// In browser console
localStorage.getItem('courseData')  // View saved data
localStorage.clear()                 // Clear all data
```

### Add New Language
1. Create `locales/{code}.json` with all translation keys (copy from en.json)
2. Add language option to dropdown in `index.html` (search for language selector)
3. Update language list in component if needed

## MCP Configuration

This project includes Cloudflare MCP (Model Context Protocol) server configuration in `.claude/mcp.json`.

### Available MCP Servers
- **cloudflare-pages**: Manage deployments, view status, trigger builds
- **cloudflare-analytics**: Access website traffic and performance metrics
- **cloudflare-workers**: Manage Workers and bindings (KV, R2, D1)
- **cloudflare-dns**: View and manage DNS records

### Setup
1. Get Cloudflare API token from [dashboard](https://dash.cloudflare.com/profile/api-tokens)
2. Set environment variable: `export CLOUDFLARE_API_TOKEN="your-token"`
3. Restart Claude Code
4. See `.claude/README.md` for detailed instructions

**Note:** API tokens are never stored in files. Always use environment variables.

## Deployment Configuration

### Cloudflare Pages
- **Build command**: `pnpm run build`
- **Output directory**: `.` (root, not dist)
- **Node version**: 20 (specified in `.node-version`)
- **Config**: `wrangler.toml`
- **Headers**: `_headers` (security headers, cache control)
- **Redirects**: `_redirects` (404 handling)

### Files Deployed
All files in root are deployed, including:
- `index.html` (entry point)
- `dist/app.js` (bundled JavaScript)
- `dist/output.css` (compiled CSS)
- `data/courses.json` (default data)
- `locales/*.json` (translations)
- Static assets (favicon, etc.)

## Troubleshooting

### Build fails with Tailwind error
- Ensure using `@tailwindcss/cli` package (v4)
- Check `src/input.css` for `@theme` syntax errors
- Clear `dist/output.css` and rebuild

### Alpine.js not initializing
- Check browser console for JavaScript errors
- Verify `dist/app.js` was built
- Ensure `x-data="courseApp()"` is present on container

### Tests failing
- Ensure local server running on port 8080
- Check Playwright browser installation: `npx playwright install chromium`
- Verify test file paths in `playwright.config.js`
- Use `pnpm run test:debug` for interactive debugging

### localStorage not persisting
- Check browser privacy settings (localStorage enabled)
- Verify domain/port consistency
- Check for localStorage quota exceeded errors in console
- Use `pnpm run test:functional` to verify persistence logic

### Performance degradation
- Run Lighthouse audit to identify issues
- Check for layout shifts (CLS metric)
- Verify critical CSS is inlined
- Test with production build (`pnpm run build`)
- Run performance tests: `pnpm run test -- -g "Performance"`

---

## Quick Reference for AI Assistants

### Key Constraints
- ✅ **No backend**: All data in localStorage
- ✅ **Single page app**: No routing
- ✅ **Alpine.js only**: No React/Vue/Angular
- ✅ **Vanilla CSS**: Tailwind utilities only
- ✅ **100% test pass rate**: All changes must maintain this

### Before Making Changes
1. ✅ Run tests: `pnpm run test`
2. ✅ Check security: No `x-html`, validate inputs
3. ✅ Consider performance: Avoid layout shifts, optimize waits
4. ✅ Test all devices: Desktop, mobile, tablet
5. ✅ Update translations: EN, ID, JA

### After Making Changes
1. ✅ Build: `pnpm run build`
2. ✅ Test: `pnpm run test` (all 132 tests must pass)
3. ✅ Verify performance: Check Core Web Vitals
4. ✅ Check browser console: No errors
5. ✅ Test on all device profiles

### Common Patterns

**✅ DO:**
```javascript
// Use x-text (XSS safe)
<p x-text="course.name"></p>

// Use condition-based waits
await page.waitForSelector('.element', { state: 'visible' });

// Cache computed values
get unassignedCourses() {
  if (!this._cached) {
    this._cached = this.courses.filter(...);
  }
  return this._cached;
}
```

**❌ DON'T:**
```javascript
// Never use x-html (XSS risk)
<p x-html="course.name"></p>  // ❌

// Never use arbitrary timeouts
await page.waitForTimeout(2000);  // ❌

// Don't repeat expensive calculations
this.courses.filter(...).reduce(...);  // ❌
```

### Emergency Procedures

**Tests failing in CI:**
1. Check GitHub Actions logs
2. Reproduce locally: `pnpm run test -- --project=chromium-[profile]`
3. Debug: `pnpm run test:debug`
4. Fix and verify: `pnpm run test`
5. Push to re-trigger CI

**Build failing:**
1. `pnpm install` to verify dependencies
2. `rm -rf dist/` then rebuild
3. Check Node version: `node -v` (should be 20+)
4. Check for syntax errors in src/

**Performance regression:**
1. Run: `pnpm run test -- -g "Performance"`
2. Check Core Web Vitals: CLS, LCP, FCP, TTI
3. Review recent changes for layout shifts
4. Compare local vs production metrics

---

## Important Links

- **Production:** https://rencanastudi.heri.life
- **GitHub:** heridotlife/course-logs
- **CI/CD:** GitHub Actions (playwright-tests.yml, scheduled-tests.yml)
- **Docs:** README.md (user documentation)
- **Tests:** tests/comprehensive.spec.js (full test suite)

---

**This document is optimized for AI assistants to understand project context, constraints, and best practices. Keep it updated when major changes occur!**
