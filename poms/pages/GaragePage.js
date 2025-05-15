import { BasePage } from '../basePom';

export default class GaragePage extends BasePage {

    constructor(page) {
        super(page, '/panel/garage');
    }

    selectors = {
        garagePageAddCarButton: this.page.locator('button:has-text("Add car")'), addCarFormBrandDropdown: this.page.locator('#addCarBrand'),
        addCarFormModelDropdown: this.page.locator('#addCarModel'),
        addCarFormMileageInput: this.page.locator('#addCarMileage'),
        addCarFormAddButton: this.page.getByRole('button', { name: 'Add' }),
        carCardCarName: this.page.locator('p.car_name.h2'),
        carCardEditButton: this.page.locator('button.car_edit.btn.btn-edit'),
        carCardRemoveButton: this.page.locator('button.btn-outline-danger:has-text("Remove car")'),
        carCardRemoveConfirmButton: this.page.locator('button.btn-danger:has-text("Remove")')

    }

    async openAddCarModal() {
        await this.selectors.garagePageAddCarButton.click();
    }

    async selectCarBrand(brandName) {
        await this.selectors.addCarFormBrandDropdown.selectOption({ label: brandName });
    }

    async selectCarModel(modelName) {
        await this.selectors.addCarFormModelDropdown.selectOption({ label: modelName });
    }

    async fillMileage(mileage) {
        await this.selectors.addCarFormMileageInput.fill(mileage);
    }

    async clickAddButton() {
        await this.selectors.addCarFormAddButton.click();
    }

    async removeAddedCar() {
        await this.selectors.carCardEditButton.click();
        await this.selectors.carCardRemoveButton.click();
        await this.selectors.carCardRemoveConfirmButton.click();
    }
}