from django.urls import path, include
from rest_framework.routers import DefaultRouter
from posts import views

router = DefaultRouter()
router.register('', views.PostsViewSet)

app_name = 'posts'

urlpatterns = [
    path('', include(router.urls))
]