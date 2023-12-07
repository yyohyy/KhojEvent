# Generated by Django 4.2.7 on 2023-12-07 12:27

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Attendee',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('first_name', models.CharField(max_length=255)),
                ('last_name', models.CharField(max_length=255)),
                ('birth_date', models.DateField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Organiser',
            fields=[
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, primary_key=True, serialize=False, to=settings.AUTH_USER_MODEL)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField()),
                ('address', models.CharField(max_length=255)),
                ('facebook', models.URLField(blank=True)),
                ('instagram', models.URLField(blank=True)),
                ('twitter', models.URLField(blank=True)),
                ('website', models.URLField(blank=True)),
            ],
        ),
    ]
