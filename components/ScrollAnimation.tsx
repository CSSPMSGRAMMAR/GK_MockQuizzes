'use client';

import { useEffect, useState } from 'react';

export function ScrollAnimation() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Only run on client after mount
    setMounted(true);
    
    if (typeof window === 'undefined') return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Use a small delay to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return null;
}

