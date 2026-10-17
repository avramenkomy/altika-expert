# DEVLOG — Экспертное бюро «Альтика»

Журнал разработки коммерческого full-stack сайта экспертно-оценочной компании. Документ фиксирует ключевые архитектурные решения, этапы разработки, проблемы, найденные причины и итоговые решения.

## 1. Цель проекта

Задача проекта — переработать сайт экспертно-оценочной компании и получить современный корпоративный ресурс, который не является статическим лендингом, а управляется через backend.

Основные требования:

- отдельные направления экспертиз, оценки и услуг;
- страницы специалистов и подтверждающих документов;
- формы заявок с сохранением в базе данных;
- уведомления по email и Telegram;
- управление контентом через Django Admin;
- техническая SEO-подготовка;
- staging-домен для согласования с заказчиком;
- deployment на shared hosting REG.RU.

Production-домен: `https://altika-expert.ru`.

Preview: `https://preview-test.site`.

---

## 2. Выбранный стек

### Frontend

```text
React
JavaScript
Vite
React Router
Axios
SCSS
Lucide React
Leaflet / OpenStreetMap
```

### Backend

```text
Python 3.13
Django 6.0
Django REST Framework
Django Admin
MySQL 8
```

### Интеграции и инфраструктура

```text
SMTP
Telegram Bot API
Git / GitHub
Passenger
REG.RU
HTTPS
```

Главная архитектурная идея проекта:

```text
Django Admin
    ↓
MySQL
    ↓
Django / DRF
    ↓
REST API
    ↓
React
```

Контент хранится в базе данных, а React отвечает в основном за представление и пользовательское взаимодействие.

---

## 3. Структура backend

Backend разделён на предметные Django-приложения:

```text
backend/
├── config/
├── company/
├── services/
├── experts/
├── applications/
├── templates/
├── static/
├── staticfiles/
├── media/
├── manage.py
└── requirements.txt
```

### `company`

Содержит основные данные компании и контент главной страницы:

```text
Company
CompanyAdvantage
Expertise
ValuationType
ProcessStep
UseCase
CompanyDocument
SiteSettings
```

Ключевое решение — вынести тексты, изображения, порядок отображения и значительную часть SEO-данных из React в MySQL. Благодаря этому заказчик может менять контент через Django Admin без новой сборки frontend.

`SiteSettings` используется для глобальных параметров сайта и Hero-блока: заголовков, фонового изображения, SEO главной страницы и видимости отдельных секций.

### `services`

Отдельное приложение для дополнительных услуг. Каждая услуга имеет `slug`, краткое и подробное описание, изображение, SEO-поля и, при необходимости, `price_from`.

### `experts`

Архитектура специалистов:

```text
Expert
 ├── ManyToMany → Position
 ├── ManyToMany → Specialization
 └── OneToMany  → ExpertDocument
```

ManyToMany выбран потому, что один специалист может одновременно иметь несколько должностей и несколько экспертных специализаций.

### `applications`

Приложение отвечает за заявки с сайта. Поддерживаются типы:

```text
callback
general
expertise
valuation
service
```

---

## 4. Frontend-архитектура

Упрощённая структура:

```text
frontend/src/
├── api/
├── assets/
├── components/
├── layouts/
├── pages/
├── sections/
├── styles/
├── utils/
├── App.jsx
└── main.jsx
```

Принято разделение на небольшие переиспользуемые `components` и крупные смысловые `sections`.

Примеры компонентов:

```text
Container
Header
Footer
Modal
ApplicationForm
CallbackForm
ExpertiseCard
ValuationCard
ServiceCard
ExpertCard
DocumentCard
ExpertDocumentCard
```

Примеры секций:

```text
Hero
About
Expertises
Valuation
Services
Experts
UseCases
Documents
Contacts
```

Основные маршруты:

```text
/
/expertises/:slug
/valuation/:slug
/services/:slug
/experts/:slug
```

Для неизвестных URL реализована отдельная 404-страница.

---

## 5. API-слой

HTTP-запросы не размещаются непосредственно по всему UI-коду. Для них создан отдельный слой `frontend/src/api/`.

Примеры функций:

```text
getCompany()
getExpertises()
getExpertiseItem()
getValuationTypes()
getValuationItem()
getServices()
getServiceItem()
getExperts()
getExpertItem()
getProcessSteps()
getUseCases()
getCompanyDocuments()
getSiteSettings()
sendApplication()
sendCallback()
```

Схема:

```text
React component
    ↓
API function
    ↓
Axios
    ↓
DRF endpoint
```

На главной странице независимые запросы выполняются параллельно через `Promise.all()`.

---

## 6. Формы и заявки

Формы присутствуют в нескольких местах сайта: Header, Hero, общей CTA-секции, detail-страницах экспертиз, оценки, услуг и специалистов.

Главное решение — использовать одну модель `Application`, а контекст передавать через тип и тему заявки.

Пример:

```text
application_type = expertise
subject = Почерковедческая экспертиза
```

Схема обработки:

```text
React form
    ↓
POST /api/applications/
    ↓
DRF validation
    ↓
Application сохраняется в MySQL
    ↓
Email notification
    ↓
Telegram notification
```

Принцип DB-first выбран намеренно: временный сбой Telegram или SMTP не должен приводить к потере обращения клиента.

Для контроля доставки хранятся признаки:

```text
email_sent
telegram_sent
```

Также настроен throttling. В ходе тестов был подтверждён ответ `429 Too Many Requests`.

---

## 7. Email и Telegram

На раннем этапе email работал через console backend, затем был подключён реальный SMTP.

После downgrade Django обнаружилась несовместимость первоначально использованного mail API. Решение — перейти на стандартные настройки Django:

```text
EMAIL_BACKEND
EMAIL_HOST
EMAIL_PORT
EMAIL_HOST_USER
EMAIL_HOST_PASSWORD
EMAIL_USE_TLS
EMAIL_USE_SSL
```

Telegram реализован через Bot API. В процессе тестирования один раз возникал `ConnectTimeout`, после чего API и реальные формы работали штатно. Этот случай дополнительно подтвердил правильность DB-first архитектуры заявок.

---

## 8. Проблемы DRF и ORM

### Ошибка `tuple has no attribute values`

При разработке API специалистов возникла ошибка:

```text
AttributeError: 'tuple' object has no attribute 'values'
```

Причина была в некорректной структуре `Meta.fields` serializer. После исправления serializer стал корректно формировать вложенные данные.

### Ошибка `prefetch_related`

В queryset специалистов была опечатка в имени связи:

```text
spezializations
```

вместо:

```text
specializations
```

После исправления prefetch связанных данных заработал корректно.

### Процессы экспертизы и оценки

Сначала endpoint процессов возвращал 404 из-за маршрутизации. После исправления URL появилась ошибка `dict is not callable` уже во view. После последовательной диагностики были исправлены и route, и обработчик.

---

## 9. Навигация между detail-страницами и главной

На главной используются hash-секции:

```text
#about
#expertises
#valuation
#services
#experts
#contacts
```

Изначально ссылки типа `#services` работали только с главной страницы. На detail-page они добавляли hash к текущему адресу.

Решение — использовать абсолютные SPA-ссылки:

```text
/#services
```

Навигация вынесена в общий `NAV_ITEMS`, который используется и в Header, и в Footer.

---

## 10. SEO

Для React SPA был реализован гибридный механизм SEO.

### Первичный ответ Django

Django до запуска React определяет страницу и сразу формирует:

```text
<title>
description
robots
canonical
Open Graph
```

Схема:

```text
request
    ↓
frontend_view
    ↓
resolve_seo(path)
    ↓
Django template
    ↓
HTML + SEO
```

### React `PageSeo`

После первого render навигация идёт как SPA, поэтому metadata при клиентских переходах обновляет React-компонент `PageSeo`.

### Ошибка canonical на staging

Первоначально React использовал build-time `VITE_SITE_URL`, содержащий production-домен. На preview получался конфликт:

```text
Django → preview-test.site
React  → altika-expert.ru
```

React после загрузки перезаписывал правильный canonical.

Решение — строить client canonical от текущего origin браузера и учитывать preview marker.

### Дополнительно реализованы

```text
sitemap.xml
robots.txt
canonical
Open Graph
JSON-LD Organization
JSON-LD Service
JSON-LD Person
настоящий HTTP 404
```

Также была устранена проблема stale `og:image`, когда изображение предыдущей SPA-страницы могло остаться в `<head>`.

---

## 11. Preview Mode

Для согласования используется отдельный production-like staging.

```env
PREVIEW_MODE=True
```

Preview работает с:

```text
DEBUG=False
HTTPS
MySQL
production frontend build
real SMTP
real Telegram
```

но закрыт от индексации:

```text
noindex, nofollow
```

и:

```text
User-agent: *
Disallow: /
```

При production-релизе планируется:

```env
PREVIEW_MODE=False
SITE_URL=https://altika-expert.ru
```

---

## 12. Production build React

Vite собирает frontend локально:

```bash
npm run build
```

Build интегрирован в Django static:

```text
backend/static/frontend/build/
```

Vite создаёт hash-assets и `.vite/manifest.json`. Django читает manifest и подключает актуальные JS/CSS файлы автоматически.

Такой подход выбран потому, что на shared hosting не требуется запускать отдельный Node/Vite production server.

---

## 13. Deployment на REG.RU

Рабочий принцип:

> локальная машина — source of truth; tracked-код на сервере вручную не редактируется.

Первоначальное клонирование выполнялось прямо в корень сайта:

```bash
git clone https://github.com/avramenkomy/altika-expert.git .
```

Последующие обновления:

```text
local changes
↓
git commit
↓
git push
↓
server git pull
```

Staging расположен в:

```text
/var/www/u1651207/data/www/preview-test.site
```

Используются Passenger и `passenger_wsgi.py`. Для restart:

```bash
touch .restart-app
```

Универсальная серверная процедура:

```bash
cd /var/www/u1651207/data/www/preview-test.site

git pull

cd backend
../.venv/bin/python manage.py migrate
../.venv/bin/python manage.py collectstatic --noinput
../.venv/bin/python manage.py check

cd ..
touch .restart-app
```

Если менялся frontend, перед push локально обязательно выполняется `npm run build`.

---

## 14. Production-проблемы

### Django и версия MySQL

На локальной машине использовалась более новая Django, но MySQL на REG.RU оказался версии 8.0.25. Возникла несовместимость framework/database.

Решение — перейти на Django 6.0.9, совместимую с hosting environment.

### MySQL Unix socket

На REG.RU подключение к БД потребовало socket. В settings была добавлена поддержка `DB_SOCKET`, `utf8mb4` и `STRICT_TRANS_TABLES`.

### Passenger и `.htaccess`

Попытка добавить Passenger directives в `.htaccess` вызвала:

```text
500 Internal Server Error
PassengerAppRoot not allowed here
```

Passenger был настроен через ISPmanager. В `.htaccess` оставлен только redirect `www → non-www`.

### MIME error после frontend deploy

После новой Vite-сборки браузер запросил новый CSS hash, но его ещё не было в `staticfiles`. Сервер вернул HTML вместо CSS, браузер увидел неправильный MIME type.

Причина — пропущенный `collectstatic`.

После этого было зафиксировано правило:

> новая frontend-сборка → обязательно `collectstatic`.

### Старый production bundle

Одна из frontend-правок уже присутствовала в source code, но staging продолжал использовать старый bundle. Решение: пересобрать frontend, закоммитить build, выполнить `git pull`, `collectstatic` и restart.

Это хорошо показало, что source code и production artifact — разные стадии deployment.

---

## 15. Static, media, SSL и redirects

Django использует:

```text
STATIC_ROOT = backend/staticfiles
MEDIA_ROOT  = backend/media
```

На staging настроены ссылки:

```text
static → backend/staticfiles
media  → backend/media
```

Установлен SSL. Основным hostname выбран:

```text
https://preview-test.site
```

`www.preview-test.site` делает постоянный 301 redirect на основной hostname.

---

## 16. Контент и визуальный стиль

После технической части был подготовлен полный контент для экспертиз, видов оценки и услуг.

Для иллюстраций выбран единый стиль:

```text
фотореализм
профессиональная среда
единая цветокоррекция
предметная композиция
без людей
без явного названия услуги в изображении
без логотипов
```

Сгенерированные изображения используются как иллюстративный контент. Для специалистов, дипломов, сертификатов и документов компании предполагаются реальные материалы.

На preview тестовыми пока остаются специалисты и документы компании — это позволяет заказчику оценить дизайн и решить, нужны ли эти блоки в production.

---

## 17. Smoke test staging

После deployment были проверены:

```text
DNS
HTTPS
www redirect
Passenger
Django
MySQL
React
Vite assets
static
media
Django Admin
все формы
сохранение заявок
email
Telegram
robots.txt
noindex
canonical
Open Graph
sitemap.xml
HTTP 404
JSON-LD
```

Staging используется не просто как визуальный preview, а как максимально близкое к production окружение.

---

## 18. Основные engineering lessons

### Контент нужно отделять от кода

Чем больше данных управляется через Django Admin, тем меньше дальнейшая стоимость поддержки сайта.

### Внешние сервисы не должны быть источником истины

SMTP и Telegram отвечают за уведомления. MySQL отвечает за сохранность заявки.

### Hosting environment влияет на выбор технологий

Версии Python, MySQL, Passenger и ограничения shared hosting нужно учитывать так же серьёзно, как frontend/backend код.

### SPA и SEO требуют отдельного проектирования

Изменение `document.title` на клиенте не заменяет корректный initial HTTP response.

### Build — часть deployment

Изменение React source не становится production-изменением до создания и публикации нового build artifact.

### Staging должен быть production-like

`DEBUG=False`, HTTPS, реальная БД и реальные интеграции позволяют находить проблемы до переноса на основной домен.

---

## 19. Текущее состояние

Основная функциональность проекта завершена.

Работают:

```text
React frontend
Django / DRF backend
MySQL
Django Admin
forms
SMTP
Telegram
media
SEO
sitemap
JSON-LD
HTTP 404
Preview Mode
HTTPS
production deployment
```

Текущий этап:

```text
согласование с заказчиком
контентные правки
получение реальных данных специалистов и документов
production migration
финальная SEO-проверка
```

---

## 20. Что проект демонстрирует

Проект охватывает полный цикл разработки:

```text
анализ требований
↓
проектирование структуры
↓
моделирование данных
↓
Django models / Admin
↓
REST API
↓
React architecture
↓
формы и validation
↓
MySQL
↓
SMTP / Telegram
↓
SEO
↓
production build
↓
Git deployment
↓
REG.RU / Passenger / SSL
↓
production debugging
```

Итоговый проект — не просто набор страниц, а небольшая управляемая web-система, в которой frontend, backend, database, CMS и deployment работают как единое приложение.
