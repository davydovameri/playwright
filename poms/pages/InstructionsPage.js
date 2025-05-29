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

        // Wait for dropdown menu to appear
        await this.page.waitForSelector('.model-select-dropdown_menu.dropdown-menu.show', {
            state: 'visible',
            timeout: 5000
        });

        // Get a fresh locator — avoids "element is not attached" errors
        const freshOption = this.page
            .locator('.model-select-dropdown_menu.dropdown-menu.show li')
            .filter({ hasText: new RegExp(`^${model}$`) });

        // Make sure it's attached and visible
        await freshOption.waitFor({ state: 'visible', timeout: 5000 });

        // Remove 'disabled' class if necessary
        await freshOption.evaluate(el => el.classList.remove('disabled'));

        // Safe scroll into view
        await freshOption.scrollIntoViewIfNeeded();

        // Brief wait to stabilize UI
        await this.page.waitForTimeout(300);

        // Click with force to bypass any minor overlays
        await freshOption.click({ force: true });
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
        const nextBtn = this.nextButton;
        if (!await nextBtn.isVisible()) return true;
        const disabledAttr = await nextBtn.getAttribute('aria-disabled');
        return disabledAttr === 'true';
    }



    async clickNext() {
        await this.page.waitForSelector('.instructions a[aria-label="Next"]', { state: 'attached', timeout: 5000 });

        let nextButton = this.selectors.nextButton;

        // Wait until the button is not covered by any overlay
        await this.page.waitForFunction(() => {
            const el = document.querySelector('.instructions a[aria-label="Next"]');
            if (!el) return false;
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const topEl = document.elementFromPoint(centerX, centerY);
            return el.contains(topEl);
        }, null, { timeout: 5000 });

        const isDisabled = await this.isNextDisabled();
        if (isDisabled) return;

        const firstItem = await this.selectors.items.first();
        const oldText = await firstItem.textContent();

        // Re-fetch nextButton to avoid detachment
        nextButton = this.selectors.nextButton;

        await Promise.all([
            nextButton.click(),
            this.page.waitForFunction(
                (prev) => {
                    const first = document.querySelector('.instructions_list li p.instruction-link_description');
                    return first && first.textContent.trim() !== prev.trim();
                },
                oldText,
                { timeout: 8000 }
            )
        ]);
    }



}