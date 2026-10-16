import json
import re

from django.test import TestCase, override_settings
from company.seo import DEFAULT_DESCRIPTION

@override_settings( DEBUG=True, SITE_URL='https://altika-expert.ru', )
class SeoTests(TestCase):
    def test_homepage_returns_200(self):
        response = self.client.get('/')

        self.assertEqual(response.status_code, 200)

    def test_homepage_has_canonical_url(self):
        response = self.client.get('/')

        content = response.content.decode()

        self.assertIn(
            '<link rel="canonical" href="https://altika-expert.ru"',
            content,
        )

    def test_homepage_has_meta_description(self):
        response = self.client.get('/')

        content = response.content.decode()

        self.assertIn(
            (
                'content="Судебные и внесудебные экспертизы, '
                'оценка имущества и экспертные услуги.'
            ),
            content,
        )

    def test_default_description_is_string(self):
        self.assertIsInstance(
            DEFAULT_DESCRIPTION,
            str,
        )

    def test_homepage_has_organization_structured_data(self):
        response = self.client.get('/')

        content = response.content.decode()

        match = re.search(
            r'<script type="application/ld\+json">\s*'
            r'(.*?)'
            r'\s*</script>',
            content,
            re.DOTALL,
        )

        self.assertIsNotNone(match)

        structured_data = json.loads(
            match.group(1)
        )

        self.assertEqual(
            structured_data['@context'],
            'https://schema.org',
        )

        organization = structured_data['@graph'][0]

        self.assertEqual(
            organization['@type'],
            'Organization',
        )

        self.assertEqual(
            organization['@id'],
            'https://altika-expert.ru/#organization',
        )

    def test_unknown_page_returns_404(self):
        response = self.client.get(
            '/this-page-does-not-exist/',
        )

        self.assertEqual(
            response.status_code,
            404,
        )

    def test_unknown_page_has_noindex(self):
        response = self.client.get(
            '/this-page-does-not-exist/',
        )

        content = response.content.decode()

        self.assertIn(
            'content="noindex, nofollow"',
            content,
        )

    def test_robots_txt(self):
        response = self.client.get(
            '/robots.txt',
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        content = response.content.decode()

        self.assertIn(
            'User-agent: *',
            content,
        )

        self.assertIn(
            'Disallow: /admin/',
            content,
        )

        self.assertIn(
            'Disallow: /api/',
            content,
        )

        self.assertIn(
            (
                'Sitemap: '
                'https://altika-expert.ru/sitemap.xml'
            ),
            content,
        )

    def test_sitemap_returns_xml(self):
        response = self.client.get(
            '/sitemap.xml',
        )

        self.assertEqual(
            response.status_code,
            200,
        )

        self.assertIn(
            'application/xml',
            response['Content-Type'],
        )

        content = response.content.decode()

        self.assertIn(
            '<urlset',
            content,
        )
