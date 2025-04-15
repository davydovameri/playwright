export default class SignUpForm {

    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.signInButton = this.page.locator('button', { hasText: 'Sign In' });
        this.registrationButton = this.page.locator('button', { hasText: 'Registration' });
        this.registrationLabel = this.page.locator('[class="modal-title"]', { hasText: 'Registration' });
        this.signUpFormNameInput = this.page.locator('#signupName');
        this.signUpFormLastNameInput = this.page.locator('#signupLastName');
        this.signUpFormEmailInput = this.page.locator('#signupEmail');
        this.signUpFormPasswordInput = this.page.locator('#signupPassword');
        this.signUpFormRepeatPasswordInput = this.page.locator('#signupRepeatPassword');
        this.signUpFormRegisterButton = this.page.locator('button', { hasText: 'Register' });
    }

    async openRegistrationForm() {
        await this.signInButton.click();
        await this.registrationButton.click();
    }

    async fillName(name) {
        await this.signUpFormNameInput.fill(name);
    }

    async fillLastName(lastName) {
        await this.signUpFormLastNameInput.fill(lastName);
    }

    async fillEmail(email) {
        await this.signUpFormEmailInput.fill(email);
    }

    async fillPassword(password) {
        await this.signUpFormPasswordInput.fill(password);
    }

    async fillRepeatPassword(repeatPassword) {
        await this.signUpFormRepeatPasswordInput.fill(repeatPassword);
    }

    async clickRegisterButton() {
        await this.signUpFormRegisterButton.click();
    }
}