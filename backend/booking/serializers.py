from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Property, Booking, PropertyImage

class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    Handles user registration and profile updates
    
    Fields:
    - username: User's unique username
    - email: User's email address
    - password: User's password (write-only)
    """
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
    
    def create(self, validated_data):
        """
        Create a new user with encrypted password
        """
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class PropertyImageSerializer(serializers.ModelSerializer):
    """
    Serializer for PropertyImage model
    Handles image data and metadata
    """
    class Meta:
        model = PropertyImage
        fields = ['id', 'image', 'alt_text', 'is_primary', 'caption', 'order']

class PropertySerializer(serializers.ModelSerializer):
    """
    Serializer for Property model
    Handles property data including related images
    
    Fields:
    All fields from Property model plus:
    - images: List of related property images
    - primary_image: The main property image
    - amenities_list: List of property amenities
    """
    images = PropertyImageSerializer(many=True, read_only=True)
    primary_image = serializers.SerializerMethodField()
    amenities_list = serializers.ListField(read_only=True)
    
    class Meta:
        model = Property
        fields = [
            'id', 'name', 'description', 'address', 'price_per_night',
            'max_guests', 'bedrooms', 'bathrooms', 'amenities',
            'house_rules', 'check_in_time', 'check_out_time',
            'latitude', 'longitude', 'images', 'primary_image',
            'amenities_list', 'created_at', 'updated_at'
        ]
    
    def get_primary_image(self, obj):
        """
        Get the primary image for the property
        """
        primary_image = obj.get_primary_image()
        if primary_image:
            return PropertyImageSerializer(primary_image).data
        return None

class BookingSerializer(serializers.ModelSerializer):
    """
    Serializer for Booking model
    Handles booking creation and updates
    
    Fields:
    All fields from Booking model plus:
    - property_details: Nested property information
    - user_details: Nested user information
    """
    property_details = PropertySerializer(source='property', read_only=True)
    user_details = UserSerializer(source='user', read_only=True)
    
    class Meta:
        model = Booking
        fields = '__all__'
        read_only_fields = ('user', 'status', 'total_price')
    
    def validate(self, data):
        """
        Custom validation for booking dates and availability
        
        Checks:
        1. Check-out after check-in
        2. No date overlap with existing bookings
        3. Guest count within property limits
        """
        if data['check_out_date'] <= data['check_in_date']:
            raise serializers.ValidationError(
                "Check-out date must be after check-in date"
            )
        
        # Check for booking overlap
        overlapping_bookings = Booking.objects.filter(
            property=data['property'],
            status='confirmed',
            check_in_date__lte=data['check_out_date'],
            check_out_date__gte=data['check_in_date']
        )
        
        if overlapping_bookings.exists():
            raise serializers.ValidationError(
                "Property is not available for these dates"
            )
        
        if data['guest_count'] > data['property'].max_guests:
            raise serializers.ValidationError(
                f"Guest count exceeds property maximum of {data['property'].max_guests}"
            )
        
        return data
    
    def create(self, validated_data):
        """
        Create a new booking with calculated total price
        """
        # Calculate number of nights
        nights = (
            validated_data['check_out_date'] - 
            validated_data['check_in_date']
        ).days
        
        # Calculate total price
        validated_data['total_price'] = (
            validated_data['property'].price_per_night * nights
        )
        
        return super().create(validated_data)
