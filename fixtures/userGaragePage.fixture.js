import { test as base } from '@playwright/test';
import GaragePage from '../poms/pages/GaragePage';

export const test = base.extend({
    userGaragePage: async ({ browser, baseURL }, use) => {
        const context = await browser.newContext({
            storageState: 'storage-state.json'
        });

        const page = await context.newPage();
        await page.goto(`${baseURL}/panel/garage`);
        const garagePage = new GaragePage(page);

        await use(garagePage);

        await garagePage.removeAddedCar();
    }
});

export { expect } from '@playwright/test';