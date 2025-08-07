from rest_framework import generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Avg, Q
from django.utils import timezone
from datetime import datetime, timedelta
from issues.models import Issue
from .models import AnalyticsSnapshot, CountyAnalytics, CategoryAnalytics
from .serializers import (
    AnalyticsSnapshotSerializer, CountyAnalyticsSerializer,
    CategoryAnalyticsSerializer, DashboardStatsSerializer
)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def dashboard_stats(request):
    """Get comprehensive dashboard statistics"""
    
    # Basic counts
    total_issues = Issue.objects.count()
    open_issues = Issue.objects.filter(status='open').count()
    pending_issues = Issue.objects.filter(status='pending').count()
    resolved_issues = Issue.objects.filter(status='resolved').count()
    closed_issues = Issue.objects.filter(status='closed').count()
    
    # Resolution rate
    resolution_rate = (resolved_issues / total_issues * 100) if total_issues > 0 else 0
    
    # Average resolution time (mock calculation)
    avg_resolution_time = 5.2  # days
    
    # Category breakdown
    category_breakdown = dict(
        Issue.objects.values('category').annotate(count=Count('id')).values_list('category', 'count')
    )
    
    # County breakdown
    county_breakdown = dict(
        Issue.objects.values('county').annotate(count=Count('id')).values_list('county', 'count')
    )
    
    # Severity breakdown
    severity_breakdown = dict(
        Issue.objects.values('severity').annotate(count=Count('id')).values_list('severity', 'count')
    )
    
    # Monthly trends (last 6 months)
    monthly_trends = []
    for i in range(6):
        date = timezone.now() - timedelta(days=30*i)
        month_start = date.replace(day=1)
        month_end = (month_start + timedelta(days=32)).replace(day=1) - timedelta(days=1)
        
        issues_count = Issue.objects.filter(
            created_at__gte=month_start,
            created_at__lte=month_end
        ).count()
        
        resolved_count = Issue.objects.filter(
            created_at__gte=month_start,
            created_at__lte=month_end,
            status='resolved'
        ).count()
        
        monthly_trends.append({
            'month': date.strftime('%B %Y'),
            'issues': issues_count,
            'resolved': resolved_count
        })
    
    monthly_trends.reverse()
    
    # Recent activity
    recent_activity = []
    recent_issues = Issue.objects.order_by('-updated_at')[:10]
    for issue in recent_issues:
        recent_activity.append({
            'id': issue.id,
            'title': issue.title,
            'status': issue.status,
            'county': issue.county,
            'ward': issue.ward,
            'updated_at': issue.updated_at,
            'category': issue.category
        })
    
    data = {
        'total_issues': total_issues,
        'open_issues': open_issues,
        'pending_issues': pending_issues,
        'resolved_issues': resolved_issues,
        'closed_issues': closed_issues,
        'resolution_rate': round(resolution_rate, 2),
        'avg_resolution_time': avg_resolution_time,
        'category_breakdown': category_breakdown,
        'county_breakdown': county_breakdown,
        'severity_breakdown': severity_breakdown,
        'monthly_trends': monthly_trends,
        'recent_activity': recent_activity
    }
    
    serializer = DashboardStatsSerializer(data)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def county_analytics(request):
    """Get analytics by county"""
    county = request.query_params.get('county')
    
    queryset = Issue.objects.all()
    if county:
        queryset = queryset.filter(county__icontains=county)
    
    # County statistics
    county_stats = queryset.values('county').annotate(
        total=Count('id'),
        resolved=Count('id', filter=Q(status='resolved')),
        pending=Count('id', filter=Q(status='pending')),
        open=Count('id', filter=Q(status='open'))
    ).order_by('-total')
    
    return Response(list(county_stats))

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def category_analytics(request):
    """Get analytics by category"""
    category = request.query_params.get('category')
    
    queryset = Issue.objects.all()
    if category:
        queryset = queryset.filter(category=category)
    
    # Category statistics
    category_stats = queryset.values('category').annotate(
        total=Count('id'),
        resolved=Count('id', filter=Q(status='resolved')),
        pending=Count('id', filter=Q(status='pending')),
        open=Count('id', filter=Q(status='open')),
        critical=Count('id', filter=Q(severity='critical')),
        high=Count('id', filter=Q(severity='high'))
    ).order_by('-total')
    
    return Response(list(category_stats))

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def trends_analytics(request):
    """Get trend analytics"""
    days = int(request.query_params.get('days', 30))
    end_date = timezone.now().date()
    start_date = end_date - timedelta(days=days)
    
    # Daily issue counts
    daily_stats = []
    current_date = start_date
    
    while current_date <= end_date:
        issues_count = Issue.objects.filter(
            created_at__date=current_date
        ).count()
        
        resolved_count = Issue.objects.filter(
            updated_at__date=current_date,
            status='resolved'
        ).count()
        
        daily_stats.append({
            'date': current_date.isoformat(),
            'issues': issues_count,
            'resolved': resolved_count
        })
        
        current_date += timedelta(days=1)
    
    return Response(daily_stats)

class AnalyticsSnapshotListView(generics.ListAPIView):
    queryset = AnalyticsSnapshot.objects.all()
    serializer_class = AnalyticsSnapshotSerializer
    permission_classes = [permissions.AllowAny]

class CountyAnalyticsListView(generics.ListAPIView):
    queryset = CountyAnalytics.objects.all()
    serializer_class = CountyAnalyticsSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = CountyAnalytics.objects.all()
        county = self.request.query_params.get('county')
        if county:
            queryset = queryset.filter(county__icontains=county)
        return queryset

class CategoryAnalyticsListView(generics.ListAPIView):
    queryset = CategoryAnalytics.objects.all()
    serializer_class = CategoryAnalyticsSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = CategoryAnalytics.objects.all()
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        return queryset