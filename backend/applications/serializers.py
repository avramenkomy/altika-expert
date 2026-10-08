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

    # def validate(self, attrs):
    #     application_type = attrs.get('application_type')
    #     subject = attrs.get('subject', '').strip()
    #     email = attrs.get('email', '').strip()
    #     message = attrs.get('message', '').strip()
    #     consent = attrs.get('consent_personal_data')

    #     if not consent:
    #         raise serializers.ValidationError(
    #             {
    #                 'consent_personal_data': (
    #                     'Необходимо согласие на обработку персональных данных.'
    #                 )
    #             }
    #         )

    #     if application_type in (
    #         Application.ApplicationType.EXPERTISE,
    #         Application.ApplicationType.VALUATION,
    #     ):
    #         if not subject:
    #             raise serializers.ValidationError({
    #                 'subject': 'Необходимо указать тему',
    #             })

    #         if not email:
    #             raise serializers.ValidationError({
    #                 'email': 'Необходимо указать email',
    #             })

    #         if not message:
    #             raise serializers.ValidationError({
    #                 'message': 'Кратко опишите суть вопроса.',
    #             })

    #     return attrs
