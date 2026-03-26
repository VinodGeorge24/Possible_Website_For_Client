from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import BookingRequestSerializer, ContactInquirySerializer
from .services import send_inquiry_emails


class ContactInquiryView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = ContactInquirySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.save()
        send_inquiry_emails(inquiry)

        return Response({
            'success': True,
            'message': 'Thanks for reaching out. We will get back to you shortly.',
            'inquiry_id': inquiry.id,
        }, status=status.HTTP_201_CREATED)


class BookingInquiryView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = BookingRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        inquiry = serializer.save()
        send_inquiry_emails(inquiry)

        return Response({
            'success': True,
            'message': 'Your stay request has been received. We will follow up with availability and next steps.',
            'inquiry_id': inquiry.id,
        }, status=status.HTTP_201_CREATED)
