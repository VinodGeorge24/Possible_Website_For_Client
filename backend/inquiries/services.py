import logging

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags


logger = logging.getLogger(__name__)


def send_inquiry_emails(inquiry):
    email_error = ''

    try:
        _send_business_notification(inquiry)
        inquiry.notification_sent_at = timezone.now()
    except Exception as exc:
        email_error = f'Business notification failed: {exc}'
        logger.exception('Failed to send inquiry notification for inquiry %s', inquiry.id)

    try:
        _send_guest_acknowledgment(inquiry)
        inquiry.acknowledgment_sent_at = timezone.now()
    except Exception as exc:
        guest_error = f'Guest acknowledgment failed: {exc}'
        email_error = f'{email_error} | {guest_error}'.strip(' |')
        logger.exception('Failed to send inquiry acknowledgment for inquiry %s', inquiry.id)

    inquiry.email_error = email_error
    inquiry.save(update_fields=[
        'notification_sent_at',
        'acknowledgment_sent_at',
        'email_error',
        'updated_at',
    ])


def _send_business_notification(inquiry):
    recipient = settings.INQUIRY_TO_EMAIL
    if not recipient:
        raise ValueError('INQUIRY_TO_EMAIL is not configured.')

    context = {
        'business_name': settings.BUSINESS_NAME,
        'inquiry': inquiry,
        'headline': '[Booking Request]' if inquiry.kind == inquiry.KIND_BOOKING_REQUEST else '[General Inquiry]',
    }
    html_body = render_to_string('emails/inquiries/business_notification.html', context)
    text_body = render_to_string('emails/inquiries/business_notification.txt', context)

    message = EmailMultiAlternatives(
        subject=f"{context['headline']} {inquiry.name}",
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient],
        reply_to=[inquiry.email],
        bcc=[settings.INQUIRY_BCC_EMAIL] if settings.INQUIRY_BCC_EMAIL else [],
    )
    message.attach_alternative(html_body, 'text/html')
    message.send(fail_silently=False)


def _send_guest_acknowledgment(inquiry):
    context = {
        'business_name': settings.BUSINESS_NAME,
        'business_phone': settings.BUSINESS_PHONE,
        'inquiry': inquiry,
        'subject_line': 'We received your stay request'
        if inquiry.kind == inquiry.KIND_BOOKING_REQUEST
        else 'We received your message',
    }
    html_body = render_to_string('emails/inquiries/guest_acknowledgment.html', context)
    text_body = render_to_string('emails/inquiries/guest_acknowledgment.txt', context)

    message = EmailMultiAlternatives(
        subject=f"{settings.BUSINESS_NAME} | {context['subject_line']}",
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[inquiry.email],
    )
    message.attach_alternative(html_body, 'text/html')
    message.send(fail_silently=False)
