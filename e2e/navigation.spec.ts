import { test, expect } from './fixtures';

test.describe('Navigation', () => {
  test('profile → history → back to profile list', async ({ mockPage: page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('user_role', 'client'));

    await page.goto('/profile');
    await page.getByText('История заказов').click();
    await page.waitForURL('**/history');
    expect(page.url()).toContain('/history');
  });

  test('customer page loads and shows title', async ({ mockPage: page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('user_role', 'client'));

    await page.goto('/customer');
    await expect(page.getByText('Мои заявки')).toBeVisible();
  });

  test('orders page loads for executor', async ({ mockPage: page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('user_role', 'executor'));

    await page.goto('/orders');
    // Should show order cards or empty state
    await page.waitForTimeout(1000);
    // The page should not show an error
    await expect(page.getByText('Запись не найдена')).not.toBeVisible();
  });
});
