import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
const APP = 'http://localhost:3000';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function unauthContext(browser: Browser): Promise<BrowserContext> {
    return browser.newContext({ storageState: { cookies: [], origins: [] } });
}

async function waitForCartReady(page: Page) {
    await Promise.race([
        page.getByText('Shopping Cart').waitFor({ state: 'visible', timeout: 15000 }),
        page.getByText('Your cart awaits').waitFor({ state: 'visible', timeout: 15000 }),
    ]);
}

async function fetchFirstProductId(page: Page): Promise<string> {
    const res = await page.request.get(`${API}/api/items?limit=1`);
    if (!res.ok()) throw new Error(`Failed to fetch products: ${res.status()}`);
    const json = await res.json();
    const items = Array.isArray(json.data) ? json.data : (json.data?.items ?? []);
    if (!items.length) throw new Error('No products in database for seeding');
    return items[0]._id;
}

async function seedCart(page: Page): Promise<void> {
    const itemId = await fetchFirstProductId(page);
    const res = await page.request.post(`${API}/api/cart/add-product`, {
        data: { itemId, quantity: 1 },
    });
    if (!res.ok()) throw new Error(`Failed to seed cart: ${res.status()}`);
}

async function clearCartViaApi(page: Page): Promise<void> {
    await page.request.delete(`${API}/api/cart/clear`);
}

async function openModal(page: Page) {
    await page.goto('/cart');
    await waitForCartReady(page);
    await page.getByText('Proceed to Checkout').click();
    await expect(page.getByRole('heading', { name: 'Place Order' })).toBeVisible({ timeout: 5000 });
}

async function openModalAtStep2(page: Page) {
    await openModal(page);
    await page.getByPlaceholder('Who will receive this order?').fill('Jane Doe');
    await page.getByPlaceholder('98XXXXXXXX').fill('9812345678');
    await page.getByPlaceholder('Order confirmation will be sent here').fill('jane@example.com');
    await page.getByRole('button', { name: /Continue/i }).click();
    await expect(page.getByPlaceholder('House no., street name, tole...')).toBeVisible({ timeout: 5000 });
}

async function openModalAtStep3(page: Page) {
    await openModalAtStep2(page);
    await page.getByPlaceholder('House no., street name, tole...').fill('Thamel, Chaksibari Marg');
    await page.getByPlaceholder('Kathmandu').fill('Kathmandu');
    await page.getByRole('button', { name: /Continue/i }).click();
    await expect(page.getByText('Delivering to')).toBeVisible({ timeout: 5000 });
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Auth guard
// ─────────────────────────────────────────────────────────────────────────────

test.describe('/cart — auth guard', () => {
    test('redirects unauthenticated user to /login', async ({ browser }) => {
        const ctx = await unauthContext(browser);
        try {
            const page = await ctx.newPage();
            await page.goto(`${APP}/cart`);
            await page.waitForURL(/\/login/, { timeout: 10000 });
            expect(page.url()).toContain('/login');
        } finally {
            await ctx.close();
        }
    });

    test('authenticated user reaches /cart without being redirected', async ({ page }) => {
        await page.goto('/cart');
        await waitForCartReady(page);
        expect(page.url()).not.toContain('/login');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Empty cart state — run with empty cart
// ─────────────────────────────────────────────────────────────────────────────

test.describe('/cart — empty state', () => {
    test.beforeAll(async ({ browser }) => {
        const ctx = await browser.newContext({ storageState: 'tests/.auth/user.json' });
        const page = await ctx.newPage();
        await clearCartViaApi(page);
        await ctx.close();
    });

    test('shows "Your cart awaits" title', async ({ page }) => {
        await page.goto('/cart');
        await waitForCartReady(page);
        await expect(page.getByText('Your cart awaits')).toBeVisible();
    });

    test('shows empty cart subtitle', async ({ page }) => {
        await page.goto('/cart');
        await waitForCartReady(page);
        await expect(page.getByText('Every beautiful arrangement begins with a single bloom.')).toBeVisible();
    });

    test('shows Explore Our Florals CTA', async ({ page }) => {
        await page.goto('/cart');
        await waitForCartReady(page);
        await expect(page.getByText('Explore Our Florals')).toBeVisible();
    });

    test('Explore Our Florals navigates to /shop', async ({ page }) => {
        await page.goto('/cart');
        await waitForCartReady(page);
        await page.getByText('Explore Our Florals').click();
        await page.waitForURL('**/shop', { timeout: 8000 });
        expect(page.url()).toContain('/shop');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Page structure (seeded)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('/cart — page structure', () => {
    test.beforeAll(async ({ browser }) => {
        const ctx = await browser.newContext({ storageState: 'tests/.auth/user.json' });
        const page = await ctx.newPage();
        await clearCartViaApi(page);
        await seedCart(page);
        await ctx.close();
    });

    test.afterAll(async ({ browser }) => {
        const ctx = await browser.newContext({ storageState: 'tests/.auth/user.json' });
        const page = await ctx.newPage();
        await clearCartViaApi(page);
        await ctx.close();
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/cart');
        await waitForCartReady(page);
    });

});
