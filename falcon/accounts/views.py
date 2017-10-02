from django.contrib import messages
from django.contrib.auth import (
    authenticate,
    login,
    logout,

)
from django.contrib.auth.decorators import login_required
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.shortcuts import render, redirect
# API--------------------------------------------------
from rest_framework.response import Response
from rest_framework.views import APIView

from .forms import UserLoginForm, UserCreateForm

# Create your views here.

TITLE = "We Care"


def login_view(request):
    title = "Login"
    form = UserLoginForm(request.POST or None)
    if form.is_valid():
        username = form.cleaned_data.get("username")
        password = form.cleaned_data.get("password")
        user = authenticate(username=username, password=password)

        login(request, user)
        if user.groups.filter(name="Admin").exists():
            return redirect(reverse('home'))
        elif user.groups.filter(name="Doctors").exists():
            return redirect('doctors')
        elif user.groups.filter(name="receptionist").exists():
            return redirect('receptionist')
        elif user.groups.filter(name="pharmacy").exists():
            return redirect('pharmacy')
        return render(request, "home.html", {"form": form, "title": title})

    return render(request, "accounts/login.html", {"form": form, "title": title})


def register_view(request):
    return render(request, "form.html", {})


def logout_view(request):
    logout(request)
    return redirect(reverse('login'))

@login_required(login_url='/login/')
def home(request):
    return render(request, "home.html", {})

@login_required(login_url='/login/')
def doctors(request):
    return render(request, "doctor.html", {})

@login_required(login_url='/login/')
def receptionist(request):
    return render(request, "receptionist.html", {})

@login_required(login_url='/login/')
def pharmacy(request):
    return render(request, "pharmacy.html", {})


# ---------------------------------------------------- Development Testing Methods --------------------
@login_required(login_url='/login/')
def PasswordReset(request):
    if request.method == 'POST':
        form = PasswordChangeForm(request.user, request.POST)
        if form.is_valid():
            # user = form.save()
            # update_session_auth_hash(request, user)  # Important!
            messages.success(request, 'Your password was successfully updated!')
            return redirect('home')
        else:
            messages.error(request, 'Please correct the error below.')
    else:
        form = PasswordChangeForm(request.user)
    return render(request, 'accounts/login.html', {
        'form': form
    })


@login_required(login_url='/login/')
def test2(request):
    title="Sign Up"
    if request.method == 'POST':
        form = UserCreateForm(request.POST)
        if form.is_valid():

            user = form.save()
            # update_session_auth_hash(request, user)  # Important!
            messages.success(request, 'Your password was successfully updated!')
            return redirect('home')
        else:
            messages.error(request, 'Please correct the error below.')
    else:
        form = UserCreateForm()
    return render(request, 'accounts/login.html', {
        'form': form,
        'title': title
    })



