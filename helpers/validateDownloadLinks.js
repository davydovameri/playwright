import { expect } from '@playwright/test';

export async function validateDownloadLinks(instructionsPage, brand, model) {

    while (true) {
        const count = await instructionsPage.selectors.items.count();

        for (let i = 0; i < count; i++) {
            const item = instructionsPage.selectors.items.nth(i);
            const description = await instructionsPage.getItemDescription(item).textContent();

            if (description?.includes(brand) && description?.includes(model)) {
                const downloadLink = instructionsPage.getDownloadLink(item);

                await expect(downloadLink).toBeVisible();
                await expect(downloadLink).toBeEnabled();

                const expectedUrlPattern = new RegExp(`^https://qauto.forstudy.space/public/instructions/${brand.toLowerCase()}/${model.toLowerCase()}/.*${brand} ${model}\\.pdf$`);
                await expect(downloadLink).toHaveAttribute('href', expect.stringMatching(expectedUrlPattern));
            }
        }

        if ((await instructionsPage.selectors.nextButton.count()) === 0 || await instructionsPage.isNextDisabled()) {
            break;
        }

        await instructionsPage.clickNext();
    }
}