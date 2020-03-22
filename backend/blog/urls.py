"""blog URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from django.conf.urls import url
from allauth.account.views import confirm_email

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^api/rest-auth/', include('rest_auth.urls')),
    url(r'^api/rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^api/account/', include('allauth.urls')),
    url(r'^api/accounts-rest/registration/account-confirm-email/(?P<key>.*)/$', confirm_email, name='account_confirm_email'),
    path('api/categories/', include('categories.urls'), name='categories'),
    path('api/countries/', include('countries.urls'), name='countries'),
    path('api/tags/', include('tags.urls'), name='tags'),
    path('api/post_states/', include('post_states.urls'), name='post_states'),
    path('api/posts/', include('posts.urls'), name='posts'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
