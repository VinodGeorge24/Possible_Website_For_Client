from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.conf import settings
from .serializers import (
    RegisterSerializer,
    UserSerializer,
    ChangePasswordSerializer,
    CustomTokenObtainPairSerializer,
    PasswordResetSerializer,
    PasswordResetConfirmSerializer
)

class RegisterView(generics.CreateAPIView):
    """
    API endpoint for user registration
    
    This view allows new users to create an account. It:
    1. Validates the registration data
    2. Creates a new user account
    3. Returns the user data (excluding password)
    
    URL: /api/auth/register/
    Method: POST
    
    Example request body:
    {
        "email": "user@example.com",
        "password": "secure_password123",
        "password2": "secure_password123",
        "first_name": "John",
        "last_name": "Doe"
    }
    """
    
    permission_classes = (AllowAny,)  # Anyone can register
    serializer_class = RegisterSerializer
    
    def create(self, request, *args, **kwargs):
        """
        Handle the registration process
        
        Steps:
        1. Validate the input data
        2. Create the user account
        3. Return success response
        
        Returns:
            Response: JSON response with user data or error messages
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Return user data in response
        return Response({
            "user": UserSerializer(user).data,
            "message": "User registered successfully"
        }, status=status.HTTP_201_CREATED)

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    API endpoint for user login
    
    This view handles user authentication and returns JWT tokens. It:
    1. Validates user credentials
    2. Generates access and refresh tokens
    3. Returns tokens along with user data
    
    URL: /api/auth/login/
    Method: POST
    
    Example request body:
    {
        "email": "user@example.com",
        "password": "secure_password123"
    }
    """
    
    serializer_class = CustomTokenObtainPairSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    API endpoint for viewing and updating user profile
    
    This view allows users to:
    1. View their profile information
    2. Update their profile details (except email)
    
    URL: /api/auth/profile/
    Methods: GET, PATCH
    
    Example PATCH request body:
    {
        "first_name": "John",
        "last_name": "Smith"
    }
    """
    
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer
    
    def get_object(self):
        """
        Get the user object for the current request
        
        Returns:
            User: The authenticated user
        """
        return self.request.user

class ChangePasswordView(generics.UpdateAPIView):
    """
    API endpoint for changing password
    
    This view allows users to change their password. It:
    1. Validates the old password
    2. Ensures the new password meets requirements
    3. Updates the password
    
    URL: /api/auth/change-password/
    Method: PATCH
    
    Example request body:
    {
        "old_password": "old_password123",
        "new_password": "new_password123",
        "new_password2": "new_password123"
    }
    """
    
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer
    
    def get_object(self):
        """
        Get the user object for the current request
        
        Returns:
            User: The authenticated user
        """
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        """
        Handle the password change process
        
        Steps:
        1. Validate the input data
        2. Update the password
        3. Return success response
        
        Returns:
            Response: JSON response indicating success or error
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Change the password
        user = self.get_object()
        user.set_password(serializer.validated_data['new_password'])
        user.save()
        
        return Response({
            "message": "Password changed successfully"
        }, status=status.HTTP_200_OK)

class PasswordResetView(generics.GenericAPIView):
    """
    API endpoint for requesting a password reset
    
    This view:
    1. Accepts an email address
    2. Generates a password reset token
    3. Sends an email with the reset link
    
    URL: /api/auth/password-reset/
    Method: POST
    
    Example request body:
    {
        "email": "user@example.com"
    }
    """
    
    permission_classes = (AllowAny,)
    serializer_class = PasswordResetSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Don't reveal that the user doesn't exist
            return Response(
                {"detail": "Password reset email has been sent."},
                status=status.HTTP_200_OK
            )
        
        # Generate token
        token = default_token_generator.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        
        # Build reset URL
        reset_url = f"{settings.FRONTEND_URL}/reset-password/{uid}/{token}"
        
        # Send email
        context = {
            'user': user,
            'reset_url': reset_url,
            'site_name': 'Sheena Residence'
        }
        
        email_html_message = render_to_string('email/password_reset_email.html', context)
        email_plaintext_message = render_to_string('email/password_reset_email.txt', context)
        
        send_mail(
            subject="Reset your password",
            message=email_plaintext_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            html_message=email_html_message
        )
        
        return Response(
            {"detail": "Password reset email has been sent."},
            status=status.HTTP_200_OK
        )

class PasswordResetConfirmView(generics.GenericAPIView):
    """
    API endpoint for confirming a password reset
    
    This view:
    1. Validates the reset token
    2. Sets the new password
    
    URL: /api/auth/password-reset-confirm/
    Method: POST
    
    Example request body:
    {
        "uid": "MQ",
        "token": "abcdef123456",
        "new_password": "newpassword123"
    }
    """
    
    permission_classes = (AllowAny,)
    serializer_class = PasswordResetConfirmSerializer
    
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Get validated data
        uid = force_str(urlsafe_base64_decode(serializer.validated_data['uid']))
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        
        try:
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response(
                {"detail": "Invalid reset link."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not default_token_generator.check_token(user, token):
            return Response(
                {"detail": "Invalid or expired reset link."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        user.set_password(new_password)
        user.save()
        
        return Response(
            {"detail": "Password has been reset successfully."},
            status=status.HTTP_200_OK
        )
