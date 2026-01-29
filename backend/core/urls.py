from django.contrib import admin
from django.urls import path, include
from api.auth_views import CustomAuthToken

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/login/', CustomAuthToken.as_view(), name='api_token_auth'),
]
