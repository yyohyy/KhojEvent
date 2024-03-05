# Generated by Django 5.0 on 2024-03-05 09:20

import django.utils.timezone
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='organiser',
            old_name='address',
            new_name='area',
        ),
        migrations.AddField(
            model_name='organiser',
            name='business_registration_no',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='organiser',
            name='citizenship_no',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='organiser',
            name='city',
            field=models.CharField(default=django.utils.timezone.now, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='organiser',
            name='country',
            field=models.CharField(default=django.utils.timezone.now, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='organiser',
            name='district',
            field=models.CharField(default=django.utils.timezone.now, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='organiser',
            name='document_back',
            field=models.ImageField(blank=True, null=True, upload_to='images/identification'),
        ),
        migrations.AddField(
            model_name='organiser',
            name='document_front',
            field=models.ImageField(blank=True, null=True, upload_to='images/identification'),
        ),
        migrations.AddField(
            model_name='organiser',
            name='pan_no',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='organiser',
            name='province',
            field=models.CharField(default=django.utils.timezone.now, max_length=255),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='organiser',
            name='street',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
    ]
