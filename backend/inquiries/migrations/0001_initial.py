from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='Inquiry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('kind', models.CharField(choices=[('contact', 'Contact'), ('booking_request', 'Booking Request')], max_length=32)),
                ('status', models.CharField(choices=[('new', 'New'), ('reviewed', 'Reviewed'), ('archived', 'Archived')], default='new', max_length=32)),
                ('name', models.CharField(max_length=200)),
                ('email', models.EmailField(max_length=254)),
                ('phone', models.CharField(blank=True, max_length=32)),
                ('message', models.TextField(blank=True)),
                ('check_in_date', models.DateField(blank=True, null=True)),
                ('check_out_date', models.DateField(blank=True, null=True)),
                ('guests', models.PositiveSmallIntegerField(blank=True, null=True)),
                ('notification_sent_at', models.DateTimeField(blank=True, null=True)),
                ('acknowledgment_sent_at', models.DateTimeField(blank=True, null=True)),
                ('email_error', models.TextField(blank=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'ordering': ['-created_at'],
            },
        ),
    ]
