from django.contrib.sitemaps import Sitemap

from company.models import Expertise, ValuationType
from experts.models import Expert
from services.models import Service


class HomeSitemap(Sitemap):
    changefreq = 'weekly'
    priority = 1.0

    def items(self):
        return ['home']

    def location(self, item):
        return '/'


class ExpertiseSitemap(Sitemap):
    changefreq = 'monthly'
    priority = 0.9

    def items(selg):
        return Expertise.objects.filter(is_active=True)


    def location(self, item):
        return f'/expertises/{item.slug}'


class ValuationSitemap(Sitemap):
    changefreq = 'monthly'
    priority = 0.9

    def items(selg):
        return ValuationType.objects.filter(is_active=True)


    def location(self, item):
        return f'/valuation/{item.slug}'



class ServiceSitemap(Sitemap):
    changefreq = 'monthly'
    priority = 0.8

    def items(selg):
        return Service.objects.filter(is_active=True)


    def location(self, item):
        return f'/services/{item.slug}'


class ExpertSitemap(Sitemap):
    changefreq = 'monthly'
    priority = 0.7

    def items(self):
        return Expert.objects.filter(
            is_active=True,
        )

    def location(self, item):
        return f'/experts/{item.slug}'


sitemaps = {
    'home': HomeSitemap,
    'expertises': ExpertiseSitemap,
    'valuation': ValuationSitemap,
    'services': ServiceSitemap,
    'experts': ExpertSitemap,
}