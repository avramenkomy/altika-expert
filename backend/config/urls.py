from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include, re_path
from django.contrib.sitemaps.views import sitemap

from .frontend import frontend_view
from .seo_views import robots_txt
from .sitemaps import sitemaps

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/applications/', include('applications.urls')),
    path('api/company/', include('company.urls')),
    path('api/services/', include('services.urls')),
    path('api/experts/', include('experts.urls')),

    path('sitemap.xml', sitemap, { 'sitemaps': sitemaps }, name='sitemap'),
    path('robots.txt', robots_txt, name='robots'),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )

urlpatterns+= [
    re_path( r'^.*$', frontend_view, name="frontend", )
]
