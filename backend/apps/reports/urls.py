from django.urls import path

from apps.reports.views import summary

urlpatterns = [path("summary/", summary, name="reports-summary")]
