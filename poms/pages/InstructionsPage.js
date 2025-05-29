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
        const nextButton = this.selectors.nextButton;
        if (await nextButton.count() === 0) return true;

        const classAttribute = await nextButton.getAttribute('class');
        const ariaDisabled = await nextButton.getAttribute('aria-disabled');
        return classAttribute?.includes('disabled') || ariaDisabled === 'true';
    }


    async clickNext() {
        const nextButton = this.selectors.nextButton;

        const buttonCount = await nextButton.count();
        if (buttonCount === 0) return; // No next button

        const isDisabled = await this.isNextDisabled();
        if (isDisabled) return; // Next is disabled, don’t click

        const firstItem = await this.selectors.items.first();
        const previousText = await firstItem.textContent();

        await Promise.all([
            nextButton.click(),
            this.page.waitForFunction(
                (oldText) => {
                    const first = document.querySelector('.instructions_list li p.instruction-link_description');
                    return first && first.textContent.trim() !== oldText.trim();
                },
                previousText,
                { timeout: 5000 }
            ).catch(() => {
                console.warn('Next page did not change content in time.');
            })
        ]);
    }


}