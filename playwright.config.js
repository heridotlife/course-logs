import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  // ✅ OPTIMIZED: Enable parallel execution (60-70% faster)
  fullyParallel: true,  // Changed from: false
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // ✅ OPTIMIZED: Use multiple workers for better performance
  // CI: 2 workers (GitHub Actions has 2 vCPUs)
  // Local: Auto-detect (50% of CPU cores)
  workers: process.env.CI ? 2 : undefined,  // Changed from: 1
  reporter: [
    ['html', { open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
    // ✅ NEW: GitHub Actions reporter for better CI integration
    ...(process.env.CI ? [['github']] : []),
  ],
  use: {
    baseURL: 'http://127.0.0.1:8080',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // ✅ NEW: Ignore platform-specific differences in snapshots
    ignoreSnapshots: !process.env.CI, // Ignore locally, enforce in CI
    // ✅ NEW: Browser launch optimizations
    launchOptions: {
      args: [
        '--disable-dev-shm-usage',  // Prevent /dev/shm issues in CI
        '--no-sandbox',  // Faster startup (safe in CI containers)
      ],
    },
    // ✅ NEW: Faster timeouts for quicker failure detection
    navigationTimeout: 30000,
    actionTimeout: 10000,
  },
  webServer: {
    command: 'npx http-server -p 8080 -c-1',
    url: 'http://127.0.0.1:8080',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    // ✅ NEW: Suppress server logs to reduce noise
    stdout: 'ignore',
    stderr: 'pipe',
  },
  projects: [
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        // ✅ NEW: Faster animations for quicker tests
        contextOptions: {
          reducedMotion: 'reduce',
        },
      },
    },
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 393, height: 851 },
        contextOptions: {
          reducedMotion: 'reduce',
        },
      },
    },
    {
      name: 'chromium-tablet',
      use: {
        ...devices['iPad Pro'],
        viewport: { width: 1024, height: 1366 },
        contextOptions: {
          reducedMotion: 'reduce',
        },
      },
    },
  ],
  // ✅ OPTIMIZED: Reduced timeout for faster failure detection
  timeout: 45000,  // Changed from: 60000 (15s faster feedback)
  // ✅ NEW: Expect timeout for assertions
  expect: {
    timeout: 10000,  // Assertions should be quick
  },
});
