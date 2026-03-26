from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    CustomTokenObtainPairView,
    UserProfileView,
    ChangePasswordView
)

"""
URL Configuration for Authentication

This module defines all the URL patterns for authentication-related endpoints.
Each endpoint is documented with its purpose and usage.

Available endpoints:
- /register/: Create a new user account
- /login/: Obtain JWT tokens by logging in
- /token/refresh/: Get a new access token using refresh token
- /profile/: View and update user profile
- /change-password/: Change user password
"""

urlpatterns = [
    # User Registration
    # POST request with email, password, and profile data
    path('register/', RegisterView.as_view(), name='register'),
    
    # User Login
    # POST request with email and password
    # Returns access and refresh tokens
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    
    # Token Refresh
    # POST request with refresh token
    # Returns new access token
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User Profile
    # GET: View profile
    # PATCH: Update profile
    path('profile/', UserProfileView.as_view(), name='profile'),
    
    # Change Password
    # PATCH request with old and new passwords
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
]
