from rest_framework import serializers

from .models import Service


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
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