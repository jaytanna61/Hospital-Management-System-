from django.db import models
# Create your models here.


class Product(models.Model):
    product_name = models.CharField(max_length=70)
    manufacturer = models.ForeignKey(Manufacturer.id)


class Manufacturer(models.Model):
    manufacturer_name = models.CharField(max_length=70)
    location = models.CharField(max_length=250)
    phone_number = models.CharField(max_length=15)
    address = models.TextField
    email = models.EmailField


class Batch(models.Model):
    product = models.ForeignKey(Product.id)
    supplier = models.ForeignKey(Supplier.id)
    count = models.DecimalField(decimal_places=2)
    available_count = models.DecimalField(decimal_places=2)
    manufacturing_date = models.DateField
    expire_date = models.DateField
    cost = models.DecimalField(decimal_places=2)
    purchase_date = models.DateField
    power = models.DecimalField(decimal_places=4)


class Supplier(models.Model):
    supplier_name = models.CharField(max_length=70)
    location = models.CharField(max_length=250)
    phone_number = models.CharField(max_length=15)
    address = models.TextField
    email = models.EmailField













