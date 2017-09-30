from django.db import models
from django.conf import settings
#from django.contrib.auth.models import User
# Create your models here.
from django.template.defaultfilters import default


class Appointment (models.Model):
    patient = models.ForeignKey(settings.AUTH_USER_MODEL, default=1)
    symptoms = models.CharField(max_length=1000)
    date = models.DateTimeField
