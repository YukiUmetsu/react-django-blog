from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tickets import views

router = DefaultRouter()
router.register('', views.TicketsViewSet)

app_name = 'tickets'

urlpatterns = [
    path('', include(router.urls))
]