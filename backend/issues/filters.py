import django_filters
from .models import Issue

class IssueFilter(django_filters.FilterSet):
    category = django_filters.ChoiceFilter(choices=Issue.CATEGORY_CHOICES)
    severity = django_filters.ChoiceFilter(choices=Issue.SEVERITY_CHOICES)
    status = django_filters.ChoiceFilter(choices=Issue.STATUS_CHOICES)
    county = django_filters.CharFilter(lookup_expr='icontains')
    constituency = django_filters.CharFilter(lookup_expr='icontains')
    ward = django_filters.CharFilter(lookup_expr='icontains')
    date_from = django_filters.DateFilter(field_name='created_at', lookup_expr='gte')
    date_to = django_filters.DateFilter(field_name='created_at', lookup_expr='lte')
    anonymous = django_filters.BooleanFilter()
    
    class Meta:
        model = Issue
        fields = ['category', 'severity', 'status', 'county', 'constituency', 'ward', 'anonymous']