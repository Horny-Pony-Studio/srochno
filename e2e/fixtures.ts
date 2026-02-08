import { test as base, type Page } from '@playwright/test';

// ─── Telegram SDK stub ──────────────────────────────────

// Fake initData query string — AuthProvider reads initData.raw() which the SDK
// populates from the "tgWebAppData" key inside the launch-params query string.
// We store a full launch-params string in localStorage under "launchParams" so
// that @telegram-apps/sdk's init() + initData.restore() picks it up.
const FAKE_INIT_DATA = 'user=%7B%22id%22%3A1%2C%22first_name%22%3A%22Test%22%7D&auth_date=1700000000&hash=abc123&signature=test_sig';

const TELEGRAM_INIT_SCRIPT = `
  // Stub minimal Telegram WebApp environment so the SDK doesn't crash
  window.__TELEGRAM_MOCK__ = true;

  // Provide TelegramWebviewProxy so the SDK's init() doesn't throw
  window.TelegramWebviewProxy = {
    postEvent: function() {}
  };

  // Provide launch params so @telegram-apps/sdk init() succeeds and
  // initData.raw() returns a non-empty string for AuthProvider.
  // The SDK stores/reads launch params in sessionStorage under "tapps/<key>" with JSON.stringify.
  try {
    var initData = '${FAKE_INIT_DATA}';
    var lp = 'tgWebAppPlatform=web&tgWebAppVersion=7.0&tgWebAppThemeParams=' + encodeURIComponent('{}') + '&tgWebAppData=' + encodeURIComponent(initData);
    sessionStorage.setItem('tapps/launchParams', JSON.stringify(lp));
  } catch(e) {}
`;

// ─── Mock API responses ─────────────────────────────────

const MOCK_USER = {
  id: 1,
  first_name: 'Тест',
  last_name: 'Юзер',
  username: 'testuser',
  completed_orders: 5,
  active_orders: 1,
  rating: 4.5,
  balance: 500,
};

const MOCK_ORDER = {
  id: 'order-1',
  category: 'Сантехника',
  description: 'Нужен сантехник срочно, район Центральный',
  city: 'Москва',
  contact: '@testuser',
  created_at: new Date().toISOString(),
  expires_in_minutes: 60,
  status: 'active' as const,
  taken_by: [],
  customer_responded_at: null,
  city_locked: false,
};

const MOCK_EXPIRED_ORDER = {
  ...MOCK_ORDER,
  id: 'order-expired',
  created_at: new Date(Date.now() - 61 * 60_000).toISOString(),
  status: 'expired' as const,
  taken_by: [{ executor_id: 42, taken_at: new Date(Date.now() - 50 * 60_000).toISOString() }],
};

// ─── Setup helper ───────────────────────────────────────

async function setupMocks(page: Page) {
  // Inject Telegram SDK stub before any page scripts load
  await page.addInitScript(TELEGRAM_INIT_SCRIPT);

  // Mock auth endpoint
  await page.route('**/api/users/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(MOCK_USER) }),
  );

  // Mock orders list
  await page.route('**/api/orders', (route) => {
    if (route.request().method() === 'POST') {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ...MOCK_ORDER, id: 'order-new' }),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ orders: [MOCK_ORDER, MOCK_EXPIRED_ORDER], total: 2 }),
    });
  });

  // Mock single order
  await page.route('**/api/orders/*', (route) => {
    const url = route.request().url();
    if (url.includes('order-expired')) {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(MOCK_EXPIRED_ORDER),
      });
    }
    return route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(MOCK_ORDER),
    });
  });

  // Mock balance recharge
  await page.route('**/api/balance/recharge', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, new_balance: 600, transaction_id: 1 }),
    }),
  );

  // Mock reviews
  await page.route('**/api/reviews/client', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, review_id: 1 }),
    }),
  );

  await page.route('**/api/reviews/executor', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, complaint_id: 1 }),
    }),
  );

  await page.route('**/api/reviews', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    }),
  );
}

// ─── Custom test fixture ────────────────────────────────

export const test = base.extend<{ mockPage: Page }>({
  mockPage: async ({ page }, use) => {
    await setupMocks(page);
    await use(page);
  },
});

export { expect } from '@playwright/test';
export { MOCK_USER, MOCK_ORDER, MOCK_EXPIRED_ORDER };
