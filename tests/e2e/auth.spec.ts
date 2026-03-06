/**
 * auth.spec.ts
 *
 * All authentication page tests in one file.
 * Runs in the `auth-pages` project (no stored cookies) so middleware
 * never redirects us away from /login or /register before we test them.
 *
 * Sections:
 *  1. /login        — rendering, validation, UI, successful login, error handling
 *  2. /register     — rendering, validation, UI, successful registration
 *  3. /forgot-password — rendering, validation, success state, navigation
 *  4. /reset-password  — token guard, rendering, validation, success state
 */

import { test, expect } from '@playwright/test';

// ── Credentials ────────────────────────────────────────────────────────────────
const USER = { email: 'testuser@petals.com', password: 'TestUser123!' };
const ADMIN = { email: 'admin@petals.com', password: 'AdminPass123!' };

// ─────────────────────────────────────────────────────────────────────────────
// Shared helpers
// ─────────────────────────────────────────────────────────────────────────────

const fillRegisterForm = async (page: any, overrides: Record<string, string> = {}) => {
    const defaults = {
        firstName: 'Test',
        lastName: 'User',
        email: `test+${Date.now()}@example.com`,
        username: `user${Date.now()}`,
        password: 'password123',
        confirmPassword: 'password123',
    };
    const v = { ...defaults, ...overrides };
    await page.getByPlaceholder('Jane').fill(v.firstName);
    await page.getByPlaceholder('Doe').fill(v.lastName);
    await page.getByPlaceholder('jane@example.com').fill(v.email);
    await page.getByPlaceholder('janedoe').fill(v.username);
    await page.getByPlaceholder('Create a password').fill(v.password);
    await page.getByPlaceholder('Confirm your password').fill(v.confirmPassword);
};

const FAKE_RESET_TOKEN = 'test-reset-token-abc123';
const RESET_URL = `/reset-password?token=${FAKE_RESET_TOKEN}`;

// ─────────────────────────────────────────────────────────────────────────────
// 1. LOGIN PAGE  /login
// ─────────────────────────────────────────────────────────────────────────────

test.describe('/login — rendering', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('displays the welcome heading', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Welcome back' })).toBeVisible();
    });

    test('displays the sign-in subtitle', async ({ page }) => {
        await expect(page.getByText('Sign in to continue')).toBeVisible();
    });

    test('renders email input', async ({ page }) => {
        await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    });

    test('renders password input as type=password by default', async ({ page }) => {
        const input = page.getByPlaceholder('••••••••');
        await expect(input).toBeVisible();
        await expect(input).toHaveAttribute('type', 'password');
    });

    test('renders Sign In button', async ({ page }) => {
        await expect(page.getByRole('button', { name: /Sign In/i })).toBeVisible();
    });

    test('renders Forgot password link pointing to /forgot-password', async ({ page }) => {
        const link = page.getByRole('link', { name: 'Forgot password?' });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', '/forgot-password');
    });

    test('renders Sign up link pointing to /register', async ({ page }) => {
        const link = page.getByRole('link', { name: 'Sign up' });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', '/register');
    });
});

test.describe('/login — client-side validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('shows email error on empty submit', async ({ page }) => {
        await page.getByRole('button', { name: /Sign In/i }).click();
        await expect(page.getByText('Invalid email address')).toBeVisible();
    });

    test('shows password error on empty submit', async ({ page }) => {
        await page.getByRole('button', { name: /Sign In/i }).click();
        await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
    });

    test('shows error for password shorter than 8 characters', async ({ page }) => {
        await page.getByPlaceholder('you@example.com').fill('test@example.com');
        await page.getByPlaceholder('••••••••').fill('short');
        await page.getByRole('button', { name: /Sign In/i }).click();
        await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
    });

    test('clears email error after valid input is provided', async ({ page }) => {
        await page.getByRole('button', { name: /Sign In/i }).click();
        await expect(page.getByText('Invalid email address')).toBeVisible();

        await page.getByPlaceholder('you@example.com').fill('valid@example.com');
        await page.getByPlaceholder('••••••••').fill('validpassword123');
        await page.getByRole('button', { name: /Sign In/i }).click();
        await expect(page.getByText('Invalid email address')).not.toBeVisible();
    });
});

test.describe('/login — UI interactions', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
    });

    test('password toggle reveals and hides password text', async ({ page }) => {
        const passwordInput = page.getByPlaceholder('••••••••');
        const toggleButton = page.getByRole('button', { name: /show password|hide password/i });

        await passwordInput.fill('mypassword');
        await expect(passwordInput).toHaveAttribute('type', 'password');

        await toggleButton.click();
        await expect(passwordInput).toHaveAttribute('type', 'text');

        await toggleButton.click();
        await expect(passwordInput).toHaveAttribute('type', 'password');
    });

    test('clicking Forgot password navigates to /forgot-password', async ({ page }) => {
        await page.getByRole('link', { name: 'Forgot password?' }).click();
        await page.waitForURL('**/forgot-password');
        await expect(page).toHaveURL(/forgot-password/);
    });

    test('clicking Sign up navigates to /register', async ({ page }) => {
        await page.getByRole('link', { name: 'Sign up' }).click();
        await page.waitForURL('**/register');
        await expect(page).toHaveURL(/register/);
    });

});

test.describe('/login — successful login', () => {
    test('valid credentials redirect to dashboard', async ({ page }) => {
        await page.goto('/login');
        await page.fill('input[type="email"]', USER.email);
        await page.fill('input[type="password"]', USER.password);
        await page.getByRole('button', { name: /Sign In/i }).click();

        // window.location.href causes a hard navigation — needs waitForURL
        await page.waitForURL(/\/(user\/dashboard|admin)/, { timeout: 20000 });
        expect(page.url()).toMatch(/\/(user\/dashboard|admin)/);
    });

    test('already-logged-in user is redirected away from /login by middleware', async ({ browser }) => {
        const context = await browser.newContext();
        const page = await context.newPage();

        await page.goto('/login');
        await page.fill('input[type="email"]', USER.email);
        await page.fill('input[type="password"]', USER.password);
        await page.getByRole('button', { name: /Sign In/i }).click();
        await page.waitForURL(/\/(user\/dashboard|admin)/, { timeout: 20000 });

        // Now try /login again — middleware should redirect away
        await page.goto('/login');
        await page.waitForURL(/\/(user\/dashboard|admin)/, { timeout: 10000 });
        expect(page.url()).not.toContain('/login');

        await context.close();
    });
});

test.describe('/login — server error handling', () => {
    test('shows error container for wrong credentials', async ({ page }) => {
        await page.route('**/login', async (route) => {
            if (route.request().method() === 'POST') {
                await route.fulfill({
                    status: 200,
                    contentType: 'text/x-component',
                    body: '1:{"success":false,"message":"Invalid email or password"}',
                });
            } else {
                await route.continue();
            }
        });

        await page.goto('/login');
        await page.getByPlaceholder('you@example.com').fill('wrong@example.com');
        await page.getByPlaceholder('••••••••').fill('wrongpassword');
        await page.getByRole('button', { name: /Sign In/i }).click();

        await expect(page.locator('.bg-rose-50')).toBeVisible({ timeout: 8000 });
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. REGISTER PAGE  /register
// ─────────────────────────────────────────────────────────────────────────────

test.describe('/register — rendering', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/register');
    });

    test('displays the Welcome heading', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible();
    });

    test('displays the sign-up subtitle', async ({ page }) => {
        await expect(page.getByText('Sign up to continue')).toBeVisible();
    });

    test('renders optional Phone field', async ({ page }) => {
        await expect(page.getByPlaceholder('98XXXXXXXX')).toBeVisible();
    });

    test('password inputs are type=password by default', async ({ page }) => {
        await expect(page.getByPlaceholder('Create a password')).toHaveAttribute('type', 'password');
        await expect(page.getByPlaceholder('Confirm your password')).toHaveAttribute('type', 'password');
    });

    test('renders Sign Up button', async ({ page }) => {
        await expect(page.getByRole('button', { name: /Sign Up/i })).toBeVisible();
    });

    test('renders Login link pointing to /login', async ({ page }) => {
        const link = page.getByRole('link', { name: 'Login' });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', '/login');
    });
});

test.describe('/register — client-side validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/register');
    });

    test('shows all required errors on empty submit', async ({ page }) => {
        await page.getByRole('button', { name: /Sign Up/i }).click();
        await expect(page.getByText('First name is required')).toBeVisible();
        await expect(page.getByText('Last name is required')).toBeVisible();
        await expect(page.getByText('Username must be at least 3 characters')).toBeVisible();
        await expect(page.getByText('Invalid email address')).toBeVisible();
        await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
    });

    test('shows error for username shorter than 3 characters', async ({ page }) => {
        await page.getByPlaceholder('janedoe').fill('ab');
        await page.getByRole('button', { name: /Sign Up/i }).click();
        await expect(page.getByText('Username must be at least 3 characters')).toBeVisible();
    });

    test('shows error when passwords do not match', async ({ page }) => {
        await page.getByPlaceholder('Create a password').fill('password123');
        await page.getByPlaceholder('Confirm your password').fill('different456');
        await page.getByRole('button', { name: /Sign Up/i }).click();
        await expect(page.getByText('Passwords do not match')).toBeVisible();
    });

    test('shows error for invalid Nepal phone number', async ({ page }) => {
        await page.getByPlaceholder('98XXXXXXXX').fill('123');
        await page.getByRole('button', { name: /Sign Up/i }).click();
        await expect(page.getByText('Invalid phone number (e.g. 98XXXXXXXX)')).toBeVisible();
    });
});

test.describe('/register — UI interactions', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/register');
    });

    test('Login link navigates to /login', async ({ page }) => {
        await page.getByRole('link', { name: 'Login' }).click();
        await page.waitForURL('**/login');
        await expect(page).toHaveURL(/\/login/);
    });
});


// ─────────────────────────────────────────────────────────────────────────────
// 3. FORGOT PASSWORD PAGE  /forgot-password
// ─────────────────────────────────────────────────────────────────────────────

test.describe('/forgot-password — rendering', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/forgot-password');
    });

    test('displays the Forgot Password heading', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Forgot Password?' })).toBeVisible();
    });

    test('displays the instructions subtitle', async ({ page }) => {
        await expect(page.getByText("Enter your email and we'll send you a reset link.")).toBeVisible();
    });

    test('renders email input', async ({ page }) => {
        await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    });

    test('renders Send Reset Link button', async ({ page }) => {
        await expect(page.getByRole('button', { name: /Send Reset Link/i })).toBeVisible();
    });

    test('renders Back to Login link pointing to /login', async ({ page }) => {
        const link = page.getByRole('link', { name: 'Back to Login' });
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', '/login');
    });

    test('does not show success message on initial render', async ({ page }) => {
        await expect(page.getByText('Check your email for the reset link')).not.toBeVisible();
    });
});

test.describe('/forgot-password — validation and submission', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/forgot-password');
    });

    test('shows error for empty email submit', async ({ page }) => {
        await page.getByRole('button', { name: /Send Reset Link/i }).click();
        await expect(page.getByText('Invalid email address')).toBeVisible();
    });


    test('hides form after successful submission', async ({ page }) => {
        await page.route('**/forgot-password', async (route) => {
            if (route.request().method() === 'POST') {
                await route.fulfill({ status: 200, contentType: 'text/x-component', body: '1:{"success":true}' });
            } else {
                await route.continue();
            }
        });

        await page.getByPlaceholder('you@example.com').fill('user@example.com');
        await page.getByRole('button', { name: /Send Reset Link/i }).click();

        await expect(page.getByRole('button', { name: /Send Reset Link/i })).not.toBeVisible({ timeout: 8000 });
    });

    test('shows Sending… loading state during submission', async ({ page }) => {
        await page.route('**/forgot-password', async (route) => {
            if (route.request().method() === 'POST') {
                await new Promise(r => setTimeout(r, 300));
                await route.fulfill({ status: 200, contentType: 'text/x-component', body: '1:{"success":true}' });
            } else {
                await route.continue();
            }
        });

        await page.getByPlaceholder('you@example.com').fill('user@example.com');
        await page.getByRole('button', { name: /Send Reset Link/i }).click();
        await expect(page.getByRole('button', { name: /Sending/i })).toBeVisible();
    });

    test('Back to Login link navigates to /login', async ({ page }) => {
        await page.getByRole('link', { name: 'Back to Login' }).click();
        await page.waitForURL('**/login');
        await expect(page).toHaveURL(/\/login/);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. RESET PASSWORD PAGE  /reset-password
// ─────────────────────────────────────────────────────────────────────────────

test.describe('/reset-password — token guard', () => {
    test('redirects to /forgot-password when no token in URL', async ({ page }) => {
        await page.goto('/reset-password');
        await page.waitForURL('**/forgot-password', { timeout: 8000 });
        await expect(page).toHaveURL(/forgot-password/);
    });
});

test.describe('/reset-password — rendering', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(RESET_URL);
    });

    test('displays the Reset Password heading', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Reset Password' })).toBeVisible();
    });

    test('displays the subtitle', async ({ page }) => {
        await expect(page.getByText('Enter your new password below')).toBeVisible();
    });

    test('renders two password inputs', async ({ page }) => {
        const inputs = page.locator('input[type="password"]');
        await expect(inputs).toHaveCount(2);
    });

    test('renders Reset Password submit button', async ({ page }) => {
        await expect(page.getByRole('button', { name: /Reset Password/i })).toBeVisible();
    });

    test('does not show success state on initial render', async ({ page }) => {
        await expect(page.getByText('Your password has been reset successfully!')).not.toBeVisible();
        await expect(page.getByRole('button', { name: /Go to Login/i })).not.toBeVisible();
    });
});

test.describe('/reset-password — client-side validation', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(RESET_URL);
    });

    test('shows error for empty password on submit', async ({ page }) => {
        await page.getByRole('button', { name: /Reset Password/i }).click();
        await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
    });

    test('shows error for password shorter than 8 characters', async ({ page }) => {
        await page.locator('input[type="password"]').nth(0).fill('short');
        await page.getByRole('button', { name: /Reset Password/i }).click();
        await expect(page.getByText('Password must be at least 8 characters')).toBeVisible();
    });

    test('shows error when passwords do not match', async ({ page }) => {
        await page.locator('input[type="password"]').nth(0).fill('newpassword123');
        await page.locator('input[type="password"]').nth(1).fill('differentpass456');
        await page.getByRole('button', { name: /Reset Password/i }).click();
        await expect(page.getByText('Passwords do not match')).toBeVisible();
    });

    test('accepts exactly 8 character password with matching confirm', async ({ page }) => {
        await page.route('**/reset-password**', async (route) => {
            if (route.request().method() === 'POST') {
                await route.fulfill({ status: 200, contentType: 'text/x-component', body: '1:{"success":true}' });
            } else {
                await route.continue();
            }
        });

        await page.locator('input[type="password"]').nth(0).fill('12345678');
        await page.locator('input[type="password"]').nth(1).fill('12345678');
        await page.getByRole('button', { name: /Reset Password/i }).click();
        await expect(page.getByText('Password must be at least 8 characters')).not.toBeVisible();
        await expect(page.getByText('Passwords do not match')).not.toBeVisible();
    });
});

test.describe('/reset-password — success state', () => {
    const mockResetSuccess = async (page: any) => {
        await page.route('**/reset-password**', async (route: any) => {
            if (route.request().method() === 'POST') {
                await route.fulfill({ status: 200, contentType: 'text/x-component', body: '1:{"success":true}' });
            } else {
                await route.continue();
            }
        });
    };

    const submitValidReset = async (page: any) => {
        await page.locator('input[type="password"]').nth(0).fill('newpassword123');
        await page.locator('input[type="password"]').nth(1).fill('newpassword123');
        await page.getByRole('button', { name: /Reset Password/i }).click();
    };

    test('hides the form after successful reset', async ({ page }) => {
        await mockResetSuccess(page);
        await page.goto(RESET_URL);
        await submitValidReset(page);
        await expect(page.getByRole('button', { name: /Reset Password/i })).not.toBeVisible({ timeout: 8000 });
    });

    test('shows Resetting… loading state during submission', async ({ page }) => {
        await page.route('**/reset-password**', async (route) => {
            if (route.request().method() === 'POST') {
                await new Promise(r => setTimeout(r, 300));
                await route.fulfill({ status: 200, contentType: 'text/x-component', body: '1:{"success":true}' });
            } else {
                await route.continue();
            }
        });

        await page.goto(RESET_URL);
        await submitValidReset(page);
        await expect(page.getByRole('button', { name: /Resetting/i })).toBeVisible();
    });
});