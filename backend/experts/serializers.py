from rest_framework import serializers

from .models import Position, Expert, ExpertDocument, Specialization

class PositionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Position
        fields = (
            'id',
            'title',
        )


class SpecializationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialization
        fields = (
            'id',
            'title',
        )


class ExpertDocumentSerializer(serializers.ModelSerializer):
    document_type_display = serializers.CharField(
        source='get_document_type_display',
        read_only=True,
    )

    class Meta:
        model = ExpertDocument
        fields = (
            'id',
            'title',
            'document_type',
            'document_type_display',
            'image',
        )


class ExpertSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(read_only=True)

    positions = PositionSerializer(
        many=True,
        read_only=True,
    )

    specializations = SpecializationSerializer(
        many=True,
        read_only=True,
    )

    documents = serializers.SerializerMethodField()

    class Meta:
        model = Expert
        fields = (
            'id',
            'full_name',
            'slug',
            'photo',
            'positions',
            'specializations',
            'education',
            'experience',
            'qualification',
            'biography',
            'documents',
            'seo_title',
            'seo_description',
        )

    def get_documents(self, obj):
        documents = obj.documents.filter(is_active=True)

        return ExpertDocumentSerializer(
            documents,
            many=True,
            context=self.context
        ).data