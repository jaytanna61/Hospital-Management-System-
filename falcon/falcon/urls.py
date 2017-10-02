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
from IPython.core.magics import namespace
from django.conf.urls import url, include
from django.contrib import admin
from rest_framework.urlpatterns import format_suffix_patterns
from setuptools import namespaces

from accounts import views
from receptionist import  views as rec
from accounts.views import receptionist

urlpatterns = [
    url(r'^$', views.home, name="home"),
    url(r'^admin/', admin.site.urls, name="admin"),
    url(r'^login/', views.login_view, name="login"),
    url(r'^logout/', views.logout_view, name="logout"),
    url(r'^doctors/', views.doctors, name="doctors"),
    url(r'^receptionist/', views.receptionist, name="receptionist"),
    url(r'^pharmacy/', views.pharmacy, name="pharmacy"),
    url(r'^test', views.test, name="test"),
    url(r'^work', views.test2, name="register"),
    url(r'^api/accounts/', include('accounts.api.urls', namespace='api')),
]

