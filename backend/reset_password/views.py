from rest_framework import status, viewsets
from .models import ResetPassword
from reset_password import serializers
from rest_framework.response import Response
from reset_password.send_reset_password_email import send, send_password_changed_email


class ResetPasswordViewSet(viewsets.ViewSet):

    queryset = ResetPassword.objects.all()
    serializer_class = serializers.ResetPasswordSerializer

    def create(self, request):
        serializer = serializers.ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            reset_obj = ResetPassword.objects.filter(email=request.data.get('email'))[0]
            # send email
            send(reset_obj.email, reset_obj.reset_token)
        return Response({'status': 'OK'}, status=status.HTTP_200_OK)


class ResetPasswordConfirmViewSet(viewsets.ViewSet):
    queryset = ResetPassword.objects.all()
    serializer_class = serializers.ResetPasswordConfirmSerializer

    def create(self, request):
        serializer = serializers.ResetPasswordConfirmSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            # send password changed email
            send_password_changed_email(request.data.get('email'))
            return Response({'status': 'OK'}, status=status.HTTP_200_OK)

        return Response({'status': 'OK'}, status=status.HTTP_200_OK)