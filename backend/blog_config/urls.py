from django.urls import path, include
from rest_framework.routers import DefaultRouter
from blog_config import views

router = DefaultRouter()
router.register('', views.BlogConfigViewSet)

app_name = 'blog_config'

urlpatterns = [
    path('', include(router.urls))
]
