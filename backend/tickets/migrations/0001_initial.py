<<<<<<< HEAD
# Generated by Django 5.0 on 2024-02-06 16:56
=======
# Generated by Django 5.0 on 2024-02-07 10:16
>>>>>>> 5a0d89ebd707253507f82facb97f0fbe7eb91f34

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Cart',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False, unique=True)),
                ('total_amount', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
<<<<<<< HEAD
                ('attendee', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='users.attendee')),
            ],
        ),
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('status', models.CharField(default='PENDING', max_length=255)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('cart', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='order', to='tickets.cart')),
            ],
        ),
        migrations.CreateModel(
            name='SelectedTicket',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('BOOKED', 'Booked'), ('PROCESSING', 'Processing'), ('CANCELLED', 'Cancelled'), ('CONFIRMED', 'Confirmed')], default='BOOKED', max_length=255)),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('amount', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('cart', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='tickets', to='tickets.cart')),
                ('issued_to', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.attendee')),
            ],
        ),
        migrations.CreateModel(
            name='OrderItem',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.PositiveIntegerField()),
                ('order', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tickets', to='tickets.order')),
                ('ticket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tickets.selectedticket')),
            ],
        ),
        migrations.CreateModel(
            name='Ticket',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_quantity', models.PositiveIntegerField(default=0, editable=False)),
                ('quantity_available', models.PositiveIntegerField(default=1)),
                ('max_limit', models.PositiveIntegerField(default=0)),
                ('status', models.CharField(choices=[('AVAILABLE', 'Available'), ('SOLD_OUT', 'Sold Out')], default='AVAILABLE', max_length=20)),
                ('event', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='events.event')),
            ],
        ),
        migrations.CreateModel(
            name='TicketType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=255)),
                ('description', models.CharField(max_length=255)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('quantity_available', models.PositiveIntegerField(default=1)),
                ('ticket', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='ticket_types', to='tickets.ticket')),
            ],
        ),
        migrations.AddField(
            model_name='selectedticket',
            name='ticket',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='tickets.tickettype'),
=======
            ],
        ),
        migrations.CreateModel(
            name='SelectedTicket',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('status', models.CharField(choices=[('BOOKED', 'Booked'), ('CANCELLED', 'Cancelled'), ('CONFIRMED', 'Confirmed')], default='BOOKED', max_length=255)),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('amount', models.DecimalField(decimal_places=2, default=0.0, max_digits=10)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Ticket',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_quantity', models.PositiveIntegerField(default=0, editable=False)),
                ('quantity_available', models.PositiveIntegerField(default=1)),
                ('max_limit', models.PositiveIntegerField(default=0)),
                ('status', models.CharField(choices=[('AVAILABLE', 'Available'), ('SOLD_OUT', 'Sold Out')], default='AVAILABLE', max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='TicketType',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(blank=True, max_length=255)),
                ('description', models.CharField(max_length=255)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('quantity', models.PositiveIntegerField(default=1)),
                ('quantity_available', models.PositiveIntegerField(default=1)),
            ],
>>>>>>> 5a0d89ebd707253507f82facb97f0fbe7eb91f34
        ),
    ]
