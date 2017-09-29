from django.db import models

# Create your models here.

class Appointment (models.Model):
    #patient_ID= models. Add forign key for patient id
    symptoms = models.CharField(max_length=1000)
    date = models.DateTimeField
