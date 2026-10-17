import { useEffect } from 'react';


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
        'meta[name="description"]',
        'name',
        'description',
        description,
      );
      setMeta(
        'meta[property="og:description"]',
        'property',
        'og:description',
        description,
      )
    }

    const siteUrl = window.location.origin;
    const canonicalUrl = new URL(path, siteUrl).toString();

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
      'Экспертное бюро «Альтика»',
    );

    const robotsMeta = document.head.querySelector(
      'meta[name="robots"]',
    );

    const previewMode = robotsMeta?.dataset.previewMode === 'true';

    setMeta(
      'meta[name="robots"]',
      'name',
      'robots',
      previewMode || noIndex
        ? 'noindex, nofollow'
        : 'index, follow',
    );

    const ogImage = document.head.querySelector(
      'meta[property="og:image"]'
    );

    if (image) {
      const imageUrl = new URL(image, siteUrl).toString();

      setMeta(
        'meta[property="og:image"]',
        'property',
        'og:image',
        imageUrl,
      );
    } else if (ogImage) {
      ogImage.remove();
    }
  }, [title, description, path, image, noIndex]);

  return null;
}

export default PageSeo;
