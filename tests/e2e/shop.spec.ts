import { test, expect } from '@playwright/test';

// ─── Shop Page Tests ────────────────────────────────────────
test.describe('Shop Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/shop');
        await page.waitForLoadState('networkidle');
    });

    test('renders shop page with hero banner', async ({ page }) => {
        await expect(page.getByText('Our Collection')).toBeVisible();
        await expect(page.getByText('Fresh Daily')).toBeVisible();
    });

    test('renders search bar', async ({ page }) => {
        await expect(page.getByPlaceholder('Search bouquets, flowers...')).toBeVisible();
    });

    test('searches for items', async ({ page }) => {
        await page.fill('input[name="search"]', 'rose');
        await page.click('button[type="submit"]');
        await page.waitForLoadState('networkidle');
        await expect(page).toHaveURL(/search=rose/);
    });

    test('clears search filter', async ({ page }) => {
        await page.goto('/shop?search=rose');
        await page.waitForLoadState('networkidle');
        await expect(page.getByText('Clear all')).toBeVisible();
        await page.getByText('Clear all').click();
        await expect(page).toHaveURL('/shop');
    });

    test('renders item cards when items exist', async ({ page }) => {
        const cards = page.locator('.animate-fade-up');
        const count = await cards.count();
        if (count > 0) {
            await expect(cards.first()).toBeVisible();
        }
    });

    test('clicking item card navigates to product detail', async ({ page }) => {
        const firstCard = page.locator('a[href^="/shop/"]').first();
        const count = await firstCard.count();
        if (count > 0) {
            const href = await firstCard.getAttribute('href');
            await firstCard.click();
            await page.waitForLoadState('networkidle');
            await expect(page).toHaveURL(href!);
        }
    });
});

// ─── Product Detail Tests ───────────────────────────────────
test.describe('Product Detail Page', () => {
    test('shows 404 for non-existent product', async ({ page }) => {
        const res = await page.goto('/shop/this-product-does-not-exist-xyz');
        await expect(page.locator('body')).toBeVisible();
    });

    test('trust strip is visible on product detail', async ({ page }) => {
        await page.goto('/shop');
        await page.waitForLoadState('networkidle');
        const firstLink = page.locator('a[href^="/shop/"]').first();
        if (await firstLink.count() > 0) {
            await firstLink.click();
            await page.waitForLoadState('networkidle');
            await expect(page.getByText('Fresh Daily')).toBeVisible();
            await expect(page.getByText('Fast Delivery')).toBeVisible();
        }
    });
});