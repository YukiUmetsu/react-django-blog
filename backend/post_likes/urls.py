from django.urls import path, include
from rest_framework.routers import DefaultRouter
from post_likes import views

router = DefaultRouter()
router.register("", views.PostLikesViewSet)

app_name = 'post_likes'

urlpatterns = [
    path('', include(router.urls))
]