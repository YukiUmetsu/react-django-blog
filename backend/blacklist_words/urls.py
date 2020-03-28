from django.urls import path, include
from rest_framework.routers import DefaultRouter
from blacklist_words import views

router = DefaultRouter()
router.register('', views.BlacklistWordsViewSet)

app_name = 'blacklist_words'

urlpatterns = [
    path('', include(router.urls))
]