# Надёжная доставка уведомлений — retry-механизм

Этот документ описывает планируемую доработку механизма уведомлений о новых заявках.

Сейчас заявка сначала сохраняется в MySQL, после чего backend пытается отправить уведомления по email и в Telegram. Такой DB-first подход уже защищает от потери обращения: даже если внешний сервис недоступен, сама заявка остаётся в базе.

Следующий шаг — добавить контролируемые повторные попытки доставки уведомлений.

---

## 1. Цель

Требование:

```text
заявка гарантированно сохранена в БД
↓
первичная отправка уведомления
↓
если ошибка
↓
retry #1 через 5 минут
↓
если ошибка
↓
retry #2 через 60 минут
↓
если ошибка
↓
retry #3 через 120 минут
↓
если снова ошибка
↓
прекратить автоматические попытки
```

Email и Telegram должны обрабатываться независимо.

Например:

```text
Application #157

Email:
sent

Telegram:
failed
retry #2 scheduled
```

Успешная доставка одного канала не должна приводить к его повторной отправке из-за ошибки другого канала.

---

## 2. Почему заявка сохраняется до отправки уведомлений

Основной принцип остаётся прежним:

```text
Application
↓
MySQL
↓
Notifications
```

SMTP и Telegram Bot API являются внешними сервисами. Они могут временно не отвечать, возвращать ошибку, иметь сетевой timeout или быть недоступны из-за проблем соединения.

Внешняя интеграция не должна определять, будет ли сохранено обращение клиента.

---

## 3. Политика повторных попыток

Планируется четыре фактические попытки доставки одного уведомления:

```text
T+0 минут   → initial attempt
T+5 минут   → retry #1
T+60 минут  → retry #2
T+120 минут → retry #3
```

Времена повторных попыток считаются от момента первоначальной неудачной отправки.

Пример:

```text
12:00 → initial failure
12:05 → retry #1
13:00 → retry #2
14:00 → retry #3
```

После неудачного `retry #3` автоматическая доставка прекращается.

---

## 4. Почему каналы нужно отслеживать отдельно

Возможна ситуация:

```text
Email    → success
Telegram → timeout
```

В этом случае повторять email нельзя. Retry нужен только для Telegram.

```text
Application #157
    │
    ├── Email    → sent
    │
    └── Telegram → retry pending
```

Поэтому одного общего поля `notification_sent` недостаточно.

---

## 5. Отдельная сущность `NotificationDelivery`

Вместо дальнейшего расширения модели `Application` большим количеством полей планируется вынести состояние доставки в отдельную сущность.

```text
Application
    │
    ├── NotificationDelivery
    │      channel = email
    │
    └── NotificationDelivery
           channel = telegram
```

Пример модели:

```python
class NotificationDelivery(models.Model):
    class Channel(models.TextChoices):
        EMAIL = "email", "Email"
        TELEGRAM = "telegram", "Telegram"

    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SENT = "sent", "Sent"
        RETRY = "retry", "Retry pending"
        FAILED = "failed", "Failed"

    application = models.ForeignKey(
        "applications.Application",
        on_delete=models.CASCADE,
        related_name="notification_deliveries",
    )

    channel = models.CharField(max_length=20, choices=Channel.choices)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )

    retry_count = models.PositiveSmallIntegerField(default=0)
    next_retry_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    last_attempt_at = models.DateTimeField(null=True, blank=True)
    last_error = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

Для пары `application + channel` желательно добавить уникальное ограничение:

```python
class Meta:
    constraints = [
        models.UniqueConstraint(
            fields=["application", "channel"],
            name="unique_application_notification_channel",
        )
    ]
```

---

## 6. Состояния доставки

Предлагаемые состояния:

```text
pending
sent
retry
failed
```

`pending` — уведомление создано, но первичная попытка ещё не завершена.

`sent` — доставка успешно подтверждена внешним сервисом.

```text
status = sent
sent_at != NULL
next_retry_at = NULL
```

`retry` — предыдущая попытка завершилась ошибкой, но лимит повторов ещё не исчерпан.

```text
status = retry
retry_count < 3
next_retry_at != NULL
```

`failed` — все три повторные попытки исчерпаны.

```text
status = failed
retry_count = 3
next_retry_at = NULL
```

---

## 7. Первичная отправка

После сохранения заявки:

```text
Application saved
↓
создать NotificationDelivery(email)
↓
создать NotificationDelivery(telegram)
↓
попытаться отправить оба уведомления
```

При успехе:

```text
status = sent
sent_at = now
last_attempt_at = now
```

При ошибке:

```text
status = retry
retry_count = 0
next_retry_at = initial_failure_at + 5 min
last_attempt_at = now
last_error = "..."
```

---

## 8. Повторные попытки

### Retry #1

Через 5 минут scheduler находит запись с наступившим `next_retry_at`.

Если отправка успешна:

```text
status = sent
retry_count = 1
sent_at = now
next_retry_at = NULL
last_error = ""
```

Если снова ошибка:

```text
status = retry
retry_count = 1
next_retry_at = initial_failure_at + 60 min
```

### Retry #2

Через 60 минут от первоначального сбоя.

При ошибке:

```text
status = retry
retry_count = 2
next_retry_at = initial_failure_at + 120 min
```

### Retry #3

Через 120 минут.

При успехе:

```text
status = sent
retry_count = 3
sent_at = now
next_retry_at = NULL
```

При ошибке:

```text
status = failed
retry_count = 3
next_retry_at = NULL
last_error = "..."
```

После этого автоматическая отправка прекращается.

---

## 9. Почему `retry_count` не нужно обнулять после успеха

Например:

```text
status = sent
retry_count = 2
```

означает, что уведомление было доставлено, но только после двух повторных попыток.

Если после успеха записать `retry_count = 0`, диагностическая информация потеряется.

---

## 10. Планировщик без Celery

Для текущего масштаба проекта и shared hosting внедрение Celery, Redis и Celery Beat не является обязательным.

Более простая схема:

```text
Cron / server scheduler
↓
Django management command
↓
MySQL
↓
NotificationDelivery
↓
retry
```

Планируется management command:

```bash
python manage.py retry_notifications
```

Команда может запускаться планировщиком, например каждые пять минут.

```text
*/5 * * * * → retry_notifications
```

Конкретная production cron-команда должна использовать реальные пути virtualenv и проекта и будет зафиксирована в `DEPLOYMENT.md`.

---

## 11. Логика management command

Упрощённо:

```python
now = timezone.now()

deliveries = NotificationDelivery.objects.filter(
    status=NotificationDelivery.Status.RETRY,
    next_retry_at__lte=now,
    retry_count__lt=3,
)

for delivery in deliveries:
    retry_delivery(delivery)
```

Production-реализация должна дополнительно учитывать возможность параллельного запуска команды.

---

## 12. Защита от одновременной обработки

Если два процесса одновременно выберут одну запись, существует риск двойной отправки.

Поэтому обработку стоит проектировать с транзакцией и блокировкой строки, например через `select_for_update()`.

```python
with transaction.atomic():
    delivery = (
        NotificationDelivery.objects
        .select_for_update()
        .get(pk=delivery_id)
    )

    if delivery.status != "retry":
        return

    if delivery.next_retry_at > timezone.now():
        return
```

---

## 13. Ошибки внешних сервисов

В `last_error` можно сохранять диагностическое сообщение:

```text
ConnectTimeout
SMTPServerDisconnected
TimeoutError
HTTP 500
HTTP 429
```

В это поле нельзя сохранять секреты: SMTP password, Telegram token, database password и другие credentials.

---

## 14. Django Admin

В Admin желательно видеть:

```text
Application #157

Email
status: sent
retries: 0
sent_at: 12:00

Telegram
status: failed
retries: 3
last_attempt_at: 14:00
last_error: ConnectTimeout
```

Это позволит быстро понять, была ли заявка сохранена, какие каналы отработали, сколько было повторных попыток и почему доставка окончательно не состоялась.

---

## 15. Возможность ручной повторной отправки

В дальнейшем можно добавить Django Admin action:

```text
Повторить отправку выбранных уведомлений
```

Она будет полезна для записей со статусом `failed` после устранения внешней проблемы.

Это дополнительная возможность и не является обязательной для первой версии retry-механизма.

---

## 16. Риск дублирования уведомлений

Есть важный distributed-systems нюанс.

Возможен сценарий:

```text
Django → Telegram
↓
Telegram получил сообщение
↓
соединение оборвалось
↓
Django получил timeout
```

Backend не может наверняка знать, было ли сообщение доставлено, и позже выполнит retry. В результате сотрудник может получить дубль.

Полностью исключить такой сценарий для обычного SMTP/Telegram API сложно.

Для снижения влияния дублей каждое уведомление должно содержать внутренний идентификатор заявки:

```text
Заявка #157
```

В этом проекте лучше получить редкий дубль уведомления, чем потерять информацию о новой заявке.

---

## 17. Почему не использовать бесконечные retries

Бесконечные повторные попытки могут создавать постоянную нагрузку, засорять логи и бесконечно обращаться к неправильно настроенному внешнему сервису.

Поэтому используется ограниченная политика:

```text
initial attempt
+
3 retries
```

После этого:

```text
status = failed
```

и требуется ручная диагностика.

---

## 18. Индексы

Scheduler будет регулярно искать:

```text
status = retry
next_retry_at <= now
```

Поэтому имеет смысл добавить индекс:

```python
class Meta:
    indexes = [
        models.Index(
            fields=["status", "next_retry_at"],
            name="notification_retry_idx",
        ),
    ]
```

---

## 19. Итоговый поток

```text
User submits form
        ↓
DRF validates request
        ↓
Application saved in MySQL
        ↓
┌───────────────────────┐
│ create deliveries     │
├───────────┬───────────┤
│ Email     │ Telegram  │
└─────┬─────┴─────┬─────┘
      ↓           ↓
 initial send   initial send
      │           │
      ├─ success  ├─ success
      │     ↓     │     ↓
      │    sent   │    sent
      │           │
      └─ error    └─ error
            ↓
       retry scheduled
            ↓
        +5 minutes
            ↓
        retry #1
            ↓
        +60 minutes
            ↓
        retry #2
            ↓
       +120 minutes
            ↓
        retry #3
            ↓
     ┌──────┴──────┐
     ↓             ↓
   success        error
     ↓             ↓
    sent          failed
```

---

## 20. Что эта доработка даёт проекту

После реализации уведомления перестанут зависеть от единичной сетевой ошибки.

Система получит:

```text
DB-first persistence
+
independent delivery channels
+
controlled retry policy
+
delivery state
+
diagnostic history
+
final failure state
```

При этом архитектура останется достаточно простой для shared hosting:

```text
Django
+
MySQL
+
management command
+
server scheduler
```

без обязательного внедрения Redis/Celery.

---

## 21. Возможное развитие

Если в будущем количество фоновых задач значительно вырастет, текущую модель `NotificationDelivery` можно сохранить, а механизм выполнения заменить:

```text
Cron + management command
```

на:

```text
Celery
+
Redis / RabbitMQ
+
Celery Beat
```

То есть бизнес-модель доставки не придётся проектировать заново — изменится только механизм выполнения фоновых задач.

---

## 22. Статус

На текущем этапе механизм является **planned feature**.

План реализации:

```text
NotificationDelivery model
↓
migration
↓
notification service refactoring
↓
initial delivery records
↓
retry scheduling
↓
management command
↓
server scheduler
↓
Django Admin integration
↓
tests
↓
staging verification
↓
production deployment
```

После реализации этот документ должен быть обновлён с учётом фактического кода и результатов тестирования.
