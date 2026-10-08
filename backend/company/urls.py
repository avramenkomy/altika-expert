from django.urls import path

from .views import (
  CompanyDetailView,
  ExpertiseListView, ExpertiseDetailView,
  ValuationTypeListView, ValuationTypeDetailView,
)


urlpatterns = [
    path('', CompanyDetailView.as_view(), name='company-detail'),

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
]
