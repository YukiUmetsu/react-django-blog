from django.urls import path, include
from rest_framework.routers import DefaultRouter
from quiz_options import views

router = DefaultRouter()
router.register('', views.QuizOptionsViewSet)

app_name = 'quiz_options'

urlpatterns = [
    path('', include(router.urls))
]