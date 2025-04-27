import { BasePage } from '../basePom';

export default class LeftNavBar extends BasePage {
    selectors = {
        // items: garage, expsenses, instructions, profile, settins
        navBarItem: (itemName) => this.page.locator(`nav[class*="sidebar"] a[href="/panel/${itemName}"]`),
        logoutButton: this.page.locator('nav[class*="sidebar"] a', { hasText: 'Log out' }),
    };

    // items: garage, expsenses, instructions, profile, settins
    async selectNavItem(itemName) {
        await this.selectors.navBarItem(itemName).click();
    }

    // items: garage, expsenses, instructions, profile, settins
    async isNavItemSelected(tabName) {
        const navItemClass = await this.selectors.navBarItem(tabName).getAttribute('class');
        return navItemClass.includes('-active');
    }

}