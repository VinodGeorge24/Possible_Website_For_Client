import re

from django.utils import timezone
from rest_framework import serializers

from .models import Inquiry


def normalize_phone_number(value, *, required):
    digits = re.sub(r'\D', '', (value or '').strip())

    if not digits:
        if required:
            raise serializers.ValidationError('Please enter a 10-digit phone number.')
        return ''

    if len(digits) != 10:
        raise serializers.ValidationError('Please enter a 10-digit phone number.')

    return f'({digits[:3]}) {digits[3:6]}-{digits[6:]}'


class ContactInquirySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inquiry
        fields = ('name', 'email', 'phone', 'message')

    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError('Please tell us how we can help.')
        return value

    def validate_phone(self, value):
        return normalize_phone_number(value, required=False)

    def create(self, validated_data):
        return Inquiry.objects.create(kind=Inquiry.KIND_CONTACT, **validated_data)


class BookingRequestSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=100)
    last_name = serializers.CharField(max_length=100)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=32)
    check_in_date = serializers.DateField()
    check_out_date = serializers.DateField()
    guests = serializers.IntegerField(min_value=1, max_value=8)
    message = serializers.CharField(required=False, allow_blank=True)

    def validate_phone(self, value):
        return normalize_phone_number(value, required=True)

    def validate(self, attrs):
        today = timezone.localdate()
        if attrs['check_in_date'] < today:
            raise serializers.ValidationError({
                'check_in_date': ['Check-in date cannot be in the past.'],
            })
        if attrs['check_out_date'] <= attrs['check_in_date']:
            raise serializers.ValidationError({
                'check_out_date': ['Check-out date must be after check-in date.'],
            })
        return attrs

    def create(self, validated_data):
        name = f"{validated_data.pop('first_name').strip()} {validated_data.pop('last_name').strip()}".strip()
        return Inquiry.objects.create(
            kind=Inquiry.KIND_BOOKING_REQUEST,
            name=name,
            **validated_data,
        )
