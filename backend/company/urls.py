from django.urls import path

from .views import (
  CompanyDetailView, CompanyAdvantageListView,
  ExpertiseListView, ExpertiseDetailView,
  ValuationTypeListView, ValuationTypeDetailView,
  ProcessStepListView, UseCaseListView, CompanyDocumentListView,
  SiteSettingsDetailView,
)


urlpatterns = [
    path('', CompanyDetailView.as_view(), name='company-detail'),
    path(
        'advantages/',
        CompanyAdvantageListView.as_view(),
        name='company-advantage-list'
    ),

    path('expertises/', ExpertiseListView.as_view(), name='expertise-list'),
    path(
        'expertises/<slug:slug>/',
        ExpertiseDetailView.as_view(),
        name='expertise-detail'
    ),

    path('valuation/', ValuationTypeListView.as_view(), name='valuation-list'),
    path(
        'valuation/<slug:slug>/',
        ValuationTypeDetailView.as_view(),
        name='valuation-detail'
    ),
    path(
      'processes/<str:process_type>/',
      ProcessStepListView.as_view(),
      name='process-step-list'
    ),
    path(
      'use-cases/',
      UseCaseListView.as_view(),
      name='use-case-list'
    ),
    path(
      'documents/',
      CompanyDocumentListView.as_view(),
      name='company-document-list',
    ),
    path(
      'settings/',
      SiteSettingsDetailView.as_view(),
      name='site-settings',
    )
]
