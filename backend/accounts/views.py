from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, County, Constituency, Ward
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, UserSerializer,
    CountySerializer, ConstituencySerializer, WardSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)

class LoginView(generics.GenericAPIView):
    serializer_class = UserLoginSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data["refresh"]
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)

class CountyListView(generics.ListAPIView):
    queryset = County.objects.all()
    serializer_class = CountySerializer
    permission_classes = [permissions.AllowAny]

class ConstituencyListView(generics.ListAPIView):
    queryset = Constituency.objects.all()
    serializer_class = ConstituencySerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Constituency.objects.all()
        county_id = self.request.query_params.get('county', None)
        if county_id is not None:
            queryset = queryset.filter(county_id=county_id)
        return queryset

class WardListView(generics.ListAPIView):
    queryset = Ward.objects.all()
    serializer_class = WardSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = Ward.objects.all()
        constituency_id = self.request.query_params.get('constituency', None)
        if constituency_id is not None:
            queryset = queryset.filter(constituency_id=constituency_id)
        return queryset