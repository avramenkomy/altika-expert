import json

from django.conf import settings
from django.shortcuts import render

from company.seo import (
  DEFAULT_DESCRIPTION,
  DEFAULT_TITLE,
  SeoData,
  resolve_seo,
)

from company.structured_data import resolve_structured_data


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

    structured_data = resolve_structured_data(
        request.path
    )

    structured_data_json = ''

    if structured_data:
        structured_data_json = json.dumps(
            structured_data,
            ensure_ascii=False,
            separators=(',', ':'),
        ).replace('</', '<\\/')

    site_url = settings.SITE_URL.rstrip('/')
    path = request.path.rstrip('/') or '/'

    canonical_url = (
        site_url
        if path == '/'
        else f'{site_url}{path}'
    )

    image_url = ''

    if seo.image:
        image_path = str(seo.image)

        if image_path.startswith(('http://', 'https://')):
            image_url = image_path
        else:
            image_url = f'{site_url}{image_path}'

    vite_assets = None

    if not settings.DEBUG:
        vite_assets = get_vite_assets()

    context = {
        'seo': seo,
        'canonical_url': canonical_url,
        'image_url': image_url,
        'structured_data_json': structured_data_json,
        'vite_dev_server_url': (
            settings.VITE_DEV_SERVER_URL
            if settings.DEBUG
            else ''
        ),
        'vite_assets': vite_assets,
    }

    return render(
        request,
        'frontend/index.html',
        context,
        status=status
    )

def get_vite_assets():
    manifest_path = (
        settings.BASE_DIR
        / 'static'
        / 'frontend'
        / 'build'
        / '.vite'
        / 'manifest.json'
    )

    if not manifest_path.exists():
        return None

    with manifest_path.open( 'r', encoding='utf-8' ) as manifest_file:
        manifest = json.load(manifest_file)

    entry = manifest.get('index.html')

    if not entry:
        return None

    return {
        'js': f'frontend/build/{entry['file']}',
        'css': [
            f'frontend/build/{css_file}'
            for css_file in entry.get('css', [])
        ],
    }