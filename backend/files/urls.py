from django.urls import path, include
from rest_framework.routers import DefaultRouter
from files import views

router = DefaultRouter()
router.register('', views.FilesViewSet)

app_name = 'files'

urlpatterns = [
    path('', include(router.urls))
]
