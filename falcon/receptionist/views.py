from rest_framework.response import Response
from rest_framework.views import APIView

from API.serializer import SearchPatientSerializer
from doctor.models import Patient


class SearchPatient(APIView):

    def get(self, request):
        pass

    def post(self, request):
        first_name = request.POST['first_name']
        last_name = request.POST['last_name']
        dob = request.POST['dob']
        email = request.POST['email']

        user = Patient.objects.filter(first_name=first_name, last_name=last_name, dob=dob, email=email).values()
        serialize = SearchPatientSerializer(user, many=True)
        return Response(serialize.data)


class RegisterPatient(APIView):

    def get(self, request):
        pass

    def post(self, request):
        new_patient = Patient
        new_patient.first_name = request.POST.get('first_name','')
        new_patient.last_name = request.POST.get('last_name')
        new_patient.dob = request.POST.get('dob')
        new_patient.email = request.POST.get('email')
        new_patient.phone_number = request.POST.get('phone_number')
        new_patient.blood_group = request.POST.get('blood_group')
        new_patient=new_patient.save(self)
        serialize = SearchPatientSerializer(new_patient, many=True)
        return Response(serialize.data)


class PatientCreateAPIView(APIView):
    serializer_class = Patient
    queryset = Patient.objects.all()

