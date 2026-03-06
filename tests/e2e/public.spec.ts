import { test, expect } from '@playwright/test';

// ─── Home Page ────────────────────────────────────────────────
test.describe('Home Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
    });

    test('loads home page successfully', async ({ page }) => {
        await expect(page).toHaveURL('/');
        await expect(page.locator('body')).toBeVisible();
    });

    test('renders navbar', async ({ page }) => {
        await expect(page.locator('nav')).toBeVisible();
    });

    test('renders footer', async ({ page }) => {
        await expect(page.locator('footer')).toBeVisible();
    });

    test('has link to shop page', async ({ page }) => {
        const shopLink = page.locator('a[href="/shop"]').first();
        await expect(shopLink).toBeVisible();
    });

    test('navigates to shop page from home', async ({ page }) => {
        await page.locator('a[href="/shop"]').first().click();
        await expect(page).toHaveURL('/shop');
    });
});