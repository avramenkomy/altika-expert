import { useEffect } from 'react';
import { useLocation } from 'react-router';


function ScrollToHash() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto', });

      return;
    }

    const id = decodeURIComponent(hash.slice(1));

    const scrollToElement = () => {
      const element = document.getElementById(id);

      if (!element) return false;

      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });

      return true;
    }

    if (scrollToElement()) return;

    const observer = new MutationObserver(() => {
      if (scrollToElement()) {
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [pathname, hash]);

  return null;
}

export default ScrollToHash;
