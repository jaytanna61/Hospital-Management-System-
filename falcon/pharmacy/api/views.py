from rest_framework.generics import ListAPIView, CreateAPIView

from ..models import Product, Manufacturer, Batch, Supplier
from .serializer import MedicineViewSerializer, ManufacturerSerializer, BatchSerializer, SupplierSerializer


class MedicineListView(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = MedicineViewSerializer


class MedicineRegister(CreateAPIView):
    queryset = Product.objects.all()
    serializer_class = MedicineViewSerializer


class ManufacturerRegister(CreateAPIView):
    queryset = Manufacturer.objects.all()
    serializer_class = ManufacturerSerializer


class BatchRegister(CreateAPIView):
    queryset = Batch.objects.all()
    serializer_class = BatchSerializer


class SupplierRegister(CreateAPIView):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer