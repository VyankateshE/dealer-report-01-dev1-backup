import { useState, useEffect, useRef } from 'react';

export const useScroll = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [shouldFillBars, setShouldFillBars] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const headerRef = useRef(null);
  const originalHeaderOffsetTop = useRef(0);

  useEffect(() => {
    const header = headerRef.current;
    if (header) {
      originalHeaderOffsetTop.current = header.offsetTop;
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      // Sticky Header Logic
      setIsSticky(scrollY >= originalHeaderOffsetTop.current);

      // Fill Bars Logic
      if (scrollY > lastScrollTop) {
        setShouldFillBars(true);
      }

      setLastScrollTop(scrollY <= 0 ? 0 : scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  return {
    isSticky,
    shouldFillBars,
    headerRef
  };
};