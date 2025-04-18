export default class BasePage {
    /**
      * @param {import('@playwright/test').Page} page
      * @param {string} url
      */
    constructor(page, url) {
        this.page = page;
        this.url = url;
    }

    async openPage() {
        if (!this.url) throw new Error('Attempting to navigate to not existing "this.url" in Base class');
        await this.page.goto(this.url);
    }
}