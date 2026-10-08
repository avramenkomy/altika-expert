from rest_framework import generics

from .models import Company, Expertise, ValuationType
from .serializers import (
  CompanySerializer, ExpertiseSerializer, ValuationTypeSerializer
)


class CompanyDetailView(generics.RetrieveAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get_object(self):
        return Company.objects.first()


class ExpertiseListView(generics.ListAPIView):
    serializer_class = ExpertiseSerializer

    def get_queryset(self):
        return Expertise.objects.filter(is_active=True)


class ExpertiseDetailView(generics.RetrieveAPIView):
    serializer_class = ExpertiseSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Expertise.objects.filter(is_active=True)


class ValuationTypeListView(generics.ListAPIView):
    serializer_class = ValuationTypeSerializer

    def get_queryset(self):
        return ValuationType.objects.filter(is_active=True)


class ValuationTypeDetailView(generics.RetrieveAPIView):
    serializer_class = ValuationTypeSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return ValuationType.objects.filter(is_active=True)
