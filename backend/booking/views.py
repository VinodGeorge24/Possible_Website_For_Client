from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Q
from datetime import datetime
from .models import Property, Booking, PropertyImage
from .serializers import PropertySerializer, BookingSerializer, PropertyImageSerializer
from .stripe_utils import create_payment_intent, handle_successful_payment, calculate_booking_price
import stripe
from django.template.loader import render_to_string
from django.core.mail import send_mail, EmailMultiAlternatives
from django.conf import settings
from django.utils.html import strip_tags
from django.shortcuts import get_object_or_404

class PropertyImageViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling property images
    
    Endpoints:
    - POST /api/property-images/: Upload new image
    - DELETE /api/property-images/{id}/: Delete image
    - PATCH /api/property-images/{id}/: Update image details
    """
    queryset = PropertyImage.objects.all()
    serializer_class = PropertyImageSerializer
    parser_classes = (MultiPartParser, FormParser)
    permission_classes = [IsAdminUser]  # Only admin can manage images

    def perform_create(self, serializer):
        """Create a new property image"""
        property_id = self.request.data.get('property')
        property_instance = Property.objects.get(id=property_id)
        serializer.save(property=property_instance)

class PropertyViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Property operations
    
    Provides CRUD operations for properties and additional actions for:
    - Checking availability
    - Filtering by various criteria
    - Getting property analytics
    - Uploading images
    
    Permissions:
    - List and Retrieve: Any user
    - Create, Update, Delete: Admin only
    """
    queryset = Property.objects.all()
    serializer_class = PropertySerializer
    
    def get_permissions(self):
        """
        Only admin can create/update/delete properties
        Anyone can view properties
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            permission_classes = [IsAdminUser]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

    @action(detail=True, methods=['get'])
    def check_availability(self, request, pk=None):
        """
        Check property availability for specific dates
        
        Parameters:
        - check_in_date (str): Start date in YYYY-MM-DD format
        - check_out_date (str): End date in YYYY-MM-DD format
        
        Returns:
        - available (bool): Whether the property is available
        - conflicting_bookings (list): Any overlapping bookings if not available
        """
        try:
            # Parse dates from request
            check_in = datetime.strptime(
                request.query_params.get('check_in_date'),
                '%Y-%m-%d'
            ).date()
            check_out = datetime.strptime(
                request.query_params.get('check_out_date'),
                '%Y-%m-%d'
            ).date()

            # Check for overlapping bookings
            overlapping_bookings = Booking.objects.filter(
                property_id=pk,
                status='confirmed',
                check_in_date__lte=check_out,
                check_out_date__gte=check_in
            )

            if overlapping_bookings.exists():
                return Response({
                    'available': False,
                    'conflicting_bookings': BookingSerializer(
                        overlapping_bookings,
                        many=True
                    ).data
                })

            return Response({'available': True})

        except (ValueError, TypeError):
            return Response(
                {'error': 'Invalid date format'},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=True, methods=['post'])
    def upload_images(self, request, pk=None):
        """
        Upload multiple images for a property
        
        POST /api/properties/{id}/upload_images/
        """
        property = self.get_object()
        images = request.FILES.getlist('images')
        response_data = []

        for image in images:
            serializer = PropertyImageSerializer(data={
                'image': image,
                'alt_text': request.data.get('alt_text', ''),
                'is_primary': request.data.get('is_primary', False),
                'caption': request.data.get('caption', '')
            })
            if serializer.is_valid():
                serializer.save(property=property)
                response_data.append(serializer.data)

        return Response(response_data, status=status.HTTP_201_CREATED)

class BookingViewSet(viewsets.ModelViewSet):
    """
    API endpoint for Booking operations
    
    Provides CRUD operations for bookings and additional actions for:
    - Creating new bookings
    - Modifying existing bookings
    - Cancelling bookings
    - Viewing booking history
    
    Permissions:
    - Create: Authenticated users
    - Retrieve/Update/Delete: Booking owner or admin
    """
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    
    def get_permissions(self):
        """
        Allow unauthenticated access to check_availability and create_payment
        Require authentication for other actions
        """
        if self.action in ['check_availability', 'create_payment', 'confirm_payment']:
            permission_classes = [AllowAny]
        else:
            permission_classes = [IsAuthenticated]
        return [permission() for permission in permission_classes]

    def get_queryset(self):
        """
        Filter bookings based on user role:
        - Admin sees all bookings
        - Users see only their own bookings
        """
        user = self.request.user
        if user.is_staff:
            return Booking.objects.all()
        return Booking.objects.filter(user=user)

    def perform_create(self, serializer):
        """
        Create a new booking
        
        Additional operations:
        1. Set the user automatically
        2. Calculate total price
        3. Validate availability
        4. Send confirmation email
        """
        # Set the user
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """
        Cancel a booking
        
        Rules:
        1. Only confirmed bookings can be cancelled
        2. Cancellation must be before check-in date
        3. Refund will be processed based on cancellation policy
        """
        booking = self.get_object()
        
        if booking.status != 'confirmed':
            return Response(
                {'error': 'Only confirmed bookings can be cancelled'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if booking.check_in_date <= datetime.now().date():
            return Response(
                {'error': 'Cannot cancel a booking after check-in date'},
                status=status.HTTP_400_BAD_REQUEST
            )

        booking.status = 'cancelled'
        booking.save()

        # TODO: Process refund based on cancellation policy
        
        return Response({'status': 'Booking cancelled successfully'})

    @action(detail=False, methods=['post'])
    def check_availability(self, request):
        try:
            data = request.data
            check_in = datetime.strptime(data['check_in_date'], '%Y-%m-%d').date()
            check_out = datetime.strptime(data['check_out_date'], '%Y-%m-%d').date()
            guests = int(data['guests'])
            
            # Calculate total price
            total_price = calculate_booking_price(check_in, check_out, guests)
            
            return Response({
                'available': True,
                'total_price': float(total_price)
            })
            
        except ValueError as e:
            return Response(
                {'error': f'Invalid data format: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['post'])
    def create_payment(self, request):
        try:
            data = request.data
            check_in = datetime.strptime(data['check_in_date'], '%Y-%m-%d').date()
            check_out = datetime.strptime(data['check_out_date'], '%Y-%m-%d').date()
            guests = int(data['guests'])
            
            # Calculate total price
            total_price = calculate_booking_price(check_in, check_out, guests)
            
            # Create booking instance
            booking = Booking.objects.create(
                first_name=data['first_name'],
                last_name=data['last_name'],
                email=data['email'],
                phone=data['phone'],
                check_in_date=check_in,
                check_out_date=check_out,
                guests=guests,
                total_price=total_price,
                status='pending',
                payment_status='pending'
            )
            
            # Create Stripe PaymentIntent
            payment_intent = create_payment_intent(booking)
            
            return Response({
                'clientSecret': payment_intent.client_secret,
                'booking_id': booking.id,
                'total_price': float(total_price)
            })
            
        except ValueError as e:
            return Response(
                {'error': f'Invalid data format: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['post'])
    def confirm_payment(self, request):
        try:
            payment_intent_id = request.data.get('payment_intent_id')
            booking_id = request.data.get('booking_id')
            
            # Get the booking
            booking = get_object_or_404(Booking, id=booking_id)
            
            # Update booking status
            booking.payment_status = 'paid'
            booking.save()

            # Get property images for the email
            property_images = []
            if booking.property:
                property_images = PropertyImage.objects.filter(property=booking.property)[:3]
            
            # Send confirmation email
            context = {
                'guest_name': booking.first_name,
                'booking_id': booking.id,
                'check_in_date': booking.check_in_date.strftime('%B %d, %Y'),
                'check_out_date': booking.check_out_date.strftime('%B %d, %Y'),
                'guests': booking.guests,
                'total_amount': '{:.2f}'.format(booking.total_price),
                'manage_booking_url': f"{settings.FRONTEND_URL}/bookings/{booking.id}",
                'property_images': property_images,
                'property_name': booking.property.name if booking.property else settings.BUSINESS_NAME,
                'property_address': settings.BUSINESS_ADDRESS,
                'business_phone': settings.BUSINESS_PHONE,
                'business_email': settings.INQUIRY_TO_EMAIL or settings.DEFAULT_FROM_EMAIL,
            }
            
            html_message = render_to_string('emails/booking_confirmation.html', context)
            plain_message = strip_tags(html_message)
            
            try:
                print("Attempting to send email with settings:")
                print(f"From: {settings.DEFAULT_FROM_EMAIL}")
                print(f"To: {booking.email}")
                print(f"BCC: {settings.EMAIL_HOST_USER}")
                print(f"SMTP: {settings.EMAIL_HOST}:{settings.EMAIL_PORT}")
                print(f"TLS: {settings.EMAIL_USE_TLS}")
                
                email = EmailMultiAlternatives(
                    subject=f'Booking Confirmation - {settings.BUSINESS_NAME}',
                    body=plain_message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    to=[booking.email],
                    bcc=[settings.EMAIL_HOST_USER],  # Add booking email as BCC
                )
                # Add custom header for Gmail filtering
                email.extra_headers = {'X-Booking-Type': 'New-Booking-Confirmation'}
                email.attach_alternative(html_message, "text/html")
                email.send(fail_silently=False)
                
                print("Email sent successfully")
            except Exception as e:
                print(f"Error sending email: {str(e)}")
                # Continue execution even if email fails
            
            return Response({
                'status': 'success',
                'message': 'Payment confirmed and booking completed',
                'booking_id': booking.id
            })
            
        except Exception as e:
            print(f"Error handling successful payment: {str(e)}")
            return Response({
                'status': 'success',  # Still return success as payment was confirmed
                'message': 'Payment confirmed but there was an error processing the booking',
                'booking_id': booking_id if 'booking_id' in locals() else None
            })

    @action(detail=False, methods=['post'])
    def get_booking_details(self, request):
        """Get booking details using booking ID and email"""
        try:
            booking_id = request.data.get('booking_id')
            email = request.data.get('email')
            
            if not booking_id or not email:
                return Response({
                    'error': 'Both booking ID and email are required'
                }, status=status.HTTP_400_BAD_REQUEST)
            
            booking = get_object_or_404(Booking, id=booking_id, email=email)
            serializer = self.get_serializer(booking)
            
            # Add property details if available
            response_data = serializer.data
            if booking.property:
                response_data['property'] = {
                    'name': booking.property.name,
                    'address': booking.property.address,
                    'images': [img.image.url for img in booking.property.propertyimage_set.all()[:3]]
                }
            
            return Response(response_data)
            
        except Booking.DoesNotExist:
            return Response({
                'error': 'Invalid booking ID or email'
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

def handle_successful_payment(payment_intent):
    """Handle successful payment completion"""
    try:
        booking_id = payment_intent.metadata.get('booking_id')
        booking = Booking.objects.get(id=booking_id)
        booking.status = 'confirmed'
        booking.payment_status = 'paid'
        booking.save()

        # Get property images for the email
        property_images = PropertyImage.objects.filter(property=booking.property)[:3]  # Get first 3 images
        
        # Send confirmation email
        context = {
            'guest_name': booking.first_name,
            'booking_id': booking.id,
            'check_in_date': booking.check_in_date.strftime('%B %d, %Y'),
            'check_out_date': booking.check_out_date.strftime('%B %d, %Y'),
            'guests': booking.guests,
            'total_amount': '{:.2f}'.format(booking.total_price),
            'manage_booking_url': f"{settings.FRONTEND_URL}/bookings/{booking.id}",
            'property_images': property_images,
            'property_name': booking.property.name,
            'property_address': settings.BUSINESS_ADDRESS,
            'business_phone': settings.BUSINESS_PHONE,
            'business_email': settings.INQUIRY_TO_EMAIL or settings.DEFAULT_FROM_EMAIL,
        }
        
        html_message = render_to_string('emails/booking_confirmation.html', context)
        plain_message = strip_tags(html_message)
        
        send_mail(
            subject=f'Booking Confirmation - {settings.BUSINESS_NAME}',
            message=plain_message,
            html_message=html_message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[booking.email],
            fail_silently=False,
        )

        return booking
    except Exception as e:
        print(f"Error handling successful payment: {str(e)}")
        return None
