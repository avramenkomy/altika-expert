from django.urls import path

from .views import ExpertListView, ExpertDetailView


urlpatterns = [
    path('', ExpertListView.as_view(), name='expert-list'),
    path('<slug:slug>/', ExpertDetailView.as_view(), name='expert-detail'),
]
