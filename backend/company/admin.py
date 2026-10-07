from django.contrib import admin

from .models import Company, Expertise, ValuationType


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


@admin.register(Expertise)
class ExpertiseAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'order',
        'is_active',
        'updated_at',
    )
    list_editable = (
        'order',
        'is_active',
    )
    list_filter = ( 'is_active', )
    search_fields = ( 'title', )
    prepopulated_fields = {
        'slug': ( 'title', )
    }


@admin.register(ValuationType)
class ValuationTypeAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'price_from',
        'order',
        'is_active',
        'updated_at',
    )
    list_editable = (
        'order',
        'is_active',
    )
    list_filter = ( 'is_active', )
    search_fields = ( 'title', )
    prepopulated_fields = {
        'slug': ( 'title', )
    }