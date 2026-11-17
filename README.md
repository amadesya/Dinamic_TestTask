# Product Catalog

Тестового задание на позицию Frontend-разработчика. Каталог товаров с поиском, фильтрацией, пагинацией и избранным с DummyJSON. 

## Реализовано

- Каталог товаров
- Поиск по названию с debounce 400 мс 
- Фильтрация по категориям и датам обновления.
- Сортировка по цене, скидке, рейтингу и названию (убыванию\возрастанию)
- Бесконечная пагинация по 12 товаров через IntersectionObserver
- Сохранение фильтров с поддержкой истории браузера
- Страница товара с характеристиками, отзывами и возвратом к каталогу
- Избранное в localStorage
- Состояния загрузки

## Технологии

- React 19, TypeScript
- Vite 8
- Redux Toolkit 2, RTK Query
- React Router 7
- SCSS Modules
- Oxlint

## Запуск проекта

Требования к окружению: Node.js 18+ и npm 9+.

```bash
git clone https://github.com/amadesya/Dinamic_TestTask.git
cd Dinamic_TestTask/product-catalog
npm install
npm run dev
```

## Структура проекта

- `src/api` — RTK Query
- `src/app` — конфигурация Redux store и хуки.
- `src/components` — UI-компоненты
- `src/features` — клиентская логика состояния, где реализовано избранное с localStorage, хук синхронизации URL useCatalogFilters.
- `src/pages` — страницы приложения
- `src/router` — маршрутизация
- `src/styles` — стили
- `src/types` — модели данных и типы параметров запросов
- `src/utils` — модули расчета скидок

## API

Приложение использует REST API DummyJSON 
Ссылка: https://dummyjson.com/docs/products

Endpoints:
- GET /products — список товаров
- GET /products/:id — данные товара по ID
- GET /products/search — поиск товаров
- GET /products/categories и GET /products/category-list — список категорий
- GET /products/category/:category — товары выбранной категории
- POST /products/add, PUT /products/:id, PATCH /products/:id, DELETE /products/:id — изменение данных

Изменение данных не сохраняются в базе данных.
