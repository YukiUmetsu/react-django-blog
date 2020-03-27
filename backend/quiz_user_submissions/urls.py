from django.urls import path, include
from rest_framework.routers import DefaultRouter
from quiz_user_submissions import views

router = DefaultRouter()
router.register('', views.QuizUserSubmissionsViewSet)

app_name = 'quiz_user_submissions'

urlpatterns = [
    path('', include(router.urls))
]