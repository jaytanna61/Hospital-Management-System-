from rest_framework.fields import SerializerMethodField
from rest_framework.relations import Hyperlink, HyperlinkedIdentityField
from rest_framework.serializers import (
    ModelSerializer,
    HyperlinkedIdentityField,
    SerializerMethodField,
    ValidationError
)
from django.contrib.auth.models import User
from doctor import models





class TestSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')


class SearchPatientSerializer(ModelSerializer):
    class Meta:
        model = models.Patient
        fields = '__all__'


class PatientCreateSerializer(ModelSerializer):
    class Meta:
        model = models.Patient
        fields = '__all__'

    def create(self, validated_data):
        first_name = validated_data['first_name']
        last_name = validated_data['last_name']
        dob = validated_data['dob']
        email = validated_data['email']
        phone_number = validated_data['phone_number']
        blood_group = validated_data['blood_group']

        Patient_obj = models.Patient(
            first_name = first_name,
            last_name= last_name,
            dob= dob,
            email= email,
            phone_number= phone_number,
            blood_group= blood_group
        )

        Patient_obj.save()
        return validated_data