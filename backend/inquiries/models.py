from django.db import models


class Inquiry(models.Model):
    KIND_CONTACT = 'contact'
    KIND_BOOKING_REQUEST = 'booking_request'

    STATUS_NEW = 'new'
    STATUS_REVIEWED = 'reviewed'
    STATUS_ARCHIVED = 'archived'

    KIND_CHOICES = [
        (KIND_CONTACT, 'Contact'),
        (KIND_BOOKING_REQUEST, 'Booking Request'),
    ]

    STATUS_CHOICES = [
        (STATUS_NEW, 'New'),
        (STATUS_REVIEWED, 'Reviewed'),
        (STATUS_ARCHIVED, 'Archived'),
    ]

    kind = models.CharField(max_length=32, choices=KIND_CHOICES)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default=STATUS_NEW)
    name = models.CharField(max_length=200)
    email = models.EmailField()
    phone = models.CharField(max_length=32, blank=True)
    message = models.TextField(blank=True)
    check_in_date = models.DateField(null=True, blank=True)
    check_out_date = models.DateField(null=True, blank=True)
    guests = models.PositiveSmallIntegerField(null=True, blank=True)
    notification_sent_at = models.DateTimeField(null=True, blank=True)
    acknowledgment_sent_at = models.DateTimeField(null=True, blank=True)
    email_error = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.get_kind_display()}: {self.name}'
