# Срочно

Telegram Mini App для срочных услуг — заказы выполняются за 60 минут.

## Стек

- **Next.js 16** (App Router) + **React 19** + **TypeScript 5.9**
- **Tailwind CSS 4** + **Konsta UI 5** (iOS/Android компоненты)
- **Lucide React** (иконки)
- **TanStack React Query** (data fetching)
- **React Hook Form** + **Zod** (формы и валидация)

## Быстрый старт

```bash
# Установить зависимости
npm install

# Скопировать переменные окружения
cp .env.example .env.local

# Запустить dev-сервер (порт 10002)
npm run dev
```

Открыть [http://localhost:10002](http://localhost:10002).

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run dev` | Dev-сервер на порту 10002 |
| `npm run build` | Production-сборка |
| `npm run start` | Production-сервер |
| `npm run lint` | ESLint |
| `npm test` | Unit-тесты (Vitest) |
| `npm run test:watch` | Тесты в watch-режиме |
| `npm run test:e2e` | E2E-тесты (Playwright) |

## Структура проекта

```
app/                  # Next.js страницы (App Router)
src/
  components/         # UI-компоненты
    forms/            # Компоненты форм
    modals/           # Модальные окна
  hooks/              # Custom React hooks
  lib/                # Утилиты, API-клиент, валидация
  providers/          # Context providers
  models/             # Доменные модели
  types/              # TypeScript типы
  data/               # Статические данные (категории, города)
  utils/              # Хелперы
e2e/                  # E2E тесты (Playwright)
```

## Переменные окружения

См. [`.env.example`](.env.example) для списка переменных.
