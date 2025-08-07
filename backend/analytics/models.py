from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class AnalyticsSnapshot(models.Model):
    """Daily analytics snapshot for performance"""
    date = models.DateField(unique=True)
    total_issues = models.PositiveIntegerField(default=0)
    open_issues = models.PositiveIntegerField(default=0)
    pending_issues = models.PositiveIntegerField(default=0)
    resolved_issues = models.PositiveIntegerField(default=0)
    closed_issues = models.PositiveIntegerField(default=0)
    new_issues_today = models.PositiveIntegerField(default=0)
    resolved_today = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"Analytics for {self.date}"

class CountyAnalytics(models.Model):
    """County-specific analytics"""
    county = models.CharField(max_length=100)
    date = models.DateField()
    total_issues = models.PositiveIntegerField(default=0)
    resolved_issues = models.PositiveIntegerField(default=0)
    resolution_rate = models.FloatField(default=0.0)
    avg_resolution_time = models.FloatField(default=0.0)  # in days
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['county', 'date']
        ordering = ['-date', 'county']
    
    def __str__(self):
        return f"{self.county} - {self.date}"

class CategoryAnalytics(models.Model):
    """Category-specific analytics"""
    category = models.CharField(max_length=20)
    date = models.DateField()
    total_issues = models.PositiveIntegerField(default=0)
    resolved_issues = models.PositiveIntegerField(default=0)
    avg_resolution_time = models.FloatField(default=0.0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['category', 'date']
        ordering = ['-date', 'category']
    
    def __str__(self):
        return f"{self.category} - {self.date}"