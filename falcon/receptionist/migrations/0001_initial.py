# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-09-29 22:22
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Appointment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('symptoms', models.CharField(max_length=1000)),
            ],
        ),
    ]
