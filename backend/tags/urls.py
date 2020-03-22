from django.urls import path, include
from rest_framework.routers import DefaultRouter
from tags import views

router = DefaultRouter()
router.register('', views.TagsViewSet)

app_name = 'tags'

urlpatterns = [
    path('', include(router.urls))
]
