from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.


class Manufacturer(models.Model):
    manufacturer_name = models.CharField(max_length=70)
    location = models.CharField(max_length=250)
    phone_number = models.CharField(max_length=15)
    address = models.TextField
    email = models.EmailField


class Supplier(models.Model):
    supplier_name = models.CharField(max_length=70)
    location = models.CharField(max_length=250)
    phone_number = models.CharField(max_length=15)
    address = models.TextField
    email = models.EmailField


class Product(models.Model):
    product_name = models.CharField(max_length=70)
    manufacturer = models.ForeignKey(Manufacturer)


class Batch(models.Model):
    product = models.ForeignKey(Product)
    supplier = models.ForeignKey(Supplier)
    count = models.DecimalField(max_digits=10, decimal_places=2)
    available_count = models.DecimalField(max_digits=10, decimal_places=2)
    manufacturing_date = models.DateField
    expire_date = models.DateField
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_date = models.DateField
    power = models.DecimalField(max_digits=10, decimal_places=4)



















