from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    
    This serializer handles the creation of new user accounts. It:
    1. Validates the input data (email, password, etc.)
    2. Ensures passwords meet security requirements
    3. Creates a new user account
    
    Fields:
    - email: User's email address (must be unique)
    - password: User's password (must meet security requirements)
    - password2: Password confirmation (must match password)
    - first_name: User's first name
    - last_name: User's last name
    """
    
    # password2 is used for password confirmation
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        help_text='Enter the same password again for verification'
    )
    
    class Meta:
        model = User
        fields = ('email', 'password', 'password2', 'first_name', 'last_name')
        extra_kwargs = {
            'password': {
                'write_only': True,  # Password will never be sent in responses
                'style': {'input_type': 'password'}  # Shows as password field in browsable API
            },
            'email': {
                'required': True
            }
        }
    
    def validate_email(self, value):
        """
        Validate that the email is unique
        
        Args:
            value (str): The email to validate
            
        Returns:
            str: The validated email
            
        Raises:
            serializers.ValidationError: If email is already in use
        """
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This email is already registered")
        return value
    
    def validate_password(self, value):
        """
        Validate the password using Django's password validators
        
        Args:
            value (str): The password to validate
            
        Returns:
            str: The validated password
            
        Raises:
            serializers.ValidationError: If password doesn't meet requirements
        """
        # Use Django's built-in password validation
        validate_password(value)
        return value
    
    def validate(self, data):
        """
        Check that the passwords match
        
        Args:
            data (dict): The data to validate
            
        Returns:
            dict: The validated data
            
        Raises:
            serializers.ValidationError: If passwords don't match
        """
        if data['password'] != data['password2']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match"
            })
        return data
    
    def create(self, validated_data):
        """
        Create a new user with encrypted password
        
        Args:
            validated_data (dict): The validated user data
            
        Returns:
            User: The newly created user
        """
        # Remove password2 from the data as we don't need it anymore
        validated_data.pop('password2')
        
        # Create the user account
        user = User.objects.create_user(
            username=validated_data['email'],  # Use email as username
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        
        return user

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile data
    
    This serializer is used for:
    1. Viewing user profile information
    2. Updating user profile data
    
    Note: This serializer does NOT handle password changes
    """
    
    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name')
        read_only_fields = ('email',)  # Email cannot be changed

class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for password change
    
    This serializer handles password changes for existing users. It:
    1. Validates the old password
    2. Ensures the new password meets security requirements
    3. Updates the user's password
    """
    
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    new_password2 = serializers.CharField(required=True)
    
    def validate_old_password(self, value):
        """
        Verify the old password is correct
        
        Args:
            value (str): The old password to verify
            
        Returns:
            str: The validated old password
            
        Raises:
            serializers.ValidationError: If old password is incorrect
        """
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError(
                "Your old password was entered incorrectly"
            )
        return value
    
    def validate_new_password(self, value):
        """
        Validate the new password using Django's password validators
        
        Args:
            value (str): The new password to validate
            
        Returns:
            str: The validated new password
            
        Raises:
            serializers.ValidationError: If password doesn't meet requirements
        """
        validate_password(value)
        return value
    
    def validate(self, data):
        """
        Check that the new passwords match
        
        Args:
            data (dict): The data to validate
            
        Returns:
            dict: The validated data
            
        Raises:
            serializers.ValidationError: If new passwords don't match
        """
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError({
                "new_password": "Password fields didn't match"
            })
        return data

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom token serializer that adds user data to the token response
    
    This serializer:
    1. Generates access and refresh tokens
    2. Adds user profile data to the response
    """
    
    def validate(self, attrs):
        # Get the token data from the parent class
        data = super().validate(attrs)
        
        # Add user profile data to the response
        data.update({
            'user': {
                'id': self.user.id,
                'email': self.user.email,
                'first_name': self.user.first_name,
                'last_name': self.user.last_name
            }
        })
        
        return data

class PasswordResetSerializer(serializers.Serializer):
    """
    Serializer for password reset requests
    
    This serializer handles the initial password reset request. It:
    1. Validates the email address exists
    2. Returns the validated email for processing
    """
    email = serializers.EmailField(required=True)

    def validate_email(self, value):
        """
        Validate that the email exists in the system
        """
        try:
            user = User.objects.get(email=value)
        except User.DoesNotExist:
            raise serializers.ValidationError("No user found with this email address.")
        return value


class PasswordResetConfirmSerializer(serializers.Serializer):
    """
    Serializer for password reset confirmation
    
    This serializer handles the password reset confirmation. It:
    1. Validates the reset token and user ID
    2. Ensures the new password meets requirements
    """
    uid = serializers.CharField(required=True)
    token = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

    def validate_new_password(self, value):
        """
        Validate the new password using Django's password validators
        """
        validate_password(value)
        return value
