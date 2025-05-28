import { test, expect } from '../fixtures/userGaragePage.fixture';

test('should add a car', async ({ userGaragePage }) => {
    await userGaragePage.openAddCarModal();
    await userGaragePage.selectCarBrand('BMW');
    await userGaragePage.selectCarModel('5');
    await userGaragePage.fillMileage('30000');
    await userGaragePage.clickAddButton();

    const carName = userGaragePage.selectors.carCardCarName.filter({ hasText: 'BMW 5' });
    await expect(carName).toHaveText('BMW 5');
});
