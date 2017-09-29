from django.db import models
from django.contrib.auth.models import User
# Create your models here.
from django.template.defaultfilters import default


class Appointment (models.Model):
    #patient= models.ForeignKey(User)
    symptoms = models.CharField(max_length=1000)
    date = models.DateTimeField
