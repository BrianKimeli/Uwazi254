from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, County, Constituency, Ward

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name', 
            'phone', 'county', 'constituency', 'ward', 
            'password', 'password_confirm'
        ]
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email and password')
        
        return attrs

class UserSerializer(serializers.ModelSerializer):
    full_name = serializers.ReadOnlyField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name', 
            'full_name', 'phone', 'role', 'county', 'constituency', 
            'ward', 'avatar', 'is_verified', 'created_at'
        ]
        read_only_fields = ['id', 'role', 'is_verified', 'created_at']

class CountySerializer(serializers.ModelSerializer):
    class Meta:
        model = County
        fields = ['id', 'name', 'code']

class ConstituencySerializer(serializers.ModelSerializer):
    county_name = serializers.CharField(source='county.name', read_only=True)
    
    class Meta:
        model = Constituency
        fields = ['id', 'name', 'county', 'county_name']

class WardSerializer(serializers.ModelSerializer):
    constituency_name = serializers.CharField(source='constituency.name', read_only=True)
    county_name = serializers.CharField(source='constituency.county.name', read_only=True)
    
    class Meta:
        model = Ward
        fields = ['id', 'name', 'constituency', 'constituency_name', 'county_name']