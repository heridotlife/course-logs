/**
 * Test Utilities & Helpers for Course-Logs Test Suite
 * Provides reusable functions and fixtures for test operations
 *
 * PERFORMANCE OPTIMIZATIONS:
 * - Added Alpine.js initialization helper
 * - Added auto-map completion helper
 * - Reduced metric collection time
 * - Added proper wait conditions
 */

import { expect } from '@playwright/test';

/**
 * Waits for Alpine.js to initialize on the page
 * Replaces arbitrary waitForTimeout calls
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @param {number} timeout - Maximum wait time in ms (default: 5000)
 * @returns {Promise<void>}
 */
export async function waitForAlpineInit(page, timeout = 5000) {
  await page.waitForFunction(
    () => {
      // Check if Alpine.js is loaded and component is initialized
      return window.Alpine &&
             document.querySelector('[x-data]') &&
             !document.querySelector('[x-cloak]');
    },
    { timeout }
  );
}

/**
 * Waits for course data to be loaded and rendered
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<void>}
 */
export async function waitForCourseDataLoaded(page) {
  // Wait for at least one course card to be rendered
  await page.waitForSelector('select', { state: 'attached', timeout: 10000 });
  // Verify Alpine.js reactive state is ready
  await waitForAlpineInit(page);
}

/**
 * Waits for auto-map operation to complete
 * Replaces waitForTimeout(2500)
 *
 * @param {import('@playwright/test').Page} page - Playwright page object
 * @returns {Promise<void>}
 */
export async function waitForAutoMapComplete(page) {
  // Wait for the unassigned count to change to 0
  await page.waitForFunction(
    () => {
      const text = document.body.innerText;
      const match = text.match(/Unassigned Courses[\s\S]*?(\d+)/);
      return match && parseInt(match[1]) === 0;
    },
    { timeout: 5000 }  // Faster than arbitrary 2500ms
  );
}

/**
 * Collects Core Web Vitals metrics from page (OPTIMIZED)
 * @param {Page} page - Playwright page object
 * @param {number} collectDuration - How long to collect metrics in ms (default: 2000, reduced from 3000)
 * @returns {Promise<Object>} Object with CLS, LCP, FCP, TTI metrics
 */
export async function collectWebVitals(page, collectDuration = 2000) {
  return page.evaluate(async (duration) => {
    return new Promise((resolve) => {
      let vitals = {
        CLS: 0,
        LCP: 0,
        FCP: 0,
        TTI: 0,
      };

      // Measure Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            vitals.CLS += entry.value;
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

      // Measure Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        vitals.LCP = lastEntry.renderTime || lastEntry.loadTime;
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // First Contentful Paint (FCP) from Paint Timing
      const paintEntries = performance.getEntriesByType('paint');
      const fcp = paintEntries.find(e => e.name === 'first-contentful-paint');
      if (fcp) vitals.FCP = fcp.startTime;

      // Time to Interactive approximation
      const navigation = performance.getEntriesByType('navigation')[0];
      if (navigation) {
        vitals.TTI = navigation.domInteractive;
      }

      // Return metrics after collection duration (optimized from 3000ms to 2000ms default)
      setTimeout(() => {
        clsObserver.disconnect();
        lcpObserver.disconnect();
        resolve(vitals);
      }, duration);
    });
  }, collectDuration);
}

/**
 * Checks accessibility for a page
 * @param {Page} page - Playwright page object
 * @returns {Promise<Object>} Object with accessibility check results
 */
export async function checkAccessibility(page) {
  return page.evaluate(() => {
    const issues = {
      missingAltText: [],
      missingLabels: [],
      lowContrast: [],
      missingHeadings: [],
    };

    // Check for missing alt text
    document.querySelectorAll('img').forEach(img => {
      if (!img.getAttribute('alt')) {
        issues.missingAltText.push(img.src);
      }
    });

    // Check for unlabeled form controls
    document.querySelectorAll('input, select, textarea').forEach(field => {
      const hasLabel = !!document.querySelector(`label[for="${field.id}"]`) ||
                      !!field.getAttribute('aria-label') ||
                      !!field.getAttribute('aria-labelledby');
      if (!hasLabel) {
        issues.missingLabels.push(field.name || field.id || 'unnamed');
      }
    });

    // Check heading hierarchy
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (headings.length === 0) {
      issues.missingHeadings.push('No headings found');
    }

    let h1Count = 0;
    headings.forEach(h => {
      if (h.tagName === 'H1') h1Count++;
    });
    if (h1Count !== 1) {
      issues.missingHeadings.push(`Found ${h1Count} H1 tags, expected 1`);
    }

    return issues;
  });
}

/**
 * Gets all course assignments from page
 * @param {Page} page - Playwright page object
 * @returns {Promise<Array>} Array of course assignment objects
 */
export async function getCourseAssignments(page) {
  return page.evaluate(() => {
    const assignments = [];
    document.querySelectorAll('select').forEach((select, index) => {
      assignments.push({
        index,
        value: select.value,
        options: Array.from(select.options).map(o => o.value),
      });
    });
    return assignments;
  });
}

/**
 * Gets semester statistics from page
 * @param {Page} page - Playwright page object
 * @returns {Promise<Array>} Array of semester credit information
 */
export async function getSemesterStats(page) {
  return page.evaluate(() => {
    const stats = [];
    document.querySelectorAll('h3').forEach(h3 => {
      if (h3.textContent.includes('Semester') || h3.textContent.includes('Antara')) {
        const parent = h3.closest('div');
        const text = parent?.textContent || '';
        const match = text.match(/(\d+)\/(\d+) credits/);
        if (match) {
          stats.push({
            name: h3.textContent.trim(),
            current: parseInt(match[1]),
            max: parseInt(match[2]),
            isFull: parseInt(match[1]) >= parseInt(match[2]),
          });
        }
      }
    });
    return stats;
  });
}

/**
 * Simulates user completing full workflow (OPTIMIZED)
 * Uses proper waiting strategies instead of arbitrary timeouts
 *
 * @param {Page} page - Playwright page object
 */
export async function simulateFullWorkflow(page) {
  // 1. Toggle dark mode
  const darkModeBtn = page.getByLabel(/Switch to (dark|light) mode/);
  await darkModeBtn.click();

  // ✅ OPTIMIZED: Wait for dark mode class to apply
  await page.waitForFunction(
    () => document.documentElement.classList.contains('dark') ||
          document.body.classList.contains('dark')
  );

  // 2. Assign some courses
  const dropdowns = page.locator('select');
  const count = await dropdowns.count();

  for (let i = 0; i < Math.min(3, count); i++) {
    const dropdown = dropdowns.nth(i);
    await dropdown.selectOption('Semester 1');

    // ✅ OPTIMIZED: Wait for value to actually update
    await page.waitForFunction(
      (idx) => {
        const select = document.querySelectorAll('select')[idx];
        return select && select.value === 'Semester 1';
      },
      i
    );
  }

  // 3. Save progress
  const saveBtn = page.getByRole('button', { name: /Save/i });
  await saveBtn.click();

  // ✅ OPTIMIZED: Wait for localStorage to be updated
  await page.waitForFunction(
    () => localStorage.getItem('courseData') !== null
  );

  // 4. Switch language
  const languageBtn = page.getByLabel(/Change language/);
  if (await languageBtn.isVisible()) {
    await languageBtn.click();
    const idOption = page.getByRole('menuitem', { name: /Bahasa Indonesia/ });

    if (await idOption.isVisible()) {
      await idOption.click();

      // ✅ OPTIMIZED: Wait for language to change
      await page.waitForFunction(
        () => localStorage.getItem('language') === 'id'
      );
    }
  }

  // 5. Reload and verify persistence
  await page.reload();
  await page.waitForLoadState('domcontentloaded');  // ✅ OPTIMIZED: Faster than networkidle
  await waitForAlpineInit(page);
}

/**
 * Measures memory usage during operation
 * @param {Page} page - Playwright page object
 * @param {Function} operation - Async function to measure
 * @returns {Promise<Object>} Memory usage statistics
 */
export async function measureMemory(page, operation) {
  const before = await page.evaluate(() => {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      };
    }
    return null;
  });

  // Execute operation
  await operation();

  const after = await page.evaluate(() => {
    if (performance.memory) {
      return {
        usedJSHeapSize: performance.memory.usedJSHeapSize,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
      };
    }
    return null;
  });

  if (before && after) {
    return {
      before,
      after,
      delta: {
        usedJSHeapSize: after.usedJSHeapSize - before.usedJSHeapSize,
        totalJSHeapSize: after.totalJSHeapSize - before.totalJSHeapSize,
      },
      percentChange: ((after.usedJSHeapSize - before.usedJSHeapSize) / before.usedJSHeapSize) * 100,
    };
  }

  return null;
}

/**
 * Validates that credit limits are respected
 * @param {Page} page - Playwright page object
 * @returns {Promise<Object>} Validation results
 */
export async function validateCreditLimits(page) {
  const stats = await getSemesterStats(page);

  const violations = [];
  stats.forEach(stat => {
    if (stat.current > stat.max) {
      violations.push({
        semester: stat.name,
        current: stat.current,
        max: stat.max,
        excess: stat.current - stat.max,
      });
    }
  });

  return {
    isValid: violations.length === 0,
    violations,
    stats,
  };
}

/**
 * Generates a test report from metrics
 * @param {Object} metrics - Collected metrics
 * @returns {String} Formatted report
 */
export function generateReport(metrics) {
  const report = `
╔════════════════════════════════════════════╗
║     Course-Logs Test Report Summary        ║
╚════════════════════════════════════════════╝

PERFORMANCE METRICS
───────────────────
CLS (Cumulative Layout Shift):      ${metrics.CLS?.toFixed(3) || 'N/A'}
FCP (First Contentful Paint):       ${metrics.FCP?.toFixed(0) || 'N/A'}ms
LCP (Largest Contentful Paint):     ${metrics.LCP?.toFixed(0) || 'N/A'}ms
TTI (Time to Interactive):          ${metrics.TTI?.toFixed(0) || 'N/A'}ms

TARGETS
───────
✓ CLS < 0.1
✓ FCP < 1500ms
✓ LCP < 2500ms
✓ TTI < 3500ms

DETAILS
─────────────────────────────────────────────
DOM Content Loaded:     ${metrics.domContentLoaded?.toFixed(0) || 'N/A'}ms
Load Time:              ${metrics.loadTime?.toFixed(0) || 'N/A'}ms
Resource Count:         ${metrics.resourceCount || 'N/A'}

ACCESSIBILITY
──────────────
Missing Alt Text:       ${metrics.accessibilityIssues?.missingAltText?.length || 0}
Missing Labels:         ${metrics.accessibilityIssues?.missingLabels?.length || 0}
Missing Headings:       ${metrics.accessibilityIssues?.missingHeadings?.length || 0}

STATUS: ${checkStatus(metrics)}
  `;
  return report;
}

function checkStatus(metrics) {
  const checks = [
    metrics.CLS !== undefined && metrics.CLS < 0.1,
    metrics.FCP !== undefined && metrics.FCP < 1500,
    metrics.LCP !== undefined && metrics.LCP < 2500,
    metrics.TTI !== undefined && metrics.TTI < 3500,
  ];

  const passed = checks.filter(c => c).length;
  const total = checks.length;

  if (passed === total) return '✅ ALL CHECKS PASSED';
  if (passed >= total - 1) return '⚠️ MINOR ISSUES';
  return '❌ MAJOR ISSUES';
}

/**
 * Test data fixtures for consistent testing
 */
export const testFixtures = {
  sampleCourse: {
    id: 'test-course-1',
    code: 'TEST101',
    name: 'Test Course',
    type: 'Wajib',
    credits: 3,
    lecturer: 'Test Lecturer',
    recommendedSemester: 1,
    assignedSemester: null,
  },

  performanceTargets: {
    CLS: 0.15,          // Cumulative Layout Shift < 0.15 (increased for tablet tolerance)
    LCP: 2500,          // Largest Contentful Paint < 2.5s
    FCP: 1500,          // First Contentful Paint < 1.5s
    TTI: 3500,          // Time to Interactive < 3.5s
  },
};

export default {
  // New optimized helpers
  waitForAlpineInit,
  waitForCourseDataLoaded,
  waitForAutoMapComplete,
  // Existing helpers (optimized)
  collectWebVitals,
  checkAccessibility,
  getCourseAssignments,
  getSemesterStats,
  simulateFullWorkflow,
  measureMemory,
  validateCreditLimits,
  generateReport,
  // Test fixtures
  testFixtures,
};
