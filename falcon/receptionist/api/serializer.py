from django.contrib.contenttypes import fields
from rest_framework.fields import SerializerMethodField
from rest_framework.relations import Hyperlink, HyperlinkedIdentityField
from rest_framework.serializers import (
    ModelSerializer,
    HyperlinkedIdentityField,
    SerializerMethodField,
    ValidationError
)
from django.contrib.auth.models import User
from doctor.models import Patient


class PatientSerializer(ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'

class PatientCreateSerializer(ModelSerializer):
    class Meta:
        model = Patient
        fields = '__all__'
