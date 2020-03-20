from django.urls import path, include
from rest_framework.routers import DefaultRouter
from categories import views

router = DefaultRouter()
router.register('', views.CategoriesViewSet)

app_name = 'categories'

urlpatterns = [
    path('', include(router.urls))
]
