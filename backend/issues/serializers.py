from rest_framework import serializers
from .models import Issue, IssueImage, AdminResponse, InternalNote, IssueVote, IssueUpdate
from accounts.serializers import UserSerializer

class IssueImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueImage
        fields = ['id', 'image', 'caption', 'uploaded_at']

class AdminResponseSerializer(serializers.ModelSerializer):
    responded_by = UserSerializer(read_only=True)
    
    class Meta:
        model = AdminResponse
        fields = ['id', 'message', 'responded_by', 'is_public', 'created_at', 'updated_at']

class InternalNoteSerializer(serializers.ModelSerializer):
    added_by = UserSerializer(read_only=True)
    
    class Meta:
        model = InternalNote
        fields = ['id', 'note', 'added_by', 'created_at']

class IssueUpdateSerializer(serializers.ModelSerializer):
    updated_by = UserSerializer(read_only=True)
    
    class Meta:
        model = IssueUpdate
        fields = ['id', 'title', 'description', 'updated_by', 'is_public', 'created_at']

class IssueSerializer(serializers.ModelSerializer):
    submitted_by = UserSerializer(read_only=True)
    images = IssueImageSerializer(many=True, read_only=True)
    admin_response = AdminResponseSerializer(read_only=True)
    internal_notes = InternalNoteSerializer(many=True, read_only=True)
    updates = IssueUpdateSerializer(many=True, read_only=True)
    vote_score = serializers.ReadOnlyField()
    user_vote = serializers.SerializerMethodField()
    
    class Meta:
        model = Issue
        fields = [
            'id', 'title', 'description', 'category', 'severity', 'status',
            'county', 'constituency', 'ward', 'location', 'latitude', 'longitude',
            'submitted_by', 'anonymous', 'upvotes', 'downvotes', 'vote_score',
            'ai_confidence', 'ai_tags', 'created_at', 'updated_at',
            'images', 'admin_response', 'internal_notes', 'updates', 'user_vote'
        ]
        read_only_fields = ['id', 'submitted_by', 'upvotes', 'downvotes', 'created_at', 'updated_at']
    
    def get_user_vote(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                vote = IssueVote.objects.get(issue=obj, user=request.user)
                return vote.vote_type
            except IssueVote.DoesNotExist:
                return None
        return None
    
    def create(self, validated_data):
        validated_data['submitted_by'] = self.context['request'].user
        return super().create(validated_data)

class IssueCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Issue
        fields = [
            'title', 'description', 'category', 'severity',
            'county', 'constituency', 'ward', 'location',
            'latitude', 'longitude', 'anonymous'
        ]
    
    def create(self, validated_data):
        validated_data['submitted_by'] = self.context['request'].user
        return super().create(validated_data)

class IssueVoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = IssueVote
        fields = ['vote_type']
    
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        validated_data['issue'] = self.context['issue']
        return super().create(validated_data)

class AdminResponseCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminResponse
        fields = ['message', 'is_public']
    
    def create(self, validated_data):
        validated_data['responded_by'] = self.context['request'].user
        validated_data['issue'] = self.context['issue']
        return super().create(validated_data)

class InternalNoteCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = InternalNote
        fields = ['note']
    
    def create(self, validated_data):
        validated_data['added_by'] = self.context['request'].user
        validated_data['issue'] = self.context['issue']
        return super().create(validated_data)