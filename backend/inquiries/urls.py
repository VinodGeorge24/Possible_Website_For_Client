from django.urls import path

from .views import BookingInquiryView, ContactInquiryView


urlpatterns = [
    path('contact/', ContactInquiryView.as_view(), name='contact-inquiry'),
    path('booking/', BookingInquiryView.as_view(), name='booking-inquiry'),
]
