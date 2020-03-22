from django.urls import path, include
from rest_framework.routers import DefaultRouter
from post_states import views

router = DefaultRouter()
router.register('', views.PostStatesViewSet)

app_name = 'post_states'

urlpatterns = [
    path('', include(router.urls))
]
