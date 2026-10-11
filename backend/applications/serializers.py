import re

from rest_framework import serializers

from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = (
            'id',
            'application_type',
            'subject',
            'name',
            'phone',
            'email',
            'message',
            'consent_personal_data',
            'email_sent',
            'telegram_sent',
            'created_at',
        )
        read_only_fields = (
            'id', 'email_sent', 'telegram_sent', 'created_at',
        )

    def validate_phone(self, value):
        phone = value.strip()

        if not re.fullmatch(r"\+?[\d\s\-()]{10,20}", phone):
            raise serializers.ValidationError(
                'Введите корректный номер телефона.'
            )

        return phone

    def validate(self, attrs):
        application_type = attrs.get('application_type')
        consent = attrs.get('consent_personal_data')

        if not consent:
            raise serializers.ValidationError(
                {
                    'consent_personal_data': (
                        'Необходимо согласие на обработку персональных данных.'
                    )
                }
            )

        if application_type == Application.ApplicationType.CALLBACK:
            return attrs

        errors = {}

        email = attrs.get('email', '').strip()
        message = attrs.get('message', '').strip()

        if not email:
            errors['email'] = 'Укажите email.'

        if not message:
            errors['email'] = 'Опишите ваш вопрос.'

        subject = attrs.get('subject', '').strip()

        if (application_type in (
            Application.ApplicationType.EXPERTISE,
            Application.ApplicationType.VALUATION,
            Application.ApplicationType.SERVICE,
        ) and not subject):
            errors['subject'] = 'Не указана тема заявки.'

        if errors:
            raise serializers.ValidationError(errors)

        return attrs
