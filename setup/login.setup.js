import { test as setup, expect } from '@playwright/test';

const authFile = 'storage-state.json';
const email = process.env.USER_LOGIN;
const password = process.env.USER_PASSWORD;

setup('login before tests', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible();
    await page.getByRole('button', { name: 'Sign In' }).click();
    await page.getByRole('textbox', { name: 'Email' }).fill(email);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Login' }).click();

    await expect(page).toHaveURL(/\/panel\/garage/);

    await page.context().storageState({ path: authFile });
    await page.context().close();
});