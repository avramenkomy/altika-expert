# DEVLOG — Экспертное бюро «Альтика»

Журнал разработки коммерческого сайта экспертно-оценочной компании.

Документ фиксирует ключевые архитектурные решения, этапы разработки, проблемы,
найденные причины и итоговые решения.

---

## 1. Цель проекта

Задача проекта — переработать сайт экспертно-оценочной компании и получить
современный корпоративный ресурс, который не является статическим лендингом, а управляется через backend.

Основные требования:

- отдельные направления экспертиз, оценки и услуг;
- отдельные detail-страницы;
- страницы специалистов и подтверждающих документов;
- формы заявок с сохранением в базе данных;
- уведомления по email и Telegram;
- управление контентом через Django Admin;
- техническая SEO-подготовка;
- staging-домен для согласования с заказчиком;
- deployment на shared hosting REG.RU.

Production-домен:

```text
https://altika-expert.ru
```

Preview:

```text
https://preview-test.site
```

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
mysqlclient
python-dotenv
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

Контент хранится в базе данных, а React отвечает в основном за представление, SPA-навигацию и пользовательское взаимодействие.

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

Ключевое решение — вынести тексты, изображения, порядок отображения и
значительную часть SEO-данных из React в MySQL.

Благодаря этому заказчик может менять контент через Django Admin без новой
сборки frontend.

`SiteSettings` используется для глобальных параметров сайта и Hero-блока:

```text
hero title
hero subtitle
hero image
SEO главной страницы
видимость отдельных секций
```

Практический результат:

> контент и изображения можно изменять без редактирования JSX и повторного frontend build.

### `services`

Отдельное приложение для дополнительных услуг.

Каждая услуга может содержать:

```text
title
slug
short_description
description
image
price_from
seo_title
seo_description
order
is_active
```

Каждая активная услуга имеет собственную detail-страницу.

### `experts`

Архитектура специалистов:

```text
Expert
 ├── ManyToMany → Position
 ├── ManyToMany → Specialization
 └── OneToMany  → ExpertDocument
```

ManyToMany выбран потому, что один специалист может одновременно иметь несколько должностей и несколько экспертных специализаций.

Для специалиста могут храниться:

```text
ФИО
slug
фотография
должности
специализации
образование
квалификация
опыт
биография
SEO metadata
порядок
is_active
```

### `applications`

Приложение отвечает за заявки с сайта.

Поддерживаются типы:

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

Принято разделение на небольшие переиспользуемые `components` и крупные
смысловые `sections`.

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

HTTP-запросы не размещаются непосредственно по всему UI-коду.

Для них создан отдельный слой:

```text
frontend/src/api/
```

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

На главной странице независимые запросы выполняются параллельно через:

```javascript
Promise.all(...)
```

Это позволяет не ждать последовательного завершения запросов, которые не зависят
друг от друга.

---

## 6. Формы и заявки

Формы присутствуют в нескольких местах сайта:

```text
Header
Hero
общая CTA-секция
detail-страница экспертизы
detail-страница оценки
detail-страница услуги
detail-страница специалиста
```

Главное решение — использовать одну модель `Application`, а контекст передавать
через тип и тему заявки.

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

Принцип DB-first выбран намеренно:

> временный сбой Telegram или SMTP не должен приводить к потере обращения клиента.

Для контроля доставки хранятся признаки:

```text
email_sent
telegram_sent
```

Также настроен throttling.

В ходе тестирования был подтверждён ответ:

```text
429 Too Many Requests
```

---

## 7. Email и Telegram

На раннем этапе email работал через console backend.

Позже был подключён реальный SMTP.

Используются настройки:

```text
EMAIL_BACKEND
EMAIL_HOST
EMAIL_PORT
EMAIL_HOST_USER
EMAIL_HOST_PASSWORD
EMAIL_USE_TLS
EMAIL_USE_SSL
```

### Проблема после смены версии Django

На раннем этапе использовалась более новая версия Django и другой вариант
настройки mail backend.

После downgrade Django на сервере email перестал корректно работать.

Решение:

- перейти на стандартную конфигурацию Django Email;
- убрать несовместимое использование `using='default'`;
- отдельно проверить отправку через shell;
- проверить отправку через реальные формы.

### Telegram

Telegram-уведомления реализованы через Bot API.

Конфигурация хранится в environment variables:

```text
TELEGRAM_BOT_TOKEN
TELEGRAM_CHAT_ID
```

Во время тестирования один раз возникал:

```text
ConnectTimeout
```

После этого API и реальные формы работали штатно.

Этот случай дополнительно подтвердил правильность DB-first архитектуры:

```text
database
↓
external notifications
```

---

## 8. Проблемы DRF и ORM

### Ошибка `'tuple' object has no attribute 'values'`

При разработке API специалистов возникла ошибка:

```text
AttributeError: 'tuple' object has no attribute 'values'
```

Причина была в некорректной структуре `Meta.fields` serializer.

После исправления serializer стал корректно формировать вложенные данные.

### Ошибка `prefetch_related`

В queryset специалистов была опечатка:

```text
spezializations
```

вместо:

```text
specializations
```

После исправления `prefetch_related` связанные данные стали загружаться
корректно.

### Процессы экспертизы и оценки

Для этапов проведения экспертизы и оценки используется модель:

```text
ProcessStep
```

Сначала endpoint процессов возвращал:

```text
404
```

из-за маршрутизации.

После исправления URL появилась:

```text
TypeError: 'dict' object is not callable
```

уже во view.

После последовательной диагностики были исправлены и route, и обработчик.

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

Изначально ссылки типа:

```text
#services
```

корректно работали только на главной.

На detail-page hash добавлялся к текущему адресу:

```text
/services/some-service#services
```

вместо возврата на главную.

Решение — использовать:

```text
/#services
```

Навигация вынесена в общий:

```text
NAV_ITEMS
```

который используется одновременно в Header и Footer.

Это устранило дублирование конфигурации меню.

---

## 10. SEO

Для React SPA реализован гибридный механизм SEO.

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

Таким образом необходимые metadata присутствуют уже в initial HTTP response.

### React `PageSeo`

После первого render навигация выполняется как SPA.

При клиентских переходах metadata обновляет React-компонент:

```text
PageSeo
```

Получается двухуровневая схема:

```text
первоначальный запрос
→ Django SEO

SPA navigation
→ React PageSeo
```

---

## 11. Ошибка canonical на staging

Первоначально React использовал build-time переменную:

```javascript
import.meta.env.VITE_SITE_URL
```

Production build содержал:

```text
https://altika-expert.ru
```

Но тот же build запускался на:

```text
https://preview-test.site
```

Получался конфликт:

```text
Django → preview-test.site
React  → altika-expert.ru
```

React после загрузки перезаписывал правильный canonical.

### Решение

Client-side canonical стал формироваться от:

```javascript
window.location.origin
```

Также был добавлен preview marker, чтобы React не мог заменить:

```text
noindex, nofollow
```

на:

```text
index, follow
```

во время работы preview-сайта.

---

## 12. Stale `og:image`

При SPA-переходе со страницы с изображением на страницу без изображения старый:

```text
og:image
```

мог оставаться в `<head>`.

Решение:

> если новая страница не содержит OG image, старый meta-тег удаляется.

---

## 13. Дополнительное SEO

Реализованы:

```text
sitemap.xml
robots.txt
canonical URL
Open Graph
JSON-LD Organization
JSON-LD Service
JSON-LD Person
настоящий HTTP 404
```

### Sitemap

`sitemap.xml` включает активные:

```text
экспертизы
виды оценки
услуги
специалистов
```

### Robots

Preview использует:

```text
User-agent: *
Disallow: /
```

### JSON-LD

Structured Data реализованы для:

```text
Organization
Service
Person
```

---

## 14. Настоящий HTTP 404

Одна из проблем SPA заключается в том, что неизвестный URL часто возвращает:

```text
HTTP 200
```

а уже React показывает страницу 404.

Для поисковой системы это некорректно.

В проекте Django определяет неизвестный route и возвращает настоящий:

```text
HTTP 404
```

при этом React отображает пользовательскую страницу ошибки.

---

## 15. Preview Mode

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

Цель preview:

```text
максимально приблизить среду к production
+
не допустить индексации временного домена
```

При production-релизе планируется:

```env
PREVIEW_MODE=False
SITE_URL=https://altika-expert.ru
```

---

## 16. Production build React

Vite собирает frontend локально:

```bash
npm run build
```

Build интегрирован в Django static:

```text
backend/static/frontend/build/
```

Vite создаёт:

```text
hashed JS assets
hashed CSS assets
.vite/manifest.json
```

Django читает manifest и подключает актуальные JS/CSS-файлы автоматически.

Такой подход выбран потому, что на shared hosting не требуется запускать
отдельный Node/Vite production server.

---

## 17. Deployment на REG.RU

Рабочий принцип:

> локальная машина — source of truth; tracked-код на сервере вручную не редактируется.

Первоначальное клонирование выполнялось прямо в корень сайта:

```bash
git clone https://github.com/avramenkomy/altika-expert.git .
```

Точка в конце означает клонирование содержимого repository непосредственно в
текущую директорию.

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

Для запуска Django используется Passenger.

В корне располагается:

```text
passenger_wsgi.py
```

Restart приложения:

```bash
touch .restart-app
```

---

## 18. Универсальная процедура deployment

Текущая серверная последовательность:

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

Если менялся frontend, перед push локально обязательно выполняется:

```bash
cd frontend
npm run build
```

После этого production build коммитится вместе с изменениями.

Этот процесс планируется автоматизировать через CI/CD после согласования
проекта.

---

## 19. Production-проблемы

### Django и версия MySQL

Локально проект первоначально использовал более новую версию Django.

На REG.RU MySQL оказался версии:

```text
8.0.25
```

Возникла несовместимость framework/database.

Решение — перейти на:

```text
Django 6.0.9
```

совместимую с hosting environment.

Основной вывод:

> технологический стек необходимо проверять не только относительно локальной среды, но и относительно реальной production-инфраструктуры.

---

### MySQL Unix socket

На REG.RU подключение к БД потребовало Unix socket.

В settings была добавлена поддержка:

```text
DB_SOCKET
```

Также используются:

```text
utf8mb4
STRICT_TRANS_TABLES
```

---

### Passenger и `.htaccess`

Попытка добавить Passenger directives непосредственно в `.htaccess` вызвала:

```text
500 Internal Server Error
PassengerAppRoot not allowed here
```

Причина:

> REG.RU не разрешает использовать эту Passenger directive в данном контексте.

Решение:

- Passenger настроен через ISPmanager;
- Passenger directives удалены из `.htaccess`;
- `.htaccess` используется только для необходимых redirect rules.

---

### MIME error после frontend deploy

После новой Vite-сборки browser запросил новый CSS hash.

Например:

```text
index-DCRwHnlO.css
```

Но файл ещё отсутствовал в:

```text
staticfiles
```

Сервер вернул HTML вместо CSS.

Browser увидел:

```text
text/html
```

вместо:

```text
text/css
```

и заблокировал stylesheet.

Причина — пропущенный:

```bash
python manage.py collectstatic --noinput
```

После этого зафиксировано deployment rule:

> новая frontend-сборка → обязательно `collectstatic`.

---

### Старый production bundle

Одна из frontend-правок уже находилась в source code, но staging продолжал
использовать старый bundle.

Причина:

> production artifact не был пересобран.

Решение:

```text
npm run build
↓
commit
↓
push
↓
git pull
↓
collectstatic
↓
Passenger restart
```

Это на практике показало разницу между:

```text
source code
```

и:

```text
production artifact
```

---

## 20. Static, media, SSL и redirects

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

Установлен SSL.

Основным hostname выбран:

```text
https://preview-test.site
```

Адрес:

```text
https://www.preview-test.site
```

выполняет постоянный:

```text
301 redirect
```

на основной hostname.

Это предотвращает дублирование сайта по двум адресам.

---

## 21. Контент и визуальный стиль

После технической части был подготовлен контент для:

```text
экспертиз
видов оценки
услуг
Hero
```

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

Сгенерированные изображения используются исключительно как иллюстративный
контент.

Для:

```text
специалистов
дипломов
сертификатов
документов компании
```

предполагаются реальные материалы.

На preview тестовыми пока остаются специалисты и документы компании.

Это позволяет заказчику оценить дизайн блоков до предоставления реального
контента.

---

## 22. Smoke test staging

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

Staging используется не просто как визуальный preview, а как максимально близкое
к production окружение.

---

## 23. Основные engineering lessons

### Контент нужно отделять от кода

Чем больше данных управляется через Django Admin, тем меньше дальнейшая
стоимость поддержки сайта.

---

### Внешние сервисы не должны быть источником истины

SMTP и Telegram отвечают за уведомления.

MySQL отвечает за сохранность заявки.

```text
Application
↓
MySQL
↓
Notifications
```

а не наоборот.

---

### Hosting environment влияет на выбор технологий

Версии:

```text
Python
Django
MySQL
Passenger
```

и ограничения shared hosting нужно учитывать так же серьёзно, как
frontend/backend код.

---

### SPA и SEO требуют отдельного проектирования

Изменение:

```javascript
document.title
```

на клиенте не заменяет корректный initial HTTP response.

Для проекта потребовалась комбинация:

```text
Django initial SEO
+
React SPA SEO updates
```

---

### Build — часть deployment

Изменение React source не становится production-изменением до создания и
публикации нового build artifact.

```text
source
↓
build
↓
deploy
↓
collectstatic
```

---

### Staging должен быть production-like

Использование:

```text
DEBUG=False
HTTPS
реальной БД
production build
реальных integrations
```

позволяет находить проблемы до переноса на основной домен.

---

## 24. Что проект демонстрирует

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

Итоговый проект — не просто набор страниц, а небольшая управляемая web-система,
в которой:

```text
frontend
backend
database
CMS
integrations
SEO
deployment
```

работают как единое приложение.

---

# 25. План дальнейшего развития

Основная архитектура и ключевая функциональность проекта уже реализованы.

До production-релиза запланирован отдельный этап UX, юридических,
документационных и инфраструктурных доработок.

---

## Frontend validation

Планируется добавить полноценную клиентскую валидацию всех пользовательских форм.

При этом backend-валидация DRF остаётся обязательным и финальным уровнем
проверки данных.

Схема:

```text
пользователь вводит данные
↓
frontend validation
↓
мгновенная обратная связь
↓
HTTP request
↓
DRF validation
↓
database
```

Frontend validation отвечает за UX.

Backend validation отвечает за целостность и безопасность данных.

---

## Loader на detail-страницах

На detail-страницах во время загрузки данных сейчас может отображаться текст:

```text
Загрузка...
```

Планируется заменить его на единый loader проекта.

Цель:

- унифицировать loading states;
- убрать визуально временный текст;
- сохранить единый стиль интерфейса.

---

## Адаптивные карусели

Для мобильных и планшетных устройств планируется изменить представление
нескольких блоков.

В карусель будут преобразованы:

```text
блок специалистов
блок документов компании
документы на detail-странице специалиста
```

На desktop текущая grid-раскладка останется без изменений.

---

## Mobile Header

На мобильной версии логотип и кнопка меню визуально расположены немного выше
вертикального центра Header.

Планируется скорректировать mobile styles и отцентрировать оба элемента
относительно высоты Header.

---

## Форма «Нашли ошибку на сайте?»

Планируется добавить компактную форму обратной связи:

> «Нашли ошибку на сайте? Сообщите нам об этом.»

Назначение формы:

```text
опечатка
неактуальная информация
ошибка отображения
техническая проблема
```

Сообщение предполагается:

```text
React form
↓
backend
↓
database
↓
notification
```

Для уведомлений может использоваться существующая инфраструктура
email / Telegram либо отдельный канал.

---

## Политика обработки персональных данных

Перед production-релизом необходимо добавить отдельную страницу политики
обработки персональных данных.

Также планируется:

- добавить ссылки на политику рядом со всеми формами;
- добавить необходимое информирование пользователя;
- проверить формы на корректность работы с персональными данными;
- проверить финальные тексты перед production-релизом.

---

## Расширение технической документации

Каталог `docs/` планируется привести к структуре:

```text
docs/
├── ARCHITECTURE.md
├── API.md
├── DEPLOYMENT.md
├── DEVLOG.md
├── SEO.md
└── screenshots/
```

Назначение документов:

### `ARCHITECTURE.md`

Актуальная архитектура приложения:

```text
Frontend
Backend
Database
CMS
Integrations
Data flow
```

### `API.md`

Документация REST API:

```text
endpoint
HTTP method
назначение
request
response
```

### `DEPLOYMENT.md`

Инструкция по:

```text
локальной подготовке
frontend build
Git deployment
migrations
collectstatic
Passenger restart
REG.RU environment
```

### `SEO.md`

Отдельное описание:

```text
Django initial SEO
React PageSeo
canonical
Open Graph
robots
sitemap
JSON-LD
Preview Mode
HTTP 404
```

### `DEVLOG.md`

История разработки, архитектурные решения, проблемы, причины и способы их
устранения.

---

## CI/CD

CI/CD будет внедрён после согласования сайта и перехода к production deployment.

Планируемый pipeline:

```text
git push
↓
GitHub Actions
↓
frontend lint
↓
frontend build
↓
backend checks / tests
↓
deployment
↓
Django migrations
↓
collectstatic
↓
Passenger restart
```

Планируется разделить:

```text
staging workflow
production workflow
```

Для production deployment предполагается ручное подтверждение перед выполнением
серверного этапа.

В перспективе это позволит перейти от текущей схемы:

```text
git push
↓
manual SSH
↓
git pull
↓
migrate
↓
collectstatic
↓
restart
```

к автоматизированной:

```text
git push
↓
CI validation
↓
build
↓
approved deploy
↓
server update
```

---

# 26. Статус проекта

Основная архитектура и функциональность проекта реализованы.

Текущий этап:

```text
согласование проекта с заказчиком
контентные правки
замена тестовых данных
UX-доработки
frontend validation
добавление юридической информации
дополнение технической документации
подготовка production deployment
финальная SEO-проверка
CI/CD setup
```

После завершения согласования проект будет подготовлен к переносу с preview:

```text
https://preview-test.site
```

на production:

```text
https://altika-expert.ru
```

---

# 27. Итог

Главный результат разработки — не просто набор React-страниц.

Проект представляет собой небольшую управляемую web-систему:

```text
Django Admin
    ↓
MySQL
    ↓
Django REST Framework
    ↓
React
```

с дополнительными production-механизмами:

```text
applications
SMTP
Telegram
media
SEO
staging
HTTPS
Passenger
deployment
```

Большинство архитектурных решений принималось исходя из реальных требований
проекта.

```text
контент должен менять заказчик
→ Django Admin

специалист может иметь несколько ролей
→ ManyToMany

SMTP или Telegram могут быть недоступны
→ DB-first applications

preview нельзя индексировать
→ PREVIEW_MODE

React SPA нужен вместе с полноценным SEO
→ Django initial HTML + React PageSeo

shared hosting не требует Node production server
→ Vite static build + Django + Passenger

production build изменился
→ collectstatic обязателен
```

Именно эти требования и реальные ограничения инфраструктуры сформировали
итоговую архитектуру проекта.
