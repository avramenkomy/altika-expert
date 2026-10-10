from django.contrib import admin

from .models import (
    Company,
    CompanyDocument,
    CompanyAdvantage,
    Expertise,
    ProcessStep,
    SiteSettings,
    UseCase,
    ValuationType,
)


@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = (
        'name',
        'phone',
        'phone_secondary',
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
                    'phone_secondary',
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


@admin.register(ProcessStep)
class ProcessStepAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'process_type',
        'order',
        'is_active',
    )
    list_editable = (
        'order',
        'is_active',
    )
    list_filter = (
        'process_type',
        'is_active',
    )

    search_fields = ( 'title', )


@admin.register(UseCase)
class UseCaseAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'case_type',
        'order',
        'is_active',
    )
    list_editable = (
        'order',
        'is_active',
    )
    list_filter = (
        'case_type',
        'is_active',
    )

    search_fields = ( 'title', )


@admin.register(CompanyDocument)
class CompanyDocumentAdmin(admin.ModelAdmin):
    list_display = ( 'title', 'order', 'is_active', )
    list_editable = ( 'order', 'is_active', )
    list_filter = ( 'is_active', )
    search_fields = ( 'title', )


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        if SiteSettings.objects.exists():
            return False
        return super().has_add_permission(request)


@admin.register(CompanyAdvantage)
class CompanyAdvantageAdmin(admin.ModelAdmin):
    list_display = ( 'title', 'order', 'is_active', )
    list_editable = ( 'order', 'is_active', )
    search_fields = ( 'title', )
    list_filter = ( 'is_active', )