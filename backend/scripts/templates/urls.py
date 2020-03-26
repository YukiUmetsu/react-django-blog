from django.urls import path, include
from rest_framework.routers import DefaultRouter
from app_name__ import views

router = DefaultRouter()
router.register('', views.Model__ViewSet)

app_name = 'app_name__'

urlpatterns = [
    path('', include(router.urls))
]