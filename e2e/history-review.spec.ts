import { test, expect } from './fixtures';

test.describe('History detail — review/complaint flow', () => {
  test('shows order details on history page', async ({ mockPage: page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('user_role', 'client'));

    await page.goto('/history/order-1');

    await expect(page.getByText('Сантехника')).toBeVisible();
    await expect(page.getByText('Москва')).toBeVisible();
    await expect(page.getByText(/Нужен сантехник/)).toBeVisible();
  });

  test('shows status chip for expired order with takes', async ({ mockPage: page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('user_role', 'client'));

    await page.goto('/history/order-expired');

    await expect(page.getByText('Выполнен')).toBeVisible();
    await expect(page.getByText('Истек')).toBeVisible();
  });

  test('client sees ReviewForm on expired order', async ({ mockPage: page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('user_role', 'client'));

    await page.goto('/history/order-expired');

    await expect(page.getByText('Оставить отзыв')).toBeVisible();
    await expect(page.getByText('Отправить отзыв')).toBeVisible();
  });

  test('executor sees ComplaintForm on expired order', async ({ mockPage: page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('user_role', 'executor'));

    // Override mock so expired order has executor_id matching MOCK_USER.id (1)
    await page.route('**/api/orders/order-expired', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: 'order-expired',
          category: 'Сантехника',
          description: 'Нужен сантехник срочно, район Центральный',
          city: 'Москва',
          contact: '@testuser',
          created_at: new Date(Date.now() - 61 * 60_000).toISOString(),
          expires_in_minutes: 60,
          status: 'expired',
          taken_by: [{ executor_id: 1, taken_at: new Date(Date.now() - 50 * 60_000).toISOString() }],
          customer_responded_at: null,
          city_locked: false,
        }),
      }),
    );

    await page.goto('/history/order-expired');

    await expect(page.getByText('Пожаловаться на клиента')).toBeVisible();
    await expect(page.getByText('Отправить жалобу')).toBeVisible();
  });

  test('active order does not show review/complaint forms', async ({ mockPage: page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('user_role', 'client'));

    await page.goto('/history/order-1');

    await expect(page.getByText('Оставить отзыв')).not.toBeVisible();
  });

  test('shows "Запись не найдена" for invalid order', async ({ mockPage: page }) => {
    // Override mock to return 404 for this specific order
    await page.route('**/api/orders/nonexistent', (route) =>
      route.fulfill({ status: 404, contentType: 'application/json', body: JSON.stringify({ detail: 'Not found' }) }),
    );

    await page.goto('/history/nonexistent');

    await expect(page.getByText('Запись не найдена')).toBeVisible();
  });
});
