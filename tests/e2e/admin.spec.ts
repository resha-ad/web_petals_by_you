import { test, expect, Page } from '@playwright/test';

async function loginAsAdmin(page: Page) {
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@petals.com');
    await page.fill('input[type="password"]', 'AdminPass123!');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin', { timeout: 10000 });
}

// ─── Admin Auth Guard ─────────────────────────────────────────
test.describe('Admin Auth Guards', () => {
    test('redirects unauthenticated user away from /admin', async ({ page }) => {
        await page.goto('/admin');
        await expect(page).not.toHaveURL('/admin');
    });

    test('redirects unauthenticated user away from /admin/users', async ({ page }) => {
        await page.goto('/admin/users');
        await expect(page).not.toHaveURL('/admin/users');
    });

    test('redirects unauthenticated user away from /admin/items', async ({ page }) => {
        await page.goto('/admin/items');
        await expect(page).not.toHaveURL('/admin/items');
    });
});

