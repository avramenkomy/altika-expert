from django.conf import settings
from django.http import HttpResponse


def robots_txt(request):
    site_url = settings.SITE_URL.rstrip('/')

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