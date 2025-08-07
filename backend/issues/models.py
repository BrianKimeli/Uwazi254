from django.db import models
from django.contrib.auth import get_user_model
from accounts.models import County, Constituency, Ward

User = get_user_model()

class Issue(models.Model):
    CATEGORY_CHOICES = [
        ('roads', 'Roads & Infrastructure'),
        ('water', 'Water & Sanitation'),
        ('health', 'Healthcare'),
        ('security', 'Security & Safety'),
        ('corruption', 'Corruption'),
        ('education', 'Education'),
        ('environment', 'Environment'),
        ('housing', 'Housing'),
    ]
    
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('pending', 'Pending'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES, default='medium')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='open')
    
    # Location
    county = models.CharField(max_length=100)
    constituency = models.CharField(max_length=100)
    ward = models.CharField(max_length=100)
    location = models.CharField(max_length=200, blank=True, null=True)
    
    # Coordinates (optional)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, blank=True, null=True)
    
    # User info
    submitted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submitted_issues')
    anonymous = models.BooleanField(default=False)
    
    # Engagement
    upvotes = models.PositiveIntegerField(default=0)
    downvotes = models.PositiveIntegerField(default=0)
    
    # AI categorization
    ai_confidence = models.FloatField(blank=True, null=True)
    ai_tags = models.JSONField(default=list, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} - {self.get_status_display()}"
    
    @property
    def vote_score(self):
        return self.upvotes - self.downvotes

class IssueImage(models.Model):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='issue_images/')
    caption = models.CharField(max_length=200, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Image for {self.issue.title}"

class AdminResponse(models.Model):
    issue = models.OneToOneField(Issue, on_delete=models.CASCADE, related_name='admin_response')
    message = models.TextField()
    responded_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Response to {self.issue.title}"

class InternalNote(models.Model):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='internal_notes')
    note = models.TextField()
    added_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Note on {self.issue.title}"

class IssueVote(models.Model):
    VOTE_CHOICES = [
        ('up', 'Upvote'),
        ('down', 'Downvote'),
    ]
    
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='votes')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    vote_type = models.CharField(max_length=4, choices=VOTE_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ['issue', 'user']
    
    def __str__(self):
        return f"{self.user.username} {self.vote_type}voted {self.issue.title}"

class IssueUpdate(models.Model):
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name='updates')
    title = models.CharField(max_length=200)
    description = models.TextField()
    updated_by = models.ForeignKey(User, on_delete=models.CASCADE)
    is_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Update: {self.title}"