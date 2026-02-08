import { test, expect, MOCK_USER } from './fixtures';

test.describe('Profile page', () => {
  test.beforeEach(async ({ mockPage: page }) => {
    await page.goto('/');
    await page.evaluate(() => localStorage.setItem('user_role', 'executor'));
  });

  test('displays user info from API', async ({ mockPage: page }) => {
    await page.goto('/profile');

    await expect(page.getByText('Тест Юзер')).toBeVisible();
    await expect(page.getByText('@testuser')).toBeVisible();
    await expect(page.getByText(String(MOCK_USER.completed_orders), { exact: true })).toBeVisible();
    await expect(page.getByText(String(MOCK_USER.rating), { exact: true })).toBeVisible();
  });

  test('displays balance', async ({ mockPage: page }) => {
    await page.goto('/profile');

    await expect(page.getByText(`${MOCK_USER.balance} ₽`)).toBeVisible();
  });

  test('shows recharge buttons', async ({ mockPage: page }) => {
    await page.goto('/profile');

    await expect(page.getByText('100 ₽')).toBeVisible();
    await expect(page.getByText('300 ₽')).toBeVisible();
    await expect(page.getByText('1000 ₽')).toBeVisible();
    await expect(page.getByText('3000 ₽')).toBeVisible();
  });

  test('recharge button triggers API call', async ({ mockPage: page }) => {
    await page.goto('/profile');

    // Intercept the recharge request to verify it's called
    const rechargePromise = page.waitForRequest('**/api/balance/recharge');
    await page.getByText('100 ₽').click();
    const request = await rechargePromise;
    const body = request.postDataJSON();
    expect(body.amount).toBe(100);
  });

  test('navigation links are visible', async ({ mockPage: page }) => {
    await page.goto('/profile');

    await expect(page.getByText('История заказов')).toBeVisible();
    await expect(page.getByText('Отзывы')).toBeVisible();
    await expect(page.getByText('Сменить роль')).toBeVisible();
  });

  test('"Сменить роль" clears role and navigates to /', async ({ mockPage: page }) => {
    await page.goto('/profile');

    await page.getByText('Сменить роль').click();
    await page.waitForURL('**/');

    const role = await page.evaluate(() => localStorage.getItem('user_role'));
    expect(role).toBeNull();
  });
});
