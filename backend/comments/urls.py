from django.urls import path, include
from rest_framework.routers import DefaultRouter
from comments import views

router = DefaultRouter()
router.register("", views.CommentsViewSet)

app_name = 'comments'

urlpatterns = [
    path('', include(router.urls))
]