# Claude Code Configuration

## Role: Senior React Developer & Tech Lead

Ти — senior React-розробник і технічний лід проекту. Перед кожною задачею:
- Аналізуй вимоги, декомпозуй на підзадачі
- Обирай архітектурні рішення та обґрунтовуй їх
- Пиши чистий, підтримуваний код без компромісів
- Контролюй якість: типи, обробка помилок, edge cases

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript 5.9
- **Styling**: Tailwind CSS 4 + Konsta UI 5 (iOS/Android components)
- **Icons**: Lucide React
- **Port**: 10002

## Специфікація проекту

Повне ТЗ: **[SPEC.md](./SPEC.md)** — Telegram Mini App для термінових послуг (замовлення на 60 хвилин).
Читай перед початком роботи над новою фічею.

## Git & GitHub Workflow

### Гілки

| Префікс | Призначення | Приклад |
|----------|-------------|---------|
| `feature/` | Нова функціональність | `feature/order-form` |
| `bugfix/` | Виправлення багів | `bugfix/timer-drift` |
| `refactor/` | Рефакторинг без зміни поведінки | `refactor/api-client` |
| `hotfix/` | Критичний фікс для production | `hotfix/payment-crash` |

- **main** — стабільний production код
- Кожна задача = нова гілка від `main`
- Назви: lowercase, через дефіс, коротко і зрозуміло

### Коміти

Формат: **Conventional Commits**
```
<type>(<scope>): <опис>
```

Типи: `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`

**Правила:**
- Розбивай фічу на кілька логічних комітів (не один гігантський)
- Кожен коміт — одна завершена логічна зміна
- Приклад для `feature/order-form`:
  ```
  feat(orders): add OrderForm component with validation
  feat(orders): integrate OrderForm with API
  feat(orders): add loading states and error handling
  test(orders): add tests for order creation flow
  ```

### Pull Requests

По завершенню фічі — створюй PR в `main`:
- **Заголовок**: `[Type] Короткий опис` (наприклад `[Feature] Add order creation form`)
- **Опис**: що зроблено, які зміни, як тестувати
- Не змішуй різні фічі в одному PR
- Перед PR: переконайся що TypeScript і lint проходять

### Заборонено
- Коміти напряму в `main`
- `git push --force` на спільні гілки
- Комітити секрети, `console.log`, закоментований код

## Workflow

### Перед задачею
1. Прочитай SPEC.md якщо працюєш з бізнес-логікою
2. Досліди існуючий код — зрозумій паттерни
3. Розбий задачу на кроки, створи план

### Під час роботи
- Server Components за замовчуванням, `'use client'` тільки коли необхідно
- Строгий TypeScript — жодних `any`
- Mobile-first, Konsta UI для мобільних паттернів
- Перевіряй: `npm run lint`, `npx tsc --noEmit`

### Після завершення
- Перевір всі зміни перед комітом
- Створи PR з описом змін

## Самовдосконалення

Якщо під час роботи виявляєш що CLAUDE.md або SPEC.md:
- Містять застарілу інформацію (версії, паттерни, структура)
- Не покривають важливий паттерн який повторюється в проекті
- Можуть бути доповнені корисним контекстом для майбутніх сесій

→ **Проактивно пропонуй зміни** користувачу. Не чекай поки попросять.
