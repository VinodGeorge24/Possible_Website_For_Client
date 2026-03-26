from smtplib import SMTPDataError
from unittest.mock import patch

from django.core import mail
from django.test import TestCase, override_settings
from rest_framework.test import APIClient

from .models import Inquiry


@override_settings(EMAIL_BACKEND='django.core.mail.backends.locmem.EmailBackend')
class InquiryApiTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_contact_inquiry_creates_record_and_sends_emails(self):
        response = self.client.post('/api/inquiries/contact/', {
            'name': 'Sarah Guest',
            'email': 'sarah@example.com',
            'phone': '4805550101',
            'message': 'Can you tell me more about the kosher kitchen setup?',
        }, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Inquiry.objects.count(), 1)
        inquiry = Inquiry.objects.get()
        self.assertEqual(inquiry.kind, Inquiry.KIND_CONTACT)
        self.assertEqual(inquiry.phone, '(480) 555-0101')
        self.assertTrue(inquiry.notification_sent_at)
        self.assertTrue(inquiry.acknowledgment_sent_at)
        self.assertEqual(len(mail.outbox), 2)

    def test_booking_request_validates_date_range(self):
        response = self.client.post('/api/inquiries/booking/', {
            'first_name': 'David',
            'last_name': 'Levi',
            'email': 'david@example.com',
            'phone': '480-555-0202',
            'check_in_date': '2030-05-10',
            'check_out_date': '2030-05-08',
            'guests': 4,
            'message': 'We are coming for a family Shabbos.',
        }, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(Inquiry.objects.count(), 0)
        self.assertIn('check_out_date', response.json())

    def test_booking_request_creates_record_and_sends_emails(self):
        response = self.client.post('/api/inquiries/booking/', {
            'first_name': 'Miriam',
            'last_name': 'Cohen',
            'email': 'miriam@example.com',
            'phone': '4805550303',
            'check_in_date': '2030-04-10',
            'check_out_date': '2030-04-14',
            'guests': 6,
            'message': 'Please let us know if the pool can be heated.',
        }, format='json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(Inquiry.objects.count(), 1)
        inquiry = Inquiry.objects.get()
        self.assertEqual(inquiry.kind, Inquiry.KIND_BOOKING_REQUEST)
        self.assertEqual(inquiry.name, 'Miriam Cohen')
        self.assertEqual(inquiry.phone, '(480) 555-0303')
        self.assertEqual(inquiry.guests, 6)
        self.assertEqual(len(mail.outbox), 2)

    def test_booking_request_rejects_invalid_phone_number(self):
        response = self.client.post('/api/inquiries/booking/', {
            'first_name': 'Miriam',
            'last_name': 'Cohen',
            'email': 'miriam@example.com',
            'phone': '480555030',
            'check_in_date': '2030-04-10',
            'check_out_date': '2030-04-14',
            'guests': 6,
        }, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertIn('phone', response.json())

    @patch('django.core.mail.EmailMultiAlternatives.send', side_effect=Exception('SMTP unavailable'))
    def test_email_failure_does_not_drop_saved_inquiry(self, _mock_send):
        response = self.client.post('/api/inquiries/contact/', {
            'name': 'Isaac Guest',
            'email': 'isaac@example.com',
            'message': 'Following up on an upcoming Scottsdale stay.',
        }, format='json')

        self.assertEqual(response.status_code, 201)
        inquiry = Inquiry.objects.get()
        self.assertEqual(inquiry.kind, Inquiry.KIND_CONTACT)
        self.assertFalse(inquiry.notification_sent_at)
        self.assertFalse(inquiry.acknowledgment_sent_at)
        self.assertIn('failed', inquiry.email_error.lower())

    @patch('inquiries.services.time.sleep', return_value=None)
    @patch(
        'inquiries.services.EmailMultiAlternatives.send',
        side_effect=[1, SMTPDataError(550, b'5.7.0 Too many emails per second.'), 1],
    )
    def test_rate_limited_guest_acknowledgment_retries_successfully(self, mock_send, _mock_sleep):
        response = self.client.post('/api/inquiries/contact/', {
            'name': 'Retry Guest',
            'email': 'retry@example.com',
            'message': 'Testing Mailtrap retry behavior.',
        }, format='json')

        self.assertEqual(response.status_code, 201)
        inquiry = Inquiry.objects.get()
        self.assertTrue(inquiry.notification_sent_at)
        self.assertTrue(inquiry.acknowledgment_sent_at)
        self.assertEqual(inquiry.email_error, '')
        self.assertEqual(mock_send.call_count, 3)
