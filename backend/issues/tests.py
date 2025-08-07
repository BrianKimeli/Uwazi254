from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Issue

User = get_user_model()

class IssueModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_issue(self):
        issue = Issue.objects.create(
            title='Test Issue',
            description='Test description',
            category='roads',
            severity='high',
            county='Kiambu',
            constituency='Ruiru',
            ward='Kahawa West',
            submitted_by=self.user
        )
        self.assertEqual(issue.title, 'Test Issue')
        self.assertEqual(issue.status, 'open')
        self.assertEqual(issue.vote_score, 0)

class IssueAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
    
    def test_create_issue_authenticated(self):
        self.client.force_authenticate(user=self.user)
        data = {
            'title': 'Test Issue',
            'description': 'Test description',
            'category': 'roads',
            'severity': 'high',
            'county': 'Kiambu',
            'constituency': 'Ruiru',
            'ward': 'Kahawa West'
        }
        response = self.client.post('/api/issues/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_list_issues_public(self):
        # Create an issue first
        Issue.objects.create(
            title='Test Issue',
            description='Test description',
            category='roads',
            county='Kiambu',
            constituency='Ruiru',
            ward='Kahawa West',
            submitted_by=self.user
        )
        
        response = self.client.get('/api/issues/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)