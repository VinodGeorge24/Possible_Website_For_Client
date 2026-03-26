from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PropertyViewSet, BookingViewSet, PropertyImageViewSet

"""
URL Configuration for Booking App

This module defines all URL patterns for property and booking related endpoints.
Each endpoint is documented with its purpose and usage.
"""

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'properties', PropertyViewSet, basename='property')
router.register(r'bookings', BookingViewSet, basename='booking')
router.register(r'property-images', PropertyImageViewSet, basename='property-image')

urlpatterns = [
    # Include the router URLs in our patterns
    path('', include(router.urls)),
]

# API Endpoints Available:
"""
Properties:
- GET /api/properties/: List all properties
- POST /api/properties/: Create a new property (admin only)
- GET /api/properties/{id}/: Retrieve a specific property
- PUT /api/properties/{id}/: Update a property (admin only)
- DELETE /api/properties/{id}/: Delete a property (admin only)
- POST /api/properties/{id}/upload_images/: Upload images for a property

Property Images:
- POST /api/property-images/: Upload a new property image
- GET /api/property-images/{id}/: Retrieve image details
- PUT /api/property-images/{id}/: Update image details
- DELETE /api/property-images/{id}/: Delete an image

Bookings:
- GET /api/bookings/: List user's bookings
- POST /api/bookings/: Create a new booking
- GET /api/bookings/{id}/: Retrieve a specific booking
- PUT /api/bookings/{id}/: Update a booking
- DELETE /api/bookings/{id}/: Cancel a booking
"""
