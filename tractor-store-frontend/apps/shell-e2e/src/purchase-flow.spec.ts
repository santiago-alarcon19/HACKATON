import { test, expect } from '@playwright/test';

test.describe('Tractor Store purchase flow', () => {
  test('browse home, open product, add to cart, checkout', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /built for the field/i })).toBeVisible({
      timeout: 30_000,
    });

    await page.getByRole('button', { name: /view details/i }).first().click();
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    await page.getByRole('button', { name: /add to cart/i }).click();
    await expect(page.getByText(/added to cart/i)).toBeVisible();

    await page.goto('/checkout');
    await expect(page.getByRole('heading', { name: /your cart/i })).toBeVisible();

    await page.getByLabel(/email/i).fill('demo@tractor.store');
    await page.getByLabel(/full name/i).fill('Demo User');
    await page.getByLabel(/^address/i).fill('1 Field Lane');
    await page.getByLabel(/city/i).fill('Farmville');
    await page.getByLabel(/postal/i).fill('12345');

    await page.getByRole('button', { name: /place order/i }).click();
    await expect(page.getByRole('heading', { name: /thank you/i })).toBeVisible({
      timeout: 15_000,
    });
  });
});
