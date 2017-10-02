from django.core.validators import RegexValidator
from django.db import models

# Create your models here.
from receptionist.models import Appointment


class Patient(models.Model):
    first_name = models.CharField(max_length=70)
    last_name = models.CharField(max_length=70)
    dob = models.DateField(default="2000-12-21")
    email = models.EmailField(unique=True, default=1)
    phone_regex = RegexValidator(regex=r'^\+?1?\d{9,15}$',
                                 message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed.")
    phone_number = models.CharField(validators=[phone_regex], max_length=15, blank=True)  # validators should be a list
    blood_group = models.CharField(max_length=3)


class PatientHistory(models.Model):
    patient = models.ForeignKey(Patient)
    appointment = models.ForeignKey(Appointment)
    prescription = models.CharField(max_length=1000)
    comments = models.CharField(max_length=1000)

