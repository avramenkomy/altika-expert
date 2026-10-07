from django.contrib import admin

from .models import Company


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'phone',
        'email',
        'updated_at',
    )

    fieldsets = (
        (
            'Основная информация',
            {
                'fields': ( 'name', 'short_name', 'description', )
            }
        ),
        (
            'Реквизиты',
            {
                'fields': ( 'inn', 'kpp', 'ogrn' ),
            }
        ),
        (
            'Контакты',
            {
                'fields': (
                    'phone',
                    'email',
                    'telegram',
                    'whatsapp',
                    'address',
                    'working_hours'
                )
            }
        ),
        (
            'Координаты',
            {
                'fields': ( 'latitude', 'longitude', )
            }
        ),
    )