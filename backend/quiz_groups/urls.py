from django.urls import path, include
from rest_framework.routers import DefaultRouter
from quiz_groups import views

router = DefaultRouter()
router.register('', views.QuizGroupsViewSet)

app_name = 'quiz_groups'

urlpatterns = [
    path('', include(router.urls))
]