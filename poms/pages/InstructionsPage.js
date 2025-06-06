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
        nextButton: this.page.locator('a[aria-label="Next"]')
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
        await option2.click();
    }

    async clickSearchButton() {
        await this.selectors.searchButton.click();
        await this.page.waitForTimeout(1000);
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
        await this.selectors.nextButton.click();
        await this.page.waitForTimeout(1000);
    }
}