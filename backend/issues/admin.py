from django.contrib import admin
from .models import Issue, IssueImage, AdminResponse, InternalNote, IssueVote, IssueUpdate

class IssueImageInline(admin.TabularInline):
    model = IssueImage
    extra = 0

class InternalNoteInline(admin.TabularInline):
    model = InternalNote
    extra = 0
    readonly_fields = ['added_by', 'created_at']

@admin.register(Issue)
class IssueAdmin(admin.ModelAdmin):
    list_display = [
        'title', 'category', 'severity', 'status', 'county', 
        'submitted_by', 'anonymous', 'upvotes', 'created_at'
    ]
    list_filter = [
        'category', 'severity', 'status', 'county', 'anonymous', 'created_at'
    ]
    search_fields = ['title', 'description', 'county', 'constituency', 'ward']
    readonly_fields = ['submitted_by', 'upvotes', 'downvotes', 'created_at', 'updated_at']
    inlines = [IssueImageInline, InternalNoteInline]
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'description', 'category', 'severity', 'status')
        }),
        ('Location', {
            'fields': ('county', 'constituency', 'ward', 'location', 'latitude', 'longitude')
        }),
        ('User Information', {
            'fields': ('submitted_by', 'anonymous')
        }),
        ('Engagement', {
            'fields': ('upvotes', 'downvotes')
        }),
        ('AI Data', {
            'fields': ('ai_confidence', 'ai_tags'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(AdminResponse)
class AdminResponseAdmin(admin.ModelAdmin):
    list_display = ['issue', 'responded_by', 'is_public', 'created_at']
    list_filter = ['is_public', 'created_at']
    search_fields = ['issue__title', 'message']

@admin.register(IssueVote)
class IssueVoteAdmin(admin.ModelAdmin):
    list_display = ['issue', 'user', 'vote_type', 'created_at']
    list_filter = ['vote_type', 'created_at']

@admin.register(IssueUpdate)
class IssueUpdateAdmin(admin.ModelAdmin):
    list_display = ['title', 'issue', 'updated_by', 'is_public', 'created_at']
    list_filter = ['is_public', 'created_at']