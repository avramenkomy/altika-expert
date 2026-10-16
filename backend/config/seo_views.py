from django.conf import settings
from django.http import HttpResponse


def robots_txt(request):
    site_url = settings.SITE_URL.rstrip('/')

    if settings.PREVIEW_MODE:
        return HttpResponse(
            'User-agent: *\nDisallow: /\n',
            content_type='text/plain',
        )

    lines = [
        'User-agent: *',
        'Allow: /',
        'Disallow: /admin/',
        'Disallow: /api/',
        '',
        f'Sitemap: {site_url}/sitemap.xml',
    ]

    return HttpResponse(
        '\n'.join(lines),
        content_type='text/plain',
    )