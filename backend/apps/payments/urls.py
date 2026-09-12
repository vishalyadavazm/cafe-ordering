from django.urls import path

from apps.payments.views import razorpay_create, razorpay_verify, razorpay_webhook

urlpatterns = [
    path("razorpay/order/", razorpay_create, name="rzp-create"),
    path("razorpay/verify/", razorpay_verify, name="rzp-verify"),
    path("razorpay/webhook/", razorpay_webhook, name="rzp-webhook"),
]
