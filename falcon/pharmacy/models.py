from django.db import models
from django.contrib.auth import get_user_model
# Create your models here.


class Manufacturer(models.Model):
    manufacturer_name = models.CharField(max_length=70)
    location = models.CharField(max_length=250)
    phone_number = models.CharField(max_length=15)
    address = models.TextField(default='')
    email = models.EmailField(default='x@y.com')

    def __str__(self):
        return self.manufacturer_name


class Supplier(models.Model):
    supplier_name = models.CharField(max_length=70)
    location = models.CharField(max_length=250)
    phone_number = models.CharField(max_length=15)
    address = models.TextField(default='')
    email = models.EmailField(default='x@y.com')

    def __str__(self):
        return self.supplier_name

class Product(models.Model):
    product_name = models.CharField(max_length=70)
    manufacturer = models.ForeignKey(Manufacturer)

    def __str__(self):
        return self.product_name

class Batch(models.Model):
    product = models.ForeignKey(Product)
    supplier = models.ForeignKey(Supplier)
    count = models.DecimalField(max_digits=10, decimal_places=2)
    available_count = models.DecimalField(max_digits=10, decimal_places=2)
    manufacturing_date = models.DateField(default='2001-12-21')
    expire_date = models.DateField(default='2001-12-21')
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    purchase_date = models.DateField(default='2001-12-21')
    power = models.DecimalField(max_digits=10, decimal_places=4)

    def __str__(self):
        return self.id




















