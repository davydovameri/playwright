import { test, expect } from '@playwright/test';
import fs from 'fs';

test('should fake response', async ({ page }) => {

    await page.route('**/api/users/profile', async route => {
        const response = await route.fetch();
        const json = await response.json();

        json.data = {
            photoFilename: 'test-Stitch.webp',
            name: 'mariia2',
            lastName: 'davydova2',
            dateBirth: '2010-10-10T00:00:00.000Z',
            country: 'not Ukraine'
        };

        await route.fulfill({ response, json });
    });

    await page.route('**/test-Stitch.webp', async route => {
        const imageSrc = fs.readFileSync('test_data/img/test-Stitch.webp');
        await route.fulfill({
            contentType: 'image/webp',
            body: imageSrc
        });
    });

    await page.goto('https://qauto.forstudy.space/panel/profile');

    await expect(page.locator('p.profile_name')).toHaveText('mariia2 davydova2');
    await expect(page.locator('li:has(.icon-birthday) .profile-info_text')).toHaveText('10.10.2010');
    await expect(page.locator('li:has(.icon-country) .profile-info_text')).toHaveText('not Ukraine');
    expect(await page.locator('img.profile_photo').getAttribute('src')).toContain('test-Stitch.webp');
});