from django.conf import settings
from django.utils.html import strip_tags

from company.models import Expertise, ValuationType, Company
from experts.models import Expert
from services.models import Service


def _site_url():
    return settings.SITE_URL.rstrip('/')


def _clean_text(value):
    if not value:
        return ''

    return ' '.join(strip_tags(str(value)).split())


def _absolute_image_url(image):
    if not image:
        return ''

    try:
        image_url = image.url
    except(ValueError, AttributeError):
        return ''

    if image_url.startswith(('http://', 'https://')):
        return image_url

    return f'{_site_url()}{image_url}'


def _organization_schema():
    site_url = _site_url()

    company = Company.objects.first()

    schema = {
        '@type': 'Organization',
        '@id': f'{site_url}/#organization',
        'name': 'Экспертное бюро «Альтика»',
        'legalName': (company.name if company else 'Экспертное бюро «Альтика»'),
        'url': site_url,
        'logo': f'{site_url}/static/frontend/logo.svg',
        'areaServed': {
            '@type': 'Country',
            'name': 'Россия',
        }
    }

    if not company: return schema

    if company.short_name:
        schema['alternateName'] = company.short_name

    if company.description:
        schema['description'] = company.description

    if company.phone:
        schema['telephone'] = company.phone

    if company.email:
        schema['email'] = company.email

    if company.address:
        schema['address'] = {
            '@type': 'PostalAddress',
            'streetAddress': company.address,
            'addressCountry': 'RU',
        }

    if company.inn:
        schema['taxID'] = company.inn

    identifiers = []

    if company.ogrn:
        identifiers.append({
            '@type': 'PropertyValue',
            'propertyID': 'ОГРН',
            'value': company.ogrn
        })

    if company.kpp:
        identifiers.append({
            '@type': 'PropertyValue',
            'propertyID': 'КПП',
            'value': company.kpp
        })

    if identifiers:
        schema['identifier'] = identifiers

    if ( company.latitude is not None and company.longitude is not None ):
        schema['location'] = {
            '@type': 'Place',
            'address': company.address or '',
            'geo': {
                '@type': 'GeoCoordinates',
                'latitude': float(company.latitude),
                'longitude': float(company.longitude),
            },
        }

    return schema


def _service_schema(item, url):
    description = (
        getattr(item, 'seo_description', '')
        or getattr(item, 'short_description', '')
        or getattr(item, 'description', '')
    )

    schema = {
        '@type': 'Service',
        '@id': f'{url}#service',
        'name': item.title,
        'serviceType': item.title,
        'description': _clean_text(description),
        'url': url,
        'provider': {
            '@id': f'{_site_url()}/#organization',
        },
        'areaServed': {
            '@type': 'Country',
            'name': 'Россия',
        },
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': url,
        },
    }

    image_url = _absolute_image_url(getattr(item, 'image', None))

    if image_url:
        schema['image'] = image_url

    return schema


def _expert_schema(expert, url):
    description = (
        getattr(expert, 'seo_description', '')
        or getattr(expert, 'biography', '')
        or getattr(expert, 'qualification', '')
    )

    positions = [
        position.title
        for position in expert.positions.all()
    ]

    specializations = [
        specialization.title
        for specialization in expert.specializations.all()
    ]

    schema = {
        '@type': 'Person',
        '@id': f'{url}#person',
        'name': str(expert),
        'url': url,
        'description': _clean_text(description),
        'worksFor': {
            '@id': f'{_site_url()}/#organization',
        },
        'mainEntityOfPage': {
            '@type': 'WebPage',
            '@id': url,
        },
    }

    if positions:
        schema['jobTitle'] = positions

        schema['hasOccupation'] = [
            {
                '@type': 'Occupation',
                'name': position
            } for position in positions
        ]


    if specializations:
        schema['knowsAbout'] = specializations

    photo_url = _absolute_image_url(
        getattr(expert, 'photo', None)
    )

    if photo_url:
        schema['image'] = photo_url

    return schema


def _graph(entity=None):
    graph = [
        _organization_schema(),
    ]

    if entity:
        graph.append(entity)

    return {
        '@context': 'https://schema.org',
        '@graph': graph,
    }


def resolve_structured_data(path):
    clean_path = path.strip('/')

    if not clean_path:
        return _graph()

    parts = clean_path.split('/')

    if len(parts) != 2:
        return None

    section, slug = parts
    site_url = _site_url()

    if section == 'expertises':
        item = Expertise.objects.filter(
            slug=slug,
            is_active=True,
        ).first()

        if not item:
            return None

        url = f'{site_url}/expertises/{slug}'

        return _graph(
            _service_schema(item, url)
        )

    if section == 'valuation':
        item = ValuationType.objects.filter(
            slug=slug,
            is_active=True,
        ).first()

        if not item:
            return None

        url = f'{site_url}/valuation/{slug}'

        return _graph(
            _service_schema(item, url)
        )

    if section == 'services':
        item = Service.objects.filter(
            slug=slug,
            is_active=True,
        ).first()

        if not item:
            return None

        url = f'{site_url}/services/{slug}'

        return _graph(
            _service_schema(item, url)
        )

    if section == 'experts':
        expert = (Expert.objects
          .prefetch_related( 'positions', 'specializations', )
          .filter( slug=slug, is_active=True, )
          .first()
        )

        if not expert:
            return None

        url = f'{site_url}/experts/{slug}'

        return _graph(
            _expert_schema(expert, url)
        )

    return None
