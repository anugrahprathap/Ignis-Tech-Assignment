# Generated by Django 4.2.5 on 2024-03-14 12:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_alter_event_organizer'),
    ]

    operations = [
        migrations.AlterField(
            model_name='event',
            name='location',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
