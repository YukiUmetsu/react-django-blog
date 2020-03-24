from django.urls import path, include
from rest_framework.routers import DefaultRouter
from quiz_types import views

router = DefaultRouter()
router.register('', views.QuizTypesViewSet)

app_name = 'quiz_types'

urlpatterns = [
    path('', include(router.urls))
]
