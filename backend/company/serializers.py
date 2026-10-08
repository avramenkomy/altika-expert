from rest_framework import serializers
from .models import Company, Expertise, ValuationType


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
            'phone',
            'email',
            'telegram',
            'whatsapp',
            'address',
            'working_hours',
            'latitude',
            'longitude',
        )


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
            'price_from',
            'seo_title',
            'seo_description',
        )