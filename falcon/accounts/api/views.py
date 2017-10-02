from rest_framework.generics import ListAPIView, CreateAPIView

from doctor.models import Patient
from .serializer import PatientSerializer, PatientCreateSerializer


class PatientListView(ListAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer


class PatientRegister(CreateAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientCreateSerializer