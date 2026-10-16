from dataclasses import dataclass

from experts.models import Expert
from services.models import Service

from .models import Expertise, SiteSettings, ValuationType

@dataclass
class SeoData:
    title: str
    description: str=''
    image: str=''
    noindex: bool=False

DEFAULT_TITLE = 'АНО "Экспертное бюро «Альтика»"'
DEFAULT_DESCRIPTION = (
    'Судебные и внесудебные экспертизы, оценка имущества '
    'и экспертные услуги.'
)

def get_home_seo():
    settings = SiteSettings.objects.first()

    if not settings:
        return SeoData(
            title=DEFAULT_TITLE,
            description=DEFAULT_DESCRIPTION,
        )

    return SeoData(
        title=settings.seo_title or DEFAULT_TITLE,
        description=settings.seo_description or DEFAULT_DESCRIPTION,
        image=settings.hero_image.url if settings.hero_image else '',
    )


def get_expertise_seo(slug):
    item = Expertise.objects.filter(
        slug=slug,
        is_active=True,
    ).first()

    if not item:
        return None

    return SeoData(
        title=(
            item.seo_title or f'{item.title} | АНО "Экспертное бюро «Альтика»"'
        ),
        description=item.seo_description,
        image=item.image.url if item.image else '',
    )


def get_valuation_seo(slug):
    item = ValuationType.objects.filter(
        slug=slug,
        is_active=True,
    ).first()

    if not item:
        return None

    return SeoData(
        title=(
            item.seo_title or f'{item.title} | АНО "Экспертное бюро «Альтика»"'
        ),
        description=item.seo_description,
        image=item.image.url if item.image else '',
    )


def get_service_seo(slug):
    item = Service.objects.filter(
        slug=slug,
        is_active=True,
    ).first()

    if not item:
        return None

    return SeoData(
        title=(
            item.seo_title or f'{item.title} | АНО "Экспертное бюро «Альтика»"'
        ),
        description=item.seo_description,
        image=item.image.url if item.image else '',
    )


def get_expert_seo(slug):
    item = Expert.objects.filter(
        slug=slug,
        is_active=True,
    ).first()

    if not item:
        return None

    return SeoData(
        title=(
            item.seo_title or f'{item.title} | АНО "Экспертное бюро «Альтика»"'
        ),
        description=item.seo_description,
        image=item.photo.url if item.photo else '',
    )


def resolve_seo(path):
    clean_path = path.strip('/')

    if not clean_path:
        return get_home_seo()

    parts = clean_path.split('/')

    if len(parts) != 2:
        return None

    section, slug = parts

    handlers = {
        'expertises': get_expertise_seo,
        'valuation': get_valuation_seo,
        'services': get_service_seo,
        'experts': get_expert_seo,
    }

    handler = handlers.get(section)

    if not handler:
        return None

    return handler(slug)
