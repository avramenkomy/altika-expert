from django.contrib import admin

from .models import Expert, ExpertDocument, Position, Specialization


@admin.register(Position)
class PositionAdmin(admin.ModelAdmin):
    list_display = ( 'title', 'order', )
    list_editable = ( 'order', )
    search_fields = ( 'title', )


@admin.register(Specialization)
class SpecializationAdmin(admin.ModelAdmin):
    list_display = ( 'title', 'order', )
    list_editable = ( 'order', )
    search_fields = ( 'title', )


class ExpertDocumentInline(admin.TabularInline):
    model = ExpertDocument
    extra = 0

    fields = (
        'document_type',
        'title',
        'image',
        'order',
        'is_active',
    )


@admin.register(Expert)
class ExpertAdmin(admin.ModelAdmin):
    list_display = (
        'full_name',
        'display_positions',
        'order',
        'is_active',
        'updated_at',
    )
    list_editable = ( 'order', 'is_active', )
    list_filter = ( 'is_active', 'positions', 'spezializations', )
    search_fields = ( 'last_name', 'first_name', 'middle_name', )
    prepopulated_fields = {
        'slug': ( 'last_name', 'first_name', ),
    }
    filter_horizontal = ( 'positions', 'spezializations', )
    inlines = (ExpertDocumentInline, )

    @admin.display(description='Должности')
    def display_positions(self, obj):
        return ', '.join(position.title for position in obj.positions.all())


@admin.register(ExpertDocument)
class ExpertDocumentAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'expert',
        'document_type',
        'order',
        'is_active',
    )
    list_editable = ( 'order', 'is_active', )
    list_filter = ('document_type', 'is_active', )
    search_fields = ( 'title', 'expert__last_name', 'expert__first_name', )
