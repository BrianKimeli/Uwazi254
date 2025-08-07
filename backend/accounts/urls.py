from django.urls import path
from .views import (
    RegisterView, LoginView, ProfileView, logout_view,
    CountyListView, ConstituencyListView, WardListView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('counties/', CountyListView.as_view(), name='counties'),
    path('constituencies/', ConstituencyListView.as_view(), name='constituencies'),
    path('wards/', WardListView.as_view(), name='wards'),
]