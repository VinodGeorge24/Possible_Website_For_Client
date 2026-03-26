from django.contrib import admin

from .models import Inquiry


@admin.register(Inquiry)
class InquiryAdmin(admin.ModelAdmin):
    list_display = (
        'created_at',
        'kind',
        'status',
        'name',
        'email',
        'phone',
        'check_in_date',
        'check_out_date',
        'guests',
        'notification_status',
        'acknowledgment_status',
    )
    list_filter = ('kind', 'status', 'created_at')
    search_fields = ('name', 'email', 'phone', 'message')
    readonly_fields = (
        'created_at',
        'updated_at',
        'notification_sent_at',
        'acknowledgment_sent_at',
        'email_error',
    )

    @admin.display(boolean=True, description='Notification Sent')
    def notification_status(self, obj):
        return bool(obj.notification_sent_at)

    @admin.display(boolean=True, description='Guest Ack Sent')
    def acknowledgment_status(self, obj):
        return bool(obj.acknowledgment_sent_at)
