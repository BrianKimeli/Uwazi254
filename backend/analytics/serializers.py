from rest_framework import serializers
from .models import AnalyticsSnapshot, CountyAnalytics, CategoryAnalytics

class AnalyticsSnapshotSerializer(serializers.ModelSerializer):
    resolution_rate = serializers.SerializerMethodField()
    
    class Meta:
        model = AnalyticsSnapshot
        fields = [
            'date', 'total_issues', 'open_issues', 'pending_issues',
            'resolved_issues', 'closed_issues', 'new_issues_today',
            'resolved_today', 'resolution_rate'
        ]
    
    def get_resolution_rate(self, obj):
        if obj.total_issues > 0:
            return round((obj.resolved_issues / obj.total_issues) * 100, 2)
        return 0.0

class CountyAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CountyAnalytics
        fields = [
            'county', 'date', 'total_issues', 'resolved_issues',
            'resolution_rate', 'avg_resolution_time'
        ]

class CategoryAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryAnalytics
        fields = [
            'category', 'date', 'total_issues', 'resolved_issues',
            'avg_resolution_time'
        ]

class DashboardStatsSerializer(serializers.Serializer):
    total_issues = serializers.IntegerField()
    open_issues = serializers.IntegerField()
    pending_issues = serializers.IntegerField()
    resolved_issues = serializers.IntegerField()
    closed_issues = serializers.IntegerField()
    resolution_rate = serializers.FloatField()
    avg_resolution_time = serializers.FloatField()
    category_breakdown = serializers.DictField()
    county_breakdown = serializers.DictField()
    severity_breakdown = serializers.DictField()
    monthly_trends = serializers.ListField()
    recent_activity = serializers.ListField()