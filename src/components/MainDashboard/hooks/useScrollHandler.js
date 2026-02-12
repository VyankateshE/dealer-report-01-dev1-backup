import { useState, useEffect, useRef } from 'react';

const useScrollHandler = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [showQuickActionBtn, setShowQuickActionBtn] = useState(true);
  const [lastScrollTop, setLastScrollTop] = useState(0);
  const [isVerticalScroll, setIsVerticalScroll] = useState(false);
  
  const headerRef = useRef(null);
  const originalHeaderOffsetTop = useRef(0);

  useEffect(() => {
    if (headerRef.current) {
      originalHeaderOffsetTop.current = headerRef.current.offsetTop;
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      setShowQuickActionBtn(scrollY < lastScrollTop);
      setLastScrollTop(scrollY <= 0 ? 0 : scrollY);
      setIsSticky(scrollY >= originalHeaderOffsetTop.current);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollTop]);

  return {
    isSticky,
    showQuickActionBtn,
    lastScrollTop,
    isVerticalScroll,
    headerRef,
    originalHeaderOffsetTop
  };
};

export default useScrollHandler;