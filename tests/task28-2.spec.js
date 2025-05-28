import { test, expect } from '@playwright/test';

test.describe('car POST requests', () => {
    test('should create car with valid data and then delete', async ({ page }) => {
        const response = await page.request.post('https://qauto.forstudy.space/api/cars', {
            data: {
                carBrandId: 1,
                carModelId: 1,
                mileage: 122
            }
        });

        expect(response.status()).toBe(201);

        const createdCar = await response.json();
        const carId = createdCar.data.id;

        const deleteResponse = await page.request.delete(`https://qauto.forstudy.space/api/cars/${carId}`);
        expect(deleteResponse.status()).toBe(200);
    });

    test('should not create car without car id', async ({ page }) => {
        const response = await page.request.post('https://qauto.forstudy.space/api/cars', {
            data: {
                carModelId: 1,
                mileage: 122
            }
        });

        expect(response.status()).toBe(400);
    });

    test('should not create car at another endpoint', async ({ page }) => {
        const response = await page.request.post('https://qauto.forstudy.space/api/car', {
            data: {
                carBrandId: 1,
                carModelId: 1,
                mileage: 122
            }
        });

        expect(response.status()).toBe(404);
    });
});