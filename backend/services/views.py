from rest_framework import generics

from .models import Service
from .serializers import ServiceSerializer


class ServiceListView(generics.ListAPIView):
    serializer_class = ServiceSerializer

    def get_queryset(self):
        return Service.objects.filter(is_active=True)


class ServiceDetailView(generics.RetrieveAPIView):
    serializer_class = ServiceSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Service.objects.filter(is_active=True)
