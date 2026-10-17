import logging

import requests
from django.conf import settings
from django.core.mail import send_mail
from django.utils import timezone

from .models import Application


logger = logging.getLogger(__name__)


def build_application_message(application):
    created_at = timezone.localtime(application.created_at)

    return '\n'.join(
        (
            f'Новая заявка №{application.pk}',
            '',
            f'Тип: {application.get_application_type_display()}',
            f'Тема: {application.subject or '—'}',
            f'Имя: {application.name}',
            f'Телефон: {application.phone}',
            f'Email: {application.email or '—'}',
            f'Вопрос: {application.message or '—'}',
            f'Дата: {created_at:%d.%m.%Y %H:%M}',
        )
    )


def send_email_notification(application):
    recipient = settings.APPLICATION_NOTIFICATION_EMAIL

    if not recipient:
        return False

    try:
        sent_count = send_mail(
            subject=f'Новая заявка: {application.get_application_type_display()}',
            message=build_application_message(application),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient, ],
        )
    except Exception:
        logger.exception(
            'Не удалось отправить email для заявки %s',
            application.pk,
        )
        return False
    return sent_count == 1


def send_telegram_notification(application):
    token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID

    if not token or not chat_id:
        return False

    url = f'https://api.telegram.org/bot{token}/sendMessage'

    try:
        response = requests.post(
            url,
            json={
                'chat_id': chat_id,
                'text': build_application_message(application),
            },
            timeout=10,
        )
        response.raise_for_status()

        data = response.json()
    except (requests.RequestException, ValueError):
        logger.exception(
            'Не удалось отправить Telegram для заявки %s',
            application.pk,
        )
        return False

    return data.get('ok', False)


def notify_about_application(application):
    application.email_sent = send_email_notification(application)
    application.telegram_sent = send_telegram_notification(application)

    application.save(
        update_fields=(
            'email_sent',
            'telegram_sent',
            'updated_at',
        )
    )
