import { useEffect } from 'react';


function PageSeo({ title, description }) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    let metaDescription = document.querySelector(
      'meta[name=description]',
    )

    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }

    if (description) {
      metaDescription.setAttribute(
        'content',
        description
      );
    } else {
      metaDescription.removeAttribute('content');
    }
  }, [title, description]);

  return null;
}

export default PageSeo;
