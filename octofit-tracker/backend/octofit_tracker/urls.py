"""octofit_tracker URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
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
import os
from rest_framework.response import Response
from rest_framework.decorators import api_view


@api_view(['GET'])
def api_root(request, format=None):
    """Return API root links using the Codespace URL when available.

    This builds URLs using the environment variable `CODESPACE_NAME` so
    the returned links use the Codespace hostname (https://$CODESPACE_NAME-8000.app.github.dev)
    which avoids certificate issues when accessing the API through the Codespace URL.
    """
    codespace = os.environ.get('CODESPACE_NAME')
    if codespace:
        base = f"https://{codespace}-8000.app.github.dev/api"
    else:
        # Fallback to request-derived base
        scheme = request.scheme
        host = request.get_host()
        base = f"{scheme}://{host}/api"

    return Response({
        'users': f"{base}/users/",
        'teams': f"{base}/teams/",
        'activities': f"{base}/activities/",
        'workouts': f"{base}/workouts/",
        'leaderboard': f"{base}/leaderboard/",
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
    path('', api_root, name='api-root'),
]
