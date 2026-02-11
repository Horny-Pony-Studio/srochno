# Changelog

## v0.1.0-beta.6 (2026-02-11)

### Features
- **payments**: Crypto Bot payment integration (fiat RUB invoices, testnet)
  - Payment API types and client functions (`createInvoice`, `getPaymentStatus`)
  - `usePayment` hook with state machine (idle → creating → awaiting_payment → paid/error/expired)
  - Profile recharge flow opens Crypto Bot mini app, polls for confirmation, shows toast on result
- **customer**: Add "Respond" and "Complete" action buttons for order management
- **api**: Add `respondToOrder` and `completeOrder` API functions

### Chores
- Remove unused mock orders data

### Backend (applied separately)
- `aiocryptopay` integration with fiat RUB invoices
- `PaymentInvoice` model + Alembic migration
- 3 new endpoints: `POST /create-invoice`, `GET /payment/{id}/status`, `POST /webhook/crypto-bot`
- HMAC-SHA256 webhook verification, idempotent payment processing

## v0.1.0-beta.5 (2026-02-11)

### Fixes
- **orders**: Invalidate taken orders list after taking an order (`useTakeOrder.onSuccess`)

### Performance
- **history**: Wrap `HistoryCard` in `React.memo` to reduce unnecessary re-renders

### Accessibility
- Add `aria-label="Закрыть"` to Toast close button
- Add `aria-label="Профиль"` to AppNavbar profile button
- Add `role="button"` + `tabIndex={0}` to `OrderCard`, `HistoryCard`, and role-selection blocks

### UX
- Add loading skeletons (`loading.tsx`) for `/customer`, `/executor`, `/create-order`, `/taken`, `/reviews`

### Chores
- Remove unused Next.js template assets (`next.svg`, `vercel.svg`, `globe.svg`, `file.svg`, `window.svg`)

## v0.1.0-beta.4

### Fixes
- **app**: Fix html `lang` attribute from "uk" to "ru" to match Russian UI content
- **providers**: Remove all debug `console.log/warn/error` from TelegramProvider and AuthProvider
- **forms**: Remove debug `console.error` from OrderForm — error handling delegated to caller

## v0.1.0-beta.3

### Fixes
- **orders**: Remove strict contact format validation — allow any format (phone, Telegram, Viber, etc.) (PR #73)
- **orders**: Show contextual main button label instead of generic "Недоступно" (PR #72)
- **e2e**: Update tests to match actual UI behavior (PR #69)

### Refactoring
- **i18n**: Translate remaining Ukrainian UI strings to Russian (PR #70)
- **i18n**: Translate remaining Ukrainian strings to Russian v2 (PR #71)

### Tests
- **orders**: Update contact validation tests for free-format input
- **i18n**: Update review schema tests for Russian complaint reasons
