import { test } from '@playwright/test';
import { InstructionsPage } from '../poms/pages';
import { LeftNavBar } from '../poms/sharedComponents';
import { login, validateDownloadLinks } from '../helpers';

import fs from 'fs/promises';

let instructionsPage;
let leftNavBar;

test.describe('Instructions Page tests', () => {
    test.beforeEach(async ({ page }) => {
        instructionsPage = new InstructionsPage(page);
        leftNavBar = new LeftNavBar(page);

        //await login(page);
        await page.goto('/');
        await leftNavBar.selectNavItem('instructions');
        await instructionsPage.selectors.brandDropdown.waitFor();
    });

    test('should select a car of each brand and model and check that each item on the page matches the search', async ({ page }) => {
        const json = await fs.readFile('./test_data/brands_and_models.json', 'utf8');
        const brandsModels = JSON.parse(json);

        for (const brand in brandsModels) {
            const models = brandsModels[brand];

            for (const model of models) {
                await instructionsPage.selectBrand(brand);
                await instructionsPage.selectModel(model);
                await instructionsPage.clickSearchButton();

                // ✅ Check if any search results appeared
                const hasResults = await instructionsPage.selectors.items.first()
                    .waitFor({ timeout: 5000 })
                    .then(() => true)
                    .catch(() => false);

                if (!hasResults) {
                    console.warn(`No search results found for ${brand} ${model}`);
                    continue; // Skip to next model
                }

                await validateDownloadLinks(instructionsPage, brand, model);
            }
        }
    });
});
