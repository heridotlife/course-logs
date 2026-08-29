/**
 * Rirekisho (履歴書) Export Feature Tests
 * Verifies the export button, sheet rendering, education rows from
 * semester timeline, and cleanup after print dialog.
 *
 * Responsive-safe: on mobile viewports the Import/Export button lives
 * inside the hamburger menu — helper opens it first and filters to the
 * visible instance (same pattern as getResponsiveButtonTestId in
 * comprehensive.spec.js).
 */
import { test, expect } from '@playwright/test';
import { waitForAlpineInit, waitForCourseDataLoaded } from './test-utils.js';

/**
 * Opens the Import/Export modal regardless of viewport.
 * Desktop: header button. Mobile/tablet: hamburger menu → menu button.
 */
async function openImportExportModal(page) {
  const viewport = page.viewportSize();
  const isMobile = viewport && viewport.width < 1024; // lg breakpoint

  const btn = page.locator('button[aria-label="Import or export data"]').filter({ hasNot: page.locator(':hidden') });
  // Playwright strict-mode-safe: pick the visible one after menu state settled
  if (isMobile) {
    const menuBtn = page.getByTestId('mobile-menu-btn');
    if (await menuBtn.isVisible()) {
      await menuBtn.click();
      await page.waitForTimeout(300);
    }
  }
  await page.locator('button[aria-label="Import or export data"]').locator('visible=true').first().click();
}

test.describe('Rirekisho Export', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
      // Headless Chromium fires afterprint synchronously after window.print(),
      // which would run the cleanup handler before assertions. Stub print so
      // sheet state is deterministic; cleanup test dispatches afterprint itself.
      window.print = () => {};
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForAlpineInit(page);
    await waitForCourseDataLoaded(page);
  });

  test('should show rirekisho button in import/export modal', async ({ page }) => {
    await openImportExportModal(page);
    const btn = page.locator('button:has-text("Rirekisho")');
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test('sheet hidden on screen until export triggered', async ({ page }) => {
    // x-cloak + showRirekishoSheet=false → hidden
    await expect(page.locator('#rirekisho-sheet')).toBeHidden();
  });

  test('export click shows sheet, fills education rows from semesters', async ({ page }) => {
    await openImportExportModal(page);
    await page.locator('button:has-text("Rirekisho")').click();

    const sheet = page.locator('#rirekisho-sheet');
    await expect(sheet).toBeVisible();

    // html gets rirekisho-active flag (print CSS hook)
    await expect(page.locator('html')).toHaveClass(/rirekisho-active/);

    // Education rows: 8 regular semesters + 3 antara + 以上 = 12
    const rows = sheet.locator('.rirekisho-history tbody tr');
    await expect(rows).toHaveCount(12);

    // Last row is the 以上 terminator
    await expect(rows.last().locator('.rk-desc')).toHaveText(/以上/);
  });

  test('semester rows carry credits after auto-map', async ({ page }) => {
    // Auto-map courses so semesters have credits
    await page.click('button:has-text("Auto-Map Courses")');
    await page.waitForTimeout(500);

    await openImportExportModal(page);
    await page.locator('button:has-text("Rirekisho")').click();

    const sheet = page.locator('#rirekisho-sheet');
    await expect(sheet).toBeVisible();

    // First semester row should include credits annotation
    const firstRow = sheet.locator('.rirekisho-history tbody tr').first();
    await expect(firstRow.locator('.rk-credits')).toBeVisible();
    await expect(firstRow.locator('.rk-credits')).toHaveText(/credits|SKS|単位/);
  });

  test('personal and licenses sections render blank fill cells', async ({ page }) => {
    await openImportExportModal(page);
    await page.locator('button:has-text("Rirekisho")').click();

    const sheet = page.locator('#rirekisho-sheet');
    await expect(sheet.locator('.rirekisho-personal')).toBeVisible();
    await expect(sheet.locator('.rirekisho-personal .rk-fill').first()).toBeEmpty();

    // 3 blank license rows
    await expect(sheet.locator('.rirekisho-licenses tbody tr')).toHaveCount(3);
  });

  test('cleanup restores state after afterprint', async ({ page }) => {
    await openImportExportModal(page);
    await page.locator('button:has-text("Rirekisho")').click();

    await expect(page.locator('html')).toHaveClass(/rirekisho-active/);

    // Simulate print completion — dispatch manually for determinism.
    await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));

    await expect(page.locator('#rirekisho-sheet')).toBeHidden();
    await expect(page.locator('html')).not.toHaveClass(/rirekisho-active/);
    // Injected print style removed
    const styleCount = await page.locator('#rirekisho-print-style').count();
    expect(styleCount).toBe(0);
  });
});
