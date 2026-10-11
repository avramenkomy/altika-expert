from rest_framework import serializers
from .models import (
    Company,
    CompanyAdvantage,
    Expertise,
    ValuationType,
    ProcessStep,
    CompanyDocument,
    SiteSettings,
    UseCase,
)


class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = (
            'id',
            'name',
            'short_name',
            'description',
            'inn',
            'kpp',
            'ogrn',
            'logo',
            'phone',
            'phone_secondary',
            'email',
            'telegram',
            'whatsapp',
            'address',
            'working_hours',
            'latitude',
            'longitude',
        )


class CompanyAdvantageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyAdvantage
        fields = ( 'id', 'title', 'description', )


class ExpertiseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expertise
        fields = (
            'id',
            'title',
            'slug',
            'short_description',
            'description',
            'image',
            'seo_title',
            'seo_description',
        )


class ValuationTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ValuationType
        fields = (
            'id',
            'title',
            'slug',
            'short_description',
            'description',
            'image',
            'seo_title',
            'seo_description',
        )


class ProcessStepSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcessStep
        fields = (
            'id', 'process_type', 'title', 'description',
        )


class UseCaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = UseCase
        fields = (
            'id', 'case_type', 'title', 'description',
        )


class CompanyDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyDocument
        fields = (
            'id', 'title', 'description', 'image', 'file',
        )


class SiteSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteSettings
        fields = (
            'show_documents_page',
            'hero_title',
            'hero_subtitle',
            'hero_image',
        )