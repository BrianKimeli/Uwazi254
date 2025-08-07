from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import County, Constituency, Ward
from issues.models import Issue, AdminResponse
from datetime import datetime, timedelta
import random

User = get_user_model()

class Command(BaseCommand):
    help = 'Populate database with sample data for demo'
    
    def handle(self, *args, **options):
        self.stdout.write('Creating sample data...')
        
        # Create counties
        counties_data = [
            {'name': 'Kiambu', 'code': '022'},
            {'name': 'Nairobi', 'code': '047'},
            {'name': 'Nakuru', 'code': '032'},
            {'name': 'Mombasa', 'code': '001'},
            {'name': 'Kisumu', 'code': '042'},
        ]
        
        for county_data in counties_data:
            county, created = County.objects.get_or_create(**county_data)
            if created:
                self.stdout.write(f'Created county: {county.name}')
        
        # Create constituencies and wards for Kiambu
        kiambu = County.objects.get(name='Kiambu')
        constituencies_data = [
            {
                'name': 'Ruiru',
                'wards': ['Kahawa West', 'Kahawa Sukari', 'Biashara', 'Gitothua']
            },
            {
                'name': 'Kiambu',
                'wards': ['Township', 'Riabai', 'Ndumberi', 'Tinganga']
            }
        ]
        
        for const_data in constituencies_data:
            constituency, created = Constituency.objects.get_or_create(
                name=const_data['name'],
                county=kiambu
            )
            if created:
                self.stdout.write(f'Created constituency: {constituency.name}')
            
            for ward_name in const_data['wards']:
                ward, created = Ward.objects.get_or_create(
                    name=ward_name,
                    constituency=constituency
                )
                if created:
                    self.stdout.write(f'Created ward: {ward.name}')
        
        # Create sample users
        users_data = [
            {
                'username': 'john_citizen',
                'email': 'john@citizen.com',
                'first_name': 'John',
                'last_name': 'Mwangi',
                'role': 'citizen',
                'county': 'Kiambu',
                'constituency': 'Ruiru',
                'ward': 'Kahawa West',
                'phone': '+254712345678'
            },
            {
                'username': 'admin_kiambu',
                'email': 'admin@kiambu.gov.ke',
                'first_name': 'Mary',
                'last_name': 'Wanjiku',
                'role': 'admin',
                'county': 'Kiambu',
                'phone': '+254720123456'
            },
            {
                'username': 'moderator_uwazi',
                'email': 'moderator@uwazi254.com',
                'first_name': 'Peter',
                'last_name': 'Ochieng',
                'role': 'moderator',
                'county': 'Nairobi',
                'phone': '+254733987654'
            }
        ]
        
        for user_data in users_data:
            user, created = User.objects.get_or_create(
                email=user_data['email'],
                defaults=user_data
            )
            if created:
                user.set_password('password')
                user.save()
                self.stdout.write(f'Created user: {user.email}')
        
        # Create sample issues
        citizen = User.objects.get(email='john@citizen.com')
        admin = User.objects.get(email='admin@kiambu.gov.ke')
        
        issues_data = [
            {
                'title': 'Water shortage in Kahawa West',
                'description': 'There has been no water supply in Kahawa West for the past 2 weeks. Residents are forced to buy water from vendors at very high prices. This is affecting daily activities and businesses in the area.',
                'category': 'water',
                'severity': 'high',
                'status': 'pending',
                'county': 'Kiambu',
                'constituency': 'Ruiru',
                'ward': 'Kahawa West',
                'location': 'Kahawa West Shopping Center',
                'submitted_by': citizen,
                'upvotes': 127,
                'downvotes': 3,
                'response': 'We have identified a burst pipe that is causing the water shortage. Our technical team is working on repairs and water supply should resume within 48 hours.'
            },
            {
                'title': 'Dangerous potholes on Thika Road',
                'description': 'Large potholes have developed on the main Thika Road near Kahawa Sukari. These are causing accidents and damaging vehicles. Emergency repairs are needed.',
                'category': 'roads',
                'severity': 'high',
                'status': 'open',
                'county': 'Kiambu',
                'constituency': 'Ruiru',
                'ward': 'Biashara',
                'submitted_by': citizen,
                'anonymous': True,
                'upvotes': 89,
                'downvotes': 1
            },
            {
                'title': 'Poor street lighting increases crime',
                'description': 'Street lights have been broken for months in Mwiki area. This has made the area unsafe at night with increased cases of muggings and theft.',
                'category': 'security',
                'severity': 'critical',
                'status': 'resolved',
                'county': 'Nairobi',
                'constituency': 'Kasarani',
                'ward': 'Mwiki',
                'submitted_by': citizen,
                'upvotes': 156,
                'downvotes': 2,
                'response': 'New LED street lights have been installed and are now operational. We have also increased police patrols in the area.'
            },
            {
                'title': 'Garbage collection delays in Eastleigh',
                'description': 'Garbage has not been collected for over a week in Eastleigh North. The accumulating waste is becoming a health hazard.',
                'category': 'environment',
                'severity': 'medium',
                'status': 'pending',
                'county': 'Nairobi',
                'constituency': 'Kamukunji',
                'ward': 'Eastleigh North',
                'submitted_by': citizen,
                'upvotes': 45,
                'downvotes': 0
            },
            {
                'title': 'Understaffed health center',
                'description': 'Kiambu Health Center is severely understaffed. Patients wait for hours and some are turned away. More medical staff needed urgently.',
                'category': 'health',
                'severity': 'high',
                'status': 'open',
                'county': 'Kiambu',
                'constituency': 'Kiambu',
                'ward': 'Township',
                'submitted_by': citizen,
                'upvotes': 78,
                'downvotes': 1
            }
        ]
        
        for issue_data in issues_data:
            response_text = issue_data.pop('response', None)
            issue, created = Issue.objects.get_or_create(
                title=issue_data['title'],
                defaults=issue_data
            )
            
            if created:
                # Set random creation date within last 30 days
                days_ago = random.randint(1, 30)
                issue.created_at = datetime.now() - timedelta(days=days_ago)
                issue.save()
                
                # Add admin response if provided
                if response_text:
                    AdminResponse.objects.create(
                        issue=issue,
                        message=response_text,
                        responded_by=admin,
                        is_public=True
                    )
                
                self.stdout.write(f'Created issue: {issue.title}')
        
        self.stdout.write(
            self.style.SUCCESS('Successfully populated database with sample data!')
        )