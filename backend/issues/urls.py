from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CategorizeIssueView 

urlpatterns = [
    path('api/issues/categorize/', CategorizeIssueView.as_view(), name='categorize-issue'),
]
