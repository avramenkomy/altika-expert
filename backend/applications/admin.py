from django.contrib import admin

from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'application_type',
        'subject',
        'phone',
        'email_sent',
        'telegram_sent',
        'created_at',
    )

    list_filter = (
        'application_type',
        'email_sent',
        'telegram_sent',
        'created_at',
    )

    search_fields = (
        'name',
        'phone',
        'email',
        'subject',
        'message',
    )

    readonly_fields = (
        'email_sent',
        'telegram_sent',
        'created_at',
        'updated_at',
    )

    fieldsets = (
        (
            'Заявка',
            {
                'fields': (
                    'application_type',
                    'subject',
                    'name',
                    'phone',
                    'email',
                    'message',
                )
            },
        ),
        (
            'Уведомления',
            {
                'fields': ( 'email_sent', 'telegram_sent', )
            },
        ),
        (
            'Служебная информация',
            {
                'fields': ( 'created_at', 'updated_at', )
            },
        ),
    )
