from django.urls import path, include
from rest_framework.routers import DefaultRouter
from quizzes import views

router = DefaultRouter()
router.register('', views.QuizzesViewSet)

app_name = 'quizzes'

urlpatterns = [
    path('', include(router.urls))
]