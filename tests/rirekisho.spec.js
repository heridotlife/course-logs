/**
 * Rirekisho (履歴書) Export Feature Tests
 * Verifies the export button, sheet rendering, education rows from
 * semester timeline, and cleanup after print dialog.
 */
import { test, expect } from '@playwright/test';
import { waitForAlpineInit, waitForCourseDataLoaded } from './test-utils.js';

test.describe('Rirekisho Export', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForAlpineInit(page);
    await waitForCourseDataLoaded(page);
  });

  test('should show rirekisho button in import/export modal', async ({ page }) => {
    await page.click('button[aria-label="Import or export data"]');
    const btn = page.locator('button:has-text("Rirekisho")');
    await expect(btn).toBeVisible();
    await expect(btn).toBeEnabled();
  });

  test('sheet hidden on screen until export triggered', async ({ page }) => {
    // x-cloak + showRirekishoSheet=false → hidden
    await expect(page.locator('#rirekisho-sheet')).toBeHidden();
  });

  test('export click shows sheet, fills education rows from semesters', async ({ page }) => {
    // Open import/export modal
    await page.click('button[aria-label="Import or export data"]');
    await page.click('button:has-text("Rirekisho")');

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

    await page.click('button[aria-label="Import or export data"]');
    await page.click('button:has-text("Rirekisho")');

    const sheet = page.locator('#rirekisho-sheet');
    await expect(sheet).toBeVisible();

    // First semester row should include credits annotation
    const firstRow = sheet.locator('.rirekisho-history tbody tr').first();
    await expect(firstRow.locator('.rk-credits')).toBeVisible();
    await expect(firstRow.locator('.rk-credits')).toHaveText(/credits|SKS|単位/);
  });

  test('personal and licenses sections render blank fill cells', async ({ page }) => {
    await page.click('button[aria-label="Import or export data"]');
    await page.click('button:has-text("Rirekisho")');

    const sheet = page.locator('#rirekisho-sheet');
    await expect(sheet.locator('.rirekisho-personal')).toBeVisible();
    await expect(sheet.locator('.rirekisho-personal .rk-fill').first()).toBeEmpty();

    // 3 blank license rows
    await expect(sheet.locator('.rirekisho-licenses tbody tr')).toHaveCount(3);
  });

  test('cleanup restores state after afterprint', async ({ page }) => {
    await page.click('button[aria-label="Import or export data"]');
    await page.click('button:has-text("Rirekisho")');

    await expect(page.locator('html')).toHaveClass(/rirekisho-active/);

    // Simulate print completion — Playwright headless fires afterprint
    // when print is overridden; dispatch manually for determinism.
    await page.evaluate(() => window.dispatchEvent(new Event('afterprint')));

    await expect(page.locator('#rirekisho-sheet')).toBeHidden();
    await expect(page.locator('html')).not.toHaveClass(/rirekisho-active/);
    // Injected print style removed
    const styleCount = await page.locator('#rirekisho-print-style').count();
    expect(styleCount).toBe(0);
  });
});
