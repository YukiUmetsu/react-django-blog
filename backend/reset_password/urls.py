from django.urls import path, include
from rest_framework.routers import DefaultRouter
from reset_password import views

router = DefaultRouter()
router.register('', views.ResetPasswordViewSet)
router.register('confirm', views.ResetPasswordConfirmViewSet)

app_name = 'reset_password'

urlpatterns = [
    path('', include(router.urls))
]