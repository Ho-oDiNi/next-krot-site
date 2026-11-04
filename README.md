# 1. Инструкция по разворачиванию

## Установи необходимые программы

- Git — оставь стандартные настройки установщика.
- Node.js 24 LTS — вместе с ним установится npm. Оставь включённым добавление в PATH.
- PostgreSQL 18 — в установщике выбери PostgreSQL Server, Command Line Tools и pgAdmin 4.

### После установки открой новое окно CMD и проверь:

git --version
node --version
npm --version

## 2. Установи pnpm версии, указанной в проекте

npm install -g pnpm@10.6.5

## 3. Скачай проект

git clone https://github.com/Ho-oDiNi/next-krot-site.git
cd next-krot-site

### Перейди в ветку dev

git switch dev

## 4. Создай базу через pgAdmin

Открой pgAdmin и подключись к установленному PostgreSQL. Если подключения нет, нажми правой кнопкой на Servers → Register → Server:

## 5. Запроси у меня конфиги

Часть переменных хранится скрыто, запроси у Жени конфиги

## 6. Установи библиотеки

pnpm install --frozen-lockfile

## 7. Создай Prisma Client и таблицы базы

pnpm prisma-generate
pnpm exec dotenv -e ./config/.env.local -e ./config/.env.development -- prisma migrate deploy

## 8. Предварительная настройка завершена

## Обычный запуск после установки

### Запусти сайт

pnpm dev

### Открой локальную среду

http://localhost:3000
