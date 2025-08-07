from django.contrib import admin
from .models import AnalyticsSnapshot, CountyAnalytics, CategoryAnalytics

@admin.register(AnalyticsSnapshot)
class AnalyticsSnapshotAdmin(admin.ModelAdmin):
    list_display = [
        'date', 'total_issues', 'open_issues', 'pending_issues',
        'resolved_issues', 'new_issues_today', 'resolved_today'
    ]
    list_filter = ['date']
    ordering = ['-date']

@admin.register(CountyAnalytics)
class CountyAnalyticsAdmin(admin.ModelAdmin):
    list_display = [
        'county', 'date', 'total_issues', 'resolved_issues',
        'resolution_rate', 'avg_resolution_time'
    ]
    list_filter = ['county', 'date']
    ordering = ['-date', 'county']

@admin.register(CategoryAnalytics)
class CategoryAnalyticsAdmin(admin.ModelAdmin):
    list_display = [
        'category', 'date', 'total_issues', 'resolved_issues',
        'avg_resolution_time'
    ]
    list_filter = ['category', 'date']
    ordering = ['-date', 'category']