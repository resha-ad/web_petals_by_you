import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests/e2e',
    fullyParallel: false,
    retries: process.env.CI ? 2 : 0,
    timeout: 30000,
    expect: { timeout: 5000 },
    reporter: [['html', { outputFolder: 'playwright-report' }], ['list']],
    use: {
        baseURL: 'http://localhost:3000',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        // ─── 1. Auth setup: logs in once, saves cookies to .auth/user.json ───
        {
            name: 'setup',
            testMatch: /auth\.setup\.ts/,
        },

        // ─── 2. Auth pages (login / register / forgot / reset) ───────────────
        //        Runs WITHOUT stored cookies so middleware never redirects us
        {
            name: 'auth-pages',
            use: {
                ...devices['Desktop Chrome'],
                storageState: { cookies: [], origins: [] },
            },
            testMatch: /auth\.spec\.ts/,
        },

        // ─── 3. All other tests (dashboard, settings, CRUD, etc.) ────────────
        //        Runs WITH stored auth state (requires setup to run first)
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                storageState: 'tests/.auth/user.json',
            },
            dependencies: ['setup'],
            testIgnore: [/auth\.setup\.ts/, /auth\.spec\.ts/],
        },
    ],
});