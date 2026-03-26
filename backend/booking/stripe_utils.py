import stripe
from django.conf import settings
from django.core.mail import send_mail
from decimal import Decimal
from .models import Booking

stripe.api_key = settings.STRIPE_SECRET_KEY

def create_payment_intent(booking):
    """
    Create a Stripe PaymentIntent for a booking
    """
    try:
        # Convert amount to cents for Stripe
        amount = int(booking.total_price * 100)
        
        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency='usd',
            metadata={
                'booking_id': booking.id,
                'check_in': booking.check_in_date.isoformat(),
                'check_out': booking.check_out_date.isoformat(),
                'guest_email': booking.email
            }
        )
        return intent
    except stripe.error.StripeError as e:
        # Handle any Stripe-specific errors here
        raise Exception(f"Error creating payment intent: {str(e)}")

def handle_successful_payment(payment_intent):
    """
    Handle successful payment completion
    """
    try:
        # Get booking details from payment intent metadata
        booking_id = payment_intent.metadata.get('booking_id')
        guest_email = payment_intent.metadata.get('guest_email')
        
        # Update booking status
        booking = Booking.objects.get(id=booking_id)
        booking.status = 'confirmed'
        booking.payment_status = 'paid'
        booking.stripe_payment_intent = payment_intent.id
        booking.save()
        
        # Send confirmation email
        send_booking_confirmation_email(booking)
        
        return booking
    except Exception as e:
        raise Exception(f"Error handling successful payment: {str(e)}")

def send_booking_confirmation_email(booking):
    """
    Send a confirmation email for a successful booking
    """
    subject = 'Booking Confirmation - Sheena Residence'
    message = f"""
    Dear {booking.first_name},

    Thank you for booking your stay at Sheena Residence. Your booking has been confirmed!

    Booking Details:
    - Check-in: {booking.check_in_date.strftime('%B %d, %Y')}
    - Check-out: {booking.check_out_date.strftime('%B %d, %Y')}
    - Number of guests: {booking.guests}
    - Total amount paid: ${booking.total_price}

    Property Address:
    7028 E Sheena Drive
    Scottsdale, Arizona 85254

    Important Information:
    - Check-in time: 4:00 PM
    - Check-out time: 11:00 AM
    - Parking: Available on premises
    - WiFi: Details will be provided upon check-in

    If you have any questions or need to modify your booking, please contact us.

    We look forward to hosting you!

    Best regards,
    Sheena Residence Team
    """
    
    try:
        send_mail(
            subject,
            message,
            settings.EMAIL_HOST_USER,
            [booking.email],
            fail_silently=False,
        )
    except Exception as e:
        # Log the error but don't raise it to avoid blocking the booking process
        print(f"Error sending confirmation email: {str(e)}")

def calculate_booking_price(check_in, check_out, guests):
    """
    Calculate the total price for a booking
    """
    # Calculate number of nights
    nights = (check_out - check_in).days
    
    # Base price per night
    base_price = Decimal('350.00')
    
    # Additional guest fee (if more than 2 guests)
    additional_guest_fee = Decimal('25.00')
    additional_guests = max(0, guests - 2)
    
    # Calculate total
    total = (base_price * nights) + (additional_guest_fee * additional_guests * nights)
    
    # Add cleaning fee
    cleaning_fee = Decimal('150.00')
    total += cleaning_fee
    
    return total
