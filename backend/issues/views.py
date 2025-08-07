from rest_framework import generics, status, permissions, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.db.models import Q, F
from .models import Issue, IssueVote, AdminResponse, InternalNote
from .serializers import (
    IssueSerializer, IssueCreateSerializer, IssueVoteSerializer,
    AdminResponseCreateSerializer, InternalNoteCreateSerializer
)
from .filters import IssueFilter


class IssueViewSet(viewsets.ModelViewSet):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer


class IssueListCreateView(generics.ListCreateAPIView):
    queryset = Issue.objects.all()
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = IssueFilter
    search_fields = ['title', 'description', 'county', 'constituency', 'ward']
    ordering_fields = ['created_at', 'updated_at', 'upvotes', 'severity']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return IssueCreateSerializer
        return IssueSerializer
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

class IssueDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Issue.objects.all()
    serializer_class = IssueSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]
    
    def update(self, request, *args, **kwargs):
        issue = self.get_object()
        user = request.user
        
        # Only allow admins/moderators or issue owner to update
        if not (user.role in ['admin', 'moderator'] or issue.submitted_by == user):
            return Response(
                {'error': 'You do not have permission to update this issue'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        return super().update(request, *args, **kwargs)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def vote_issue(request, pk):
    try:
        issue = Issue.objects.get(pk=pk)
    except Issue.DoesNotExist:
        return Response({'error': 'Issue not found'}, status=status.HTTP_404_NOT_FOUND)
    
    vote_type = request.data.get('vote_type')
    if vote_type not in ['up', 'down']:
        return Response({'error': 'Invalid vote type'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Check if user already voted
    existing_vote = IssueVote.objects.filter(issue=issue, user=request.user).first()
    
    if existing_vote:
        if existing_vote.vote_type == vote_type:
            # Remove vote if same type
            existing_vote.delete()
            if vote_type == 'up':
                issue.upvotes = F('upvotes') - 1
            else:
                issue.downvotes = F('downvotes') - 1
            issue.save()
            return Response({'message': 'Vote removed'})
        else:
            # Change vote type
            existing_vote.vote_type = vote_type
            existing_vote.save()
            if vote_type == 'up':
                issue.upvotes = F('upvotes') + 1
                issue.downvotes = F('downvotes') - 1
            else:
                issue.downvotes = F('downvotes') + 1
                issue.upvotes = F('upvotes') - 1
            issue.save()
            return Response({'message': 'Vote updated'})
    else:
        # Create new vote
        IssueVote.objects.create(issue=issue, user=request.user, vote_type=vote_type)
        if vote_type == 'up':
            issue.upvotes = F('upvotes') + 1
        else:
            issue.downvotes = F('downvotes') + 1
        issue.save()
        return Response({'message': 'Vote recorded'})

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_admin_response(request, pk):
    try:
        issue = Issue.objects.get(pk=pk)
    except Issue.DoesNotExist:
        return Response({'error': 'Issue not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Only admins and moderators can add responses
    if request.user.role not in ['admin', 'moderator']:
        return Response(
            {'error': 'You do not have permission to add responses'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = AdminResponseCreateSerializer(
        data=request.data,
        context={'request': request, 'issue': issue}
    )
    
    if serializer.is_valid():
        # Delete existing response if any
        AdminResponse.objects.filter(issue=issue).delete()
        response = serializer.save()
        
        # Update issue status to pending if it was open
        if issue.status == 'open':
            issue.status = 'pending'
            issue.save()
        
        return Response(AdminResponseSerializer(response).data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_internal_note(request, pk):
    try:
        issue = Issue.objects.get(pk=pk)
    except Issue.DoesNotExist:
        return Response({'error': 'Issue not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Only admins and moderators can add internal notes
    if request.user.role not in ['admin', 'moderator']:
        return Response(
            {'error': 'You do not have permission to add internal notes'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    serializer = InternalNoteCreateSerializer(
        data=request.data,
        context={'request': request, 'issue': issue}
    )
    
    if serializer.is_valid():
        note = serializer.save()
        return Response(InternalNoteSerializer(note).data, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_issue_status(request, pk):
    try:
        issue = Issue.objects.get(pk=pk)
    except Issue.DoesNotExist:
        return Response({'error': 'Issue not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Only admins and moderators can update status
    if request.user.role not in ['admin', 'moderator']:
        return Response(
            {'error': 'You do not have permission to update issue status'},
            status=status.HTTP_403_FORBIDDEN
        )
    
    new_status = request.data.get('status')
    if new_status not in ['open', 'pending', 'resolved', 'closed']:
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
    
    issue.status = new_status
    issue.save()
    
    return Response({'message': 'Status updated successfully'})

class MyIssuesView(generics.ListAPIView):
    serializer_class = IssueSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return Issue.objects.filter(submitted_by=self.request.user)
    
    
from rest_framework.views import APIView

class CategorizeIssueView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        description = request.data.get("description", "")

        if not description:
            return Response({"error": "Description is required"}, status=status.HTTP_400_BAD_REQUEST)

        # Dummy categorization logic (replace with AI later)
        if "health" in description.lower():
            category = "Health"
        elif "road" in description.lower():
            category = "Infrastructure"
        else:
            category = "Other"

        return Response({"category": category}, status=status.HTTP_200_OK)
