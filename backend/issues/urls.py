from django.urls import path
from .views import (
    IssueListCreateView, IssueDetailView, MyIssuesView,
    vote_issue, add_admin_response, add_internal_note, update_issue_status
)

urlpatterns = [
    path('', IssueListCreateView.as_view(), name='issue-list-create'),
    path('<int:pk>/', IssueDetailView.as_view(), name='issue-detail'),
    path('<int:pk>/vote/', vote_issue, name='vote-issue'),
    path('<int:pk>/response/', add_admin_response, name='add-admin-response'),
    path('<int:pk>/note/', add_internal_note, name='add-internal-note'),
    path('<int:pk>/status/', update_issue_status, name='update-issue-status'),
    path('my-issues/', MyIssuesView.as_view(), name='my-issues'),
]