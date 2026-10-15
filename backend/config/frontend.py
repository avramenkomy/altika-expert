from django.conf import settings
from django.shortcuts import render

from company.seo import (
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SeoData,
  resolve_seo,
)


def frontend_view(request):
    seo = resolve_seo(request.path)

    status = 200

    if seo is None:
        seo = SeoData(
            title=f'Страница не найдена | {DEFAULT_TITLE}',
            description='',
            noindex=True,
        )

        status = 404

    site_url = settings.SITE_URL.rstrip('/')
    path = request.path.rstrip('/') or '/'

    canonical_url = (
        site_url
        if path == '/'
        else f'{site_url}{path}'
    )

    image_url = ''

    if seo.image:
        image_url = request.build_absolute_uri( seo.image, )

    context = {
        'seo': seo,
        'canonical_url': canonical_url,
        'image_url': image_url,
        'vite_dev_server_url': (
            settings.VITE_DEV_SERVER_URL
            if settings.DEBUG
            else ''
        )
    }

    return render(
        request,
        'frontend/index.html',
        context,
        status=status
    )