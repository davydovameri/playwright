import { test, expect } from '../fixtures/userGaragePage.fixture';

test('should add a car', async ({ userGaragePage }) => {
    await userGaragePage.openAddCarModal();
    await userGaragePage.selectCarBrand('BMW');
    await userGaragePage.selectCarModel('5');
    await userGaragePage.fillMileage('30000');
    await userGaragePage.clickAddButton();

    await expect(userGaragePage.selectors.carCardCarName).toHaveText('BMW 5');
});
