from django.urls import path, include
from rest_framework.routers import DefaultRouter
from countries import views

router = DefaultRouter()
router.register('', views.CountriesViewSet)

app_name = 'countries'

urlpatterns = [
    path('', include(router.urls))
]
