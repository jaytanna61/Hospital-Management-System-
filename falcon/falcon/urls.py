"""falcon URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.11/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from accounts import views


urlpatterns = [
    url(r'^$', views.home, name="home"),
    url(r'^admin/', admin.site.urls, name="admin"),
    url(r'^login/', views.login_view, name="login"),
    url(r'^logout/', views.logout_view, name="logout"),
    url(r'^doctors/', views.doctors, name="doctors"),
    url(r'^receptionist/', views.receptionist, name="receptionist"),
    url(r'^pharmacy/', views.pharmacy, name="pharmacy"),
    url(r'^reset', views.PasswordReset, name="reset"),
    url(r'^register', views.test2, name="register"),
    url(r'^api/patients/', include('patient.api.urls', namespace='patients_api')),
    url(r'^api/pharmacy/', include('pharmacy.api.urls', namespace='pharmacy_api')),
    url(r'^api/pharmacy/', include('pharmacy.api.urls', namespace='pharmacy_api')),
]

