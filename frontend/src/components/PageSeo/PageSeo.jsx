import { useEffect } from 'react';

const SITE_URL = import.meta.env.VITE_SITE_URL;


function PageSeo({ title, description, path='/', image, noIndex=false }) {
  useEffect(() => {
    const setMeta = (selector, attribute, value, content) => {
      let elem = document.head.querySelector(selector);

      if (!elem) {
        elem = document.createElement('meta');
        elem.setAttribute(attribute, value);

        document.head.appendChild(elem);
      }

      elem.setAttribute('content', content);
    }

    if (title) {
      document.title = title;

      setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    }

    if (description) {
      setMeta(
        'meta[property="og:description"]',
        'property',
        'og:description',
        description
      );
    }

    const canonicalUrl = new URL(path, SITE_URL).toString();

    let canonical = document.head.querySelector('link[rel="canonical"]');

    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');

      document.head.appendChild(canonical);
    }

    canonical.setAttribute('href', canonicalUrl);

    setMeta(
      'meta[property="og:url"]',
      'property',
      'og:url',
      canonicalUrl,
    );

    setMeta(
      'meta[property="og:type"]',
      'property',
      'og:type',
      'website',
    );

    setMeta(
      'meta[property="og:site_name"]',
      'property',
      'og:site_name',
      'Экспертное бюро "Альтика"',
    );

    setMeta(
      'meta[property="og:robots"]',
      'name',
      'robots',
      noIndex
        ? 'noindex, nofollow'
        : 'index, follow',
    );

    if (image) {
      const imageUrl = new URL(image, SITE_URL).toString();

      setMeta(
        'meta[property="og:image"]',
        'property',
        'og:image',
        imageUrl,
      );
    }
  }, [title, description, path, image, noIndex]);

  return null;
}

export default PageSeo;
