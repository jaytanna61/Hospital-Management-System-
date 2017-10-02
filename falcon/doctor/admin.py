from django.contrib import admin

# Register your models here.
from doctor.models import Patient, PatientHistory

admin.site.register(Patient)
admin.site.register(PatientHistory)
