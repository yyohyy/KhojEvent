# Generated by Django 5.0 on 2024-02-15 06:23

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('events', '0001_initial'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='event',
            name='organiser',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='users.organiser'),
        ),
        migrations.AddField(
            model_name='interested',
            name='attendee',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.attendee'),
        ),
        migrations.AddField(
            model_name='interested',
            name='event',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.event'),
        ),
        migrations.AddField(
            model_name='rating',
            name='attendee',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.attendee'),
        ),
        migrations.AddField(
            model_name='rating',
            name='event',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.event'),
        ),
        migrations.AddField(
            model_name='review',
            name='attendee',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.attendee'),
        ),
        migrations.AddField(
            model_name='review',
            name='event',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.event'),
        ),
        migrations.AddField(
            model_name='event',
            name='tags',
            field=models.ManyToManyField(to='events.tag'),
        ),
    ]
