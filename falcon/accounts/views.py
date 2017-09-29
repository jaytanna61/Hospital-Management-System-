from django.shortcuts import render, redirect
from django.core.urlresolvers import reverse
from django.contrib.auth.decorators import login_required
from django.contrib.auth import (
    authenticate,
    get_user_model,
    login,
    logout,
)

from .forms import UserLoginForm

# Create your views here.


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

    return render(request, "form.html", {"form": form, "title": title})


def register_view(request):
    return render(request, "form.html", {})


def logout_view(request):
    logout(request)
    return redirect(reverse('login'))


def home(request):
    return render(request, "home.html", {})


def doctors(request):
    return render(request, "doctor.html", {})


def receptionist(request):
    return render(request, "receptionist.html", {})


def pharmacy(request):
    return render(request, "pharmacy.html", {})



