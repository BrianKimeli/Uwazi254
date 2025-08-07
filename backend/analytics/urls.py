from django.urls import path
from .views import (
    dashboard_stats, county_analytics, category_analytics, trends_analytics,
    AnalyticsSnapshotListView, CountyAnalyticsListView, CategoryAnalyticsListView
)

urlpatterns = [
    path('dashboard/', dashboard_stats, name='dashboard-stats'),
    path('counties/', county_analytics, name='county-analytics'),
    path('categories/', category_analytics, name='category-analytics'),
    path('trends/', trends_analytics, name='trends-analytics'),
    path('snapshots/', AnalyticsSnapshotListView.as_view(), name='analytics-snapshots'),
    path('county-stats/', CountyAnalyticsListView.as_view(), name='county-stats'),
    path('category-stats/', CategoryAnalyticsListView.as_view(), name='category-stats'),
]