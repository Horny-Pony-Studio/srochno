import { test, expect } from './fixtures';

test.describe('Role selection', () => {
  test('shows role selection page', async ({ mockPage: page }) => {
    await page.goto('/');
    await expect(page.getByText('Я заказчик')).toBeVisible();
    await expect(page.getByText('Я исполнитель')).toBeVisible();
  });

  test('clicking "Я заказчик" navigates to /customer', async ({ mockPage: page }) => {
    await page.goto('/');
    await page.getByText('Я заказчик').click();
    await page.waitForURL('**/customer');
    expect(page.url()).toContain('/customer');
  });

  test('clicking "Я исполнитель" navigates to /orders', async ({ mockPage: page }) => {
    await page.goto('/');
    await page.getByText('Я исполнитель').click();
    await page.waitForURL('**/orders');
    expect(page.url()).toContain('/orders');
  });

  test('persisted client role auto-redirects to /customer', async ({ mockPage: page }) => {
    // Set role in localStorage before navigating
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('user_role', 'client'));
    await page.goto('/');
    await page.waitForURL('**/customer');
    expect(page.url()).toContain('/customer');
  });

  test('persisted executor role auto-redirects to /orders', async ({ mockPage: page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('user_role', 'executor'));
    await page.goto('/');
    await page.waitForURL('**/orders');
    expect(page.url()).toContain('/orders');
  });
});
