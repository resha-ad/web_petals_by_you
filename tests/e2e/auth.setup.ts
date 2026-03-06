import { test as setup, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const AUTH_FILE = path.join(__dirname, '../.auth/user.json');

// ── Credentials ───────────────────────────────────────────────────────────────
const USER = { email: 'testuser@petals.com', password: 'TestUser123!' };
// const ADMIN = { email: 'admin@petals.com',    password: 'AdminPass123!' };
// Swap USER → ADMIN above if you need an admin session saved instead.

setup('authenticate and save storage state', async ({ page }) => {
    const authDir = path.dirname(AUTH_FILE);
    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    await page.goto('/login');
    await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();

    await page.fill('input[type="email"]', USER.email);
    await page.fill('input[type="password"]', USER.password);

    await page.getByRole('button', { name: /Sign In/i }).click();

    // LoginForm uses window.location.href → real full-page navigation
    await page.waitForURL(/\/(user\/dashboard|admin)/, { timeout: 20000 });

    const url = page.url();
    expect(url).not.toContain('/login');

    await page.context().storageState({ path: AUTH_FILE });

    console.log(`✓ Auth setup complete. Storage saved to: ${AUTH_FILE}`);
    console.log(`✓ Landed on: ${url}`);
});