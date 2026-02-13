# Changelog

## v0.3.1-beta.1 (2026-02-13)

### Bug Fixes
- **history**: Show only user's own orders instead of all orders (#126)
- **history**: Wire up rating field from API to history cards (#127)
- **customer**: Redirect to review page after completing order (#128)
- **history**: Clarify feedback form condition and guard user ID (#129)
- **history**: Add reviews link to history page for better discoverability (#130)
- **reviews**: Add `mine` filter to show user's own reviews (#131)
- **taken**: Show past completed orders for executor (#132)
- **orders**: Remove active-only filter from `useTakenOrders` (#133)

### Tests
- Add rating field mapping tests for `mapOrder`
- Add `mine` param test for `getReviews`
- Update `useTakenOrders` assertion to match removed status filter

## v0.3.0-alpha.1 (2026-02-12)

### Features
- **CI Pipeline:** GitHub Actions CI with parallel lint, typecheck, unit tests, E2E tests, and build verification on every PR
- **Deploy Pipeline:** Automated Docker build, push to GHCR, and deploy to VPS on tag push
- **Quality Gate:** Lint, typecheck, and unit tests run before deploy to prevent broken releases
- **Security Scan:** Trivy scans Docker images for CRITICAL vulnerabilities before deploy
- **Deploy Notifications:** Telegram bot sends success/failure notifications after each deploy and CI run
- **Rollback Workflow:** Manual rollback to any previous version via GitHub Actions UI
- **Dependabot:** Automatic weekly PRs for npm and GitHub Actions dependency updates
- **PR Template:** Standardized pull request template
- **npm audit:** Dependency vulnerability check during CI install step
- **Branch Protection:** Ruleset on main requiring PR + passing CI Build check + no force push

### Fixes
- E2E tests now use production build in CI instead of dev server
- Concurrency group uses `head_ref` for proper PR run cancellation
- Docker compose image path updated for new GitHub org
- Lowercase Docker image reference for GHCR compatibility
- Trivy severity scoped to CRITICAL only (base image HIGH CVEs excluded)
- Deploy job references `production` environment for secrets access
- Dockerfile `mkdir -p /app/public` for projects without public dir

### Dependencies
- `actions/setup-node` v4 → v6
- `actions/cache` v4 → v5
- `actions/upload-artifact` v4 → v6
- `@tanstack/react-query`, `@types/react` minor updates

### Infrastructure
- `.dockerignore` for optimized Docker build context
- Dockerfile accepts `NEXT_PUBLIC_*` build args for proper env inlining
- Production `docker-compose.prod.yml` with health check, log rotation, restart policy
- Repository transferred to Horny-Pony-Studio organization

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
