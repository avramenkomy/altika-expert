import { useEffect } from 'react';
import { useLocation } from 'react-router';


function ScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

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
  }, [hash]);

  return null;
}

export default ScrollToHash;
