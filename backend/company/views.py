from rest_framework import generics

from .models import (
    Company,
    CompanyAdvantage,
    Expertise,
    ValuationType,
    ProcessStep,
    UseCase,
    CompanyDocument,
    SiteSettings,
)
from .serializers import (
  CompanySerializer,
  CompanyAdvantageSerializer,
  ExpertiseSerializer,
  ValuationTypeSerializer,
  ProcessStepSerializer,
  UseCaseSerializer,
  CompanyDocumentSerializer,
  SiteSettingsSerializer,
)


class CompanyDetailView(generics.RetrieveAPIView):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get_object(self):
        return Company.objects.first()


class CompanyAdvantageListView(generics.ListAPIView):
    serializer_class = CompanyAdvantageSerializer

    def get_queryset(self):
        return CompanyAdvantage.objects.filter(is_active=True)


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


class ProcessStepListView(generics.ListAPIView):
    serializer_class = ProcessStepSerializer

    def get_queryset(self):
        return ProcessStep.objects.filter(
            process_type=self.kwargs['process_type'],
            is_active=True,
        )


class UseCaseListView(generics.ListAPIView):
    serializer_class = UseCaseSerializer

    def get_queryset(self):
        return UseCase.objects.filter(is_active=True)


class CompanyDocumentListView(generics.ListAPIView):
    serializer_class = CompanyDocumentSerializer

    def get_queryset(self):
        return CompanyDocument.objects.filter(is_active=True)


class SiteSettingsDetailView(generics.RetrieveAPIView):
    serializer_class = SiteSettingsSerializer

    def get_object(self):
        return SiteSettings.objects.first()
