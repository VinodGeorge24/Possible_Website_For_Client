from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from decimal import Decimal

class PropertyImage(models.Model):
    """
    PropertyImage Model
    Stores images associated with a property
    
    Attributes:
        property (Property): The property this image belongs to
        image (ImageField): The actual image file
        alt_text (str): Alternative text for accessibility
        is_primary (bool): Whether this is the main property image
        caption (str): Optional caption describing the image
        order (int): Display order of the image
    """
    property = models.ForeignKey('Property', on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='property_images/')
    alt_text = models.CharField(max_length=200)
    is_primary = models.BooleanField(default=False)
    caption = models.TextField(blank=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order', '-is_primary', 'created_at']

    def __str__(self):
        return f"Image for {self.property.name} - {'Primary' if self.is_primary else 'Secondary'}"

class Property(models.Model):
    """
    Property Model
    Represents a bookable property in the system
    
    Attributes:
        name (str): Name of the property
        description (text): Detailed description of the property
        address (text): Physical address of the property
        price_per_night (decimal): Base price per night in USD
        max_guests (int): Maximum number of guests allowed
        bedrooms (int): Number of bedrooms
        bathrooms (int): Number of bathrooms
        amenities (text): List of property amenities
        house_rules (text): Property rules and guidelines
        check_in_time (time): Standard check-in time
        check_out_time (time): Standard check-out time
        latitude (float): Property latitude for mapping
        longitude (float): Property longitude for mapping
        base_price (decimal): Base price for the property
        cleaning_fee (decimal): Cleaning fee for the property
    """
    name = models.CharField(max_length=200)
    description = models.TextField()
    address = models.TextField()
    price_per_night = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(0)]
    )
    max_guests = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(20)]
    )
    bedrooms = models.IntegerField(validators=[MinValueValidator(1)])
    bathrooms = models.IntegerField(validators=[MinValueValidator(1)])
    amenities = models.TextField(help_text="List of amenities, one per line")
    house_rules = models.TextField(help_text="House rules and guidelines")
    check_in_time = models.TimeField(help_text="Standard check-in time")
    check_out_time = models.TimeField(help_text="Standard check-out time")
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('350.00'))
    cleaning_fee = models.DecimalField(max_digits=10, decimal_places=2, default=Decimal('150.00'))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Properties"

    def __str__(self):
        return self.name

    def get_primary_image(self):
        """
        Returns the primary image for the property
        If no primary image is set, returns the first image
        """
        return self.images.filter(is_primary=True).first() or self.images.first()

    @property
    def amenities_list(self):
        """
        Returns amenities as a list
        """
        return [amenity.strip() for amenity in self.amenities.split('\n') if amenity.strip()]

class Booking(models.Model):
    """
    Booking Model
    Represents a reservation for a property
    """
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('refunded', 'Refunded'),
        ('failed', 'Failed')
    ]

    property = models.ForeignKey(Property, on_delete=models.PROTECT, null=True)
    user = models.ForeignKey(User, on_delete=models.PROTECT, null=True, blank=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    check_in_date = models.DateField()
    check_out_date = models.DateField()
    guests = models.IntegerField(validators=[MinValueValidator(1)])
    total_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0'))]
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending'
    )
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='pending'
    )
    stripe_payment_intent = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Booking {self.id} - {self.first_name} {self.last_name}"

    def clean(self):
        if self.check_out_date and self.check_in_date:
            if self.check_out_date <= self.check_in_date:
                raise ValidationError('Check-out date must be after check-in date')

        if self.property and self.guests:
            if self.guests > self.property.max_guests:
                raise ValidationError(f'Guest count exceeds property maximum of {self.property.max_guests}')

        if self.check_in_date and self.check_out_date and self.property:
            overlapping = Booking.objects.filter(
                property=self.property,
                status='confirmed',
                check_in_date__lt=self.check_out_date,
                check_out_date__gt=self.check_in_date
            ).exclude(id=self.id).exists()

            if overlapping:
                raise ValidationError('These dates overlap with an existing booking')
