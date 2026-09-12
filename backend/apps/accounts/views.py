from rest_framework.generics import RetrieveAPIView
from rest_framework_simplejwt.views import TokenObtainPairView

from apps.accounts.serializers import CafeTokenObtainPairSerializer, StaffSerializer


class LoginView(TokenObtainPairView):
    serializer_class = CafeTokenObtainPairSerializer


class MeView(RetrieveAPIView):
    serializer_class = StaffSerializer

    def get_object(self):
        return self.request.user

# Step 3/4: add RegisterView (owner signup) + staff management viewset.
