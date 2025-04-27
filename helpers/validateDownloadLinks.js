import { expect } from '@playwright/test';

export async function validateDownloadLinks(instructionsPage, brand, model) {
    const maxPages = 10;
    let pagesChecked = 0;

    const noInstructionsMessage = instructionsPage.page.locator('text=No instructions was found for this model');
    if (await noInstructionsMessage.isVisible()) {
        console.log(`No instructions for ${brand} ${model}. Skipping.`);
        return;
    }

    while (true) {
        const items = await instructionsPage.selectors.items.all();

        for (const item of items) {
            if (!(await item.isVisible())) continue;

            const descriptionLocator = instructionsPage.getItemDescription(item);
            if (!(await descriptionLocator.isVisible())) continue;

            const description = await descriptionLocator.textContent();

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

        pagesChecked++;
        if (pagesChecked >= maxPages) {
            console.warn(`Max pages (${maxPages}) reached. Possible endless pagination for ${brand} ${model}.`);
            break;
        }

        await instructionsPage.clickNext();
    }

}