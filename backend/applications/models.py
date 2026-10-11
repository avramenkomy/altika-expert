from django.db import models

class Application(models.Model):
    class ApplicationType(models.TextChoices):
        CALLBACK = 'callback', 'Обратный звонок'
        GENERAL = 'general', 'Общая заявка'
        EXPERTISE = 'expertise', 'Заявка на экспертизу'
        VALUATION = 'valuation', 'Заявка на отчет об оценке'
        SERVICE = 'service', 'Услуга'


    application_type = models.CharField(
        'Тип заявки',
        max_length=20,
        choices=ApplicationType.choices
    )

    subject = models.CharField(
        'Тема',
        max_length=255,
        blank=True,
    )

    name = models.CharField(
        '',
        max_length=150,
    )

    phone = models.CharField(
        'Номер телефона',
        max_length=50
    )

    email = models.EmailField(
        'Email',
        blank=True,
    )

    message = models.TextField(
        'Суть вопроса',
        blank=True,
    )

    consent_personal_data = models.BooleanField(
        'Согласие на обработку персональный данных',
        default=False,
    )

    email_sent = models.BooleanField(
        'Отправлено на email',
        default=False,
    )

    telegram_sent = models.BooleanField(
        'Отправлено в telegram',
        default=False,
    )

    created_at = models.DateTimeField(
        'Заявка создана',
        auto_now_add=True
    )
    updated_at = models.DateTimeField(
        'Заявка обновлена',
        auto_now=True
    )

    class Meta:
        verbose_name = 'Заявка'
        verbose_name_plural = 'Заявки'
        ordering = ( '-created_at', )

    def __str__(self):
        return f'{self.get_application_type_display()} - {self.name}'
