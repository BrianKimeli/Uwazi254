from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, County, Constituency, Ward

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'username', 'full_name', 'role', 'county', 'is_verified', 'created_at']
    list_filter = ['role', 'county', 'is_verified', 'created_at']
    search_fields = ['email', 'username', 'first_name', 'last_name']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Additional Info', {
            'fields': ('phone', 'role', 'county', 'constituency', 'ward', 'avatar', 'is_verified')
        }),
    )

@admin.register(County)
class CountyAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'created_at']
    search_fields = ['name', 'code']

@admin.register(Constituency)
class ConstituencyAdmin(admin.ModelAdmin):
    list_display = ['name', 'county', 'created_at']
    list_filter = ['county']
    search_fields = ['name', 'county__name']

@admin.register(Ward)
class WardAdmin(admin.ModelAdmin):
    list_display = ['name', 'constituency', 'created_at']
    list_filter = ['constituency__county']
    search_fields = ['name', 'constituency__name']