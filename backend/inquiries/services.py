import logging
import time
from smtplib import SMTPDataError, SMTPServerDisconnected

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone


logger = logging.getLogger(__name__)
MAILTRAP_BACKOFF_SECONDS = 2.5


def send_inquiry_emails(inquiry):
    email_error = ''

    try:
        _send_business_notification(inquiry)
        inquiry.notification_sent_at = timezone.now()
    except Exception as exc:
        email_error = f'Business notification failed: {exc}'
        logger.exception('Failed to send inquiry notification for inquiry %s', inquiry.id)

    if inquiry.notification_sent_at and _is_mailtrap_sandbox():
        time.sleep(MAILTRAP_BACKOFF_SECONDS)

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
    _send_message_with_retry(message)


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
    _send_message_with_retry(message)


def _send_message_with_retry(message: EmailMultiAlternatives) -> None:
    try:
        message.send(fail_silently=False)
    except (SMTPDataError, SMTPServerDisconnected) as exc:
        if not _should_retry_send(exc):
            raise

        logger.warning('Retrying email send after transient SMTP error: %s', exc)
        _reset_message_connection(message)
        time.sleep(MAILTRAP_BACKOFF_SECONDS)
        message.send(fail_silently=False)


def _should_retry_send(exc: Exception) -> bool:
    if isinstance(exc, SMTPServerDisconnected):
        return True

    if isinstance(exc, SMTPDataError):
        error_text = str(exc).lower()
        return 'too many emails per second' in error_text

    return False


def _reset_message_connection(message: EmailMultiAlternatives) -> None:
    if message.connection:
        try:
            message.connection.close()
        except Exception:
            logger.debug('Failed to close stale email connection before retry.', exc_info=True)

    message.connection = None


def _is_mailtrap_sandbox() -> bool:
    return 'mailtrap.io' in settings.EMAIL_HOST.lower()
