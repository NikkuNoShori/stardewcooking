import { test, expect } from '@playwright/test';

test.describe('app shell', () => {
  test('loads cooking route and shows sidebar', async ({ page }) => {
    await page.goto('/cooking');
    await expect(page.getByRole('navigation').getByText('Cooking')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Cooking' })).toBeVisible();
  });

  test('client-side navigation works', async ({ page }) => {
    await page.goto('/cooking');
    await page.getByRole('navigation').getByRole('button', { name: 'Fish' }).click();
    await expect(page).toHaveURL(/\/fish/);
    await expect(page.getByRole('heading', { name: 'Fish Collection' })).toBeVisible();
  });
});
