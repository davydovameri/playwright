import { expect } from '@playwright/test';

export async function showErrorMessage(input, isInvalid = true, errorMessage) {
    await input.focus();
    await input.blur();

    const nextSibling = input.locator('xpath=following-sibling::*[1]');

    if (isInvalid) {
        await expect(input).toHaveClass(/is-invalid/);
        await expect(nextSibling).toBeVisible();
        await expect(nextSibling).toHaveText(errorMessage);
    } else {
        await expect(input).not.toHaveClass(/is-invalid/);
        await expect(nextSibling).toHaveCount(0);
    }
}