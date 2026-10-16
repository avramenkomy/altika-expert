from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Application
from .notifications import notify_about_application
from .serializers import ApplicationSerializer
from .throttles import AplllicationBurstThrottle, ApplicationSustainedThrottle


class ApplicationCreateView(generics.CreateAPIView):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    authentication_classes = []
    permission_classes = (AllowAny, )
    throttle_classes = (
        AplllicationBurstThrottle,
        ApplicationSustainedThrottle,
    )

    def perform_create(self, serializer):
        application = serializer.save()
        notify_about_application(application)
