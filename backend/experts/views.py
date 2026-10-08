from rest_framework import generics

from .models import Expert
from .serializers import ExpertSerializer


class ExpertListView(generics.ListAPIView):
    serializer_class = ExpertSerializer

    def get_queryset(self):
        return (
            Expert.objects
            .filter(is_active=True)
            .prefetch_related(
                'positions',
                'specializations',
                'documents',
            )
        )


class ExpertDetailView(generics.RetrieveAPIView):
    serializer_class = ExpertSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return (
            Expert.objects
            .filter(is_active=True)
            .prefetch_related(
                'positions',
                'specializations',
                'documents',
            )
        )
