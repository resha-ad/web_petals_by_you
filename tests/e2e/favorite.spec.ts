
import { test, expect, Browser, BrowserContext, Page } from '@playwright/test';

const API = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050';
const APP = 'http://localhost:3000';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

async function unauthContext(browser: Browser): Promise<BrowserContext> {
    return browser.newContext({ storageState: { cookies: [], origins: [] } });
}

async function waitForFavoritesReady(page: Page) {
    await page.getByRole('heading', { name: 'My Favorites' }).waitFor({
        state: 'visible',
        timeout: 15000,
    });
}

async function fetchFirstProductId(page: Page): Promise<string> {
    const res = await page.request.get(`${API}/api/items?limit=1`);
    if (!res.ok()) throw new Error(`Failed to fetch products: ${res.status()}`);
    const json = await res.json();
    const items = Array.isArray(json.data) ? json.data : (json.data?.items ?? []);
    if (!items.length) throw new Error('No products in database for seeding');
    return items[0]._id;
}

async function seedFavorites(page: Page): Promise<string> {
    const refId = await fetchFirstProductId(page);
    const res = await page.request.post(`${API}/api/favorites/add`, {
        data: { type: 'product', refId },
    });
    if (!res.ok()) throw new Error(`Failed to seed favorites: ${res.status()}`);
    return refId;
}

async function clearFavoritesViaApi(page: Page): Promise<void> {
    // Fetch all favorites then remove each
    const res = await page.request.get(`${API}/api/favorites`);
    if (!res.ok()) return;
    const json = await res.json();
    const items = json?.data?.items ?? [];
    await Promise.all(
        items.map((item: any) => {
            const refId = typeof item.refId === 'object'
                ? (item.refId._id ?? item.refId).toString()
                : String(item.refId);
            return page.request.delete(`${API}/api/favorites/remove/${refId}`);
        })
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Auth guard
// ─────────────────────────────────────────────────────────────────────────────

test.describe('/favorites — auth guard', () => {
    test('redirects unauthenticated user to /login', async ({ browser }) => {
        const ctx = await unauthContext(browser);
        try {
            const page = await ctx.newPage();
            await page.goto(`${APP}/favorites`);
            await page.waitForURL(/\/login/, { timeout: 10000 });
            expect(page.url()).toContain('/login');
        } finally {
            await ctx.close();
        }
    });

    test('authenticated user reaches /favorites without redirect', async ({ page }) => {
        await page.goto('/favorites');
        await waitForFavoritesReady(page);
        expect(page.url()).not.toContain('/login');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. Empty state — run with cleared favorites
// ─────────────────────────────────────────────────────────────────────────────

test.describe('/favorites — empty state', () => {
    test.beforeAll(async ({ browser }) => {
        const ctx = await browser.newContext({ storageState: 'tests/.auth/user.json' });
        const page = await ctx.newPage();
        await clearFavoritesViaApi(page);
        await ctx.close();
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/favorites');
        await waitForFavoritesReady(page);
    });

    test('shows "Nothing saved yet" title', async ({ page }) => {
        await expect(page.getByText('Nothing saved yet')).toBeVisible();
    });

    test('shows empty state subtitle', async ({ page }) => {
        await expect(
            page.getByText('When you find something you love, tap the heart.')
        ).toBeVisible();
    });

    test('shows Explore Florals CTA', async ({ page }) => {
        await expect(page.getByText('Explore Florals')).toBeVisible();
    });

    test('Explore Florals navigates to /shop', async ({ page }) => {
        await page.getByText('Explore Florals').click();
        await page.waitForURL('**/shop', { timeout: 8000 });
        expect(page.url()).toContain('/shop');
    });

    test('count badge shows 0 items', async ({ page }) => {
        await expect(page.locator('.fav-count-badge')).toContainText('0');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. Page structure (seeded)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('/favorites — page structure', () => {
    test.beforeAll(async ({ browser }) => {
        const ctx = await browser.newContext({ storageState: 'tests/.auth/user.json' });
        const page = await ctx.newPage();
        await clearFavoritesViaApi(page);
        await seedFavorites(page);
        await ctx.close();
    });

    test.afterAll(async ({ browser }) => {
        const ctx = await browser.newContext({ storageState: 'tests/.auth/user.json' });
        const page = await ctx.newPage();
        await clearFavoritesViaApi(page);
        await ctx.close();
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/favorites');
        await waitForFavoritesReady(page);
    });

    test('shows ♡ Saved eyebrow', async ({ page }) => {
        await expect(page.getByText('♡ Saved')).toBeVisible();
    });

    test('shows My Favorites heading', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'My Favorites' })).toBeVisible();
    });

    test('count badge shows correct item count', async ({ page }) => {
        await expect(page.locator('.fav-count-badge')).toContainText('1');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. Favorites grid (seeded)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('/favorites — favorites grid', () => {
    test.beforeAll(async ({ browser }) => {
        const ctx = await browser.newContext({ storageState: 'tests/.auth/user.json' });
        const page = await ctx.newPage();
        await clearFavoritesViaApi(page);
        await seedFavorites(page);
        await ctx.close();
    });

    test.afterAll(async ({ browser }) => {
        const ctx = await browser.newContext({ storageState: 'tests/.auth/user.json' });
        const page = await ctx.newPage();
        await clearFavoritesViaApi(page);
        await ctx.close();
    });

    test.beforeEach(async ({ page }) => {
        await page.goto('/favorites');
        await waitForFavoritesReady(page);
    });

    test('renders at least one favorite card', async ({ page }) => {
        await expect(page.locator('.fav-card').first()).toBeVisible();
    });

    test('card shows a ✦ type badge', async ({ page }) => {
        await expect(page.locator('.fav-card-type').first()).toContainText('✦');
    });

    test('card shows an item name', async ({ page }) => {
        const name = page.locator('.fav-card-name').first();
        await expect(name).toBeVisible();
        const text = await name.innerText();
        expect(text.trim().length).toBeGreaterThan(0);
    });

    test('card shows price with Rs.', async ({ page }) => {
        const price = page.locator('.fav-card-price').first();
        if (await price.isVisible()) {
            await expect(price).toContainText('Rs.');
        }
    });

    test('card has View Item element', async ({ page }) => {
        await expect(page.locator('.fav-card-view').first()).toContainText('View Item');
    });

    test('card has Remove button', async ({ page }) => {
        await expect(page.locator('.fav-card-remove').first()).toContainText('Remove');
    });

    test('card has overlay Remove from favorites button', async ({ page }) => {
        await expect(
            page.getByRole('button', { name: 'Remove from favorites' }).first()
        ).toBeVisible();
    });

    test('View Item link for a product points to /shop/', async ({ page }) => {
        const viewLinks = page.locator('a.fav-card-view');
        if (await viewLinks.count() > 0) {
            const href = await viewLinks.first().getAttribute('href');
            expect(href).toMatch(/\/shop\//);
        }
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. Remove item (re-seeded per test for isolation)
// ─────────────────────────────────────────────────────────────────────────────

test.describe('/favorites — remove item', () => {
    test.beforeEach(async ({ page }) => {
        await clearFavoritesViaApi(page);
        await seedFavorites(page);
        await page.goto('/favorites');
        await waitForFavoritesReady(page);
    });

    test.afterAll(async ({ browser }) => {
        const ctx = await browser.newContext({ storageState: 'tests/.auth/user.json' });
        const page = await ctx.newPage();
        await clearFavoritesViaApi(page);
        await ctx.close();
    });

    test('Remove button removes the card (no confirm dialog)', async ({ page }) => {
        // Favorites remove fires directly — no confirm() needed
        await page.locator('.fav-card-remove').first().click();
        await expect(page.getByText('Nothing saved yet')).toBeVisible({ timeout: 10000 });
    });

    test('overlay X button also removes the card', async ({ page }) => {
        await page.getByRole('button', { name: 'Remove from favorites' }).first().click();
        await expect(page.getByText('Nothing saved yet')).toBeVisible({ timeout: 10000 });
    });

    test('removing last item shows empty state', async ({ page }) => {
        await page.locator('.fav-card-remove').first().click();
        await expect(page.getByText('Nothing saved yet')).toBeVisible({ timeout: 10000 });
        await expect(page.locator('.fav-count-badge')).toContainText('0');
    });

    test('card fades (opacity-40) while removal API call is in flight', async ({ page }) => {
        await page.route(`${API}/api/favorites/remove/**`, async route => {
            await new Promise(r => setTimeout(r, 400));
            await route.continue();
        });

        await page.locator('.fav-card-remove').first().click();
        await expect(page.locator('.fav-card.opacity-40').first()).toBeVisible({ timeout: 3000 });
    });
});