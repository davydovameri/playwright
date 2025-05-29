import { BasePage } from '../basePom';

export default class InstructionsPage extends BasePage {

    constructor(page) {
        super(page, '/panel/instructions');
    }

    selectors = {
        brandDropdown: this.page.locator('button#brandSelectDropdown'),
        brandOption: (brand) => this.page.locator('//ul[contains(@class, "brand-select-dropdown_menu")]//li', { hasText: brand }),
        modelDropdown: this.page.locator('button#modelSelectDropdown'),
        modelOption: (model) => this.page.locator('//ul[contains(@class, "model-select-dropdown_menu")]//li').filter({ hasText: new RegExp(`^${model}$`) }),
        searchButton: this.page.locator('button', { hasText: 'Search' }),
        items: this.page.locator('//ul[contains(@class, "instructions_list")]/li'),
        nextButton: this.page.locator('.instructions a[aria-label="Next"]')
    }

    async selectBrand(brand) {
        await this.selectors.brandDropdown.click();
        const option = this.selectors.brandOption(brand);
        await option.evaluate(el => el.classList.remove('disabled'));
        await option.click();
    }

    async selectModel(model) {
        await this.selectors.modelDropdown.click();
        const option2 = this.selectors.modelOption(model);
        await option2.evaluate(el => el.classList.remove('disabled'));
        await this.page.waitForSelector('.model-select-dropdown_menu.dropdown-menu.show', { state: 'visible' });
        await option2.scrollIntoViewIfNeeded();
        await this.page.waitForTimeout(300);
        await option2.click({ force: true });
    }

    async clickSearchButton() {
        await this.selectors.searchButton.click();
    }

    getItemDescription(item) {
        return item.locator('//p[contains(@class, "instruction-link_description")]');
    }

    getDownloadLink(item) {
        return item.locator('//a[contains(@class, "instruction-link_download")]');
    }

    async isNextDisabled() {
        const parentLi = this.selectors.nextButton.locator('xpath=..');
        const classAttr = await parentLi.getAttribute('class');
        return classAttr?.includes('disabled');
    }

    async clickNext() {
        const nextButton = this.selectors.nextButton;

        if (await nextButton.count() === 0) {
            console.log('No Next button in DOM — probably last page.');
            return;
        }

        try {
            await nextButton.waitFor({ state: 'attached', timeout: 15000 });

            const ariaDisabled = await nextButton.getAttribute('aria-disabled');
            if (ariaDisabled === 'true') {
                console.log('Next button is disabled.');
                return;
            }

            await nextButton.scrollIntoViewIfNeeded();
            await nextButton.waitFor({ state: 'visible', timeout: 5000 });

            const hasPointerEvents = await nextButton.evaluate((el) => {
                return window.getComputedStyle(el).pointerEvents !== 'none';
            });

            if (!hasPointerEvents) {
                console.warn('Next button is not receiving pointer events.');
                return;
            }

            for (let i = 0; i < 3; i++) {
                try {
                    await nextButton.click({ trial: true });
                    await nextButton.click();
                    console.log('Next button clicked successfully.');
                    await this.page.waitForTimeout(1000);
                    return;
                } catch (error) {
                    console.log(`Retrying click... (${i + 1})`);
                    await this.page.waitForTimeout(500);
                }
            }

            throw new Error('Next button could not be clicked after retries.');
        } catch (err) {
            console.warn('Next button exists but could not be clicked or was not visible.');

            // 👉 Take a screenshot for debugging
            await this.page.screenshot({ path: 'next-button-error.png', fullPage: true });

            throw err;
        }
    }


}