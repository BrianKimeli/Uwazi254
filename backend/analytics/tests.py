from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from issues.models import Issue

User = get_user_model()

class AnalyticsAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        
        # Create test issues
        Issue.objects.create(
            title='Test Issue 1',
            description='Test description',
            category='roads',
            status='open',
            county='Kiambu',
            constituency='Ruiru',
            ward='Kahawa West',
            submitted_by=self.user
        )
        
        Issue.objects.create(
            title='Test Issue 2',
            description='Test description',
            category='water',
            status='resolved',
            county='Nairobi',
            constituency='Kasarani',
            ward='Mwiki',
            submitted_by=self.user
        )
    
    def test_dashboard_stats(self):
        response = self.client.get('/api/analytics/dashboard/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('total_issues', response.data)
        self.assertIn('resolution_rate', response.data)
        self.assertIn('category_breakdown', response.data)
        self.assertEqual(response.data['total_issues'], 2)
    
    def test_county_analytics(self):
        response = self.client.get('/api/analytics/counties/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # Kiambu and Nairobi
    
    def test_category_analytics(self):
        response = self.client.get('/api/analytics/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)  # roads and water