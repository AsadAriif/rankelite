import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Master Luxury Easing Curves
export const LUXURY_EASE = 'power3.out'; // Fast initial movement, smooth deceleration landing
export const LUXURY_EASE_INOUT = 'power3.inOut';
export const EDITORIAL_EASE = 'power2.out';

/**
 * Check if the user prefers reduced motion for accessibility
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => setPrefersReducedMotion(e.matches);
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  return prefersReducedMotion;
};

/**
 * Hook to track scroll direction (down vs up)
 */
export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('down');

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const updateScrollDirection = () => {
      const scrollY = window.scrollY;
      const direction = scrollY > lastScrollY ? 'down' : 'up';
      if (direction !== scrollDirection && Math.abs(scrollY - lastScrollY) > 5) {
        setScrollDirection(direction);
      }
      lastScrollY = scrollY > 0 ? scrollY : 0;
    };

    window.addEventListener('scroll', updateScrollDirection);
    return () => window.removeEventListener('scroll', updateScrollDirection);
  }, [scrollDirection]);

  return scrollDirection;
};

/**
 * Hook to track scroll velocity for subtle velocity-based motion adjustments
 */
export const useScrollVelocity = () => {
  const [velocity, setVelocity] = useState(0);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = Date.now();
    let rafId = null;

    const checkVelocity = () => {
      const currentScrollY = window.scrollY;
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTime || 1;
      const scrollDelta = currentScrollY - lastScrollY;
      
      const v = Math.abs(scrollDelta / timeDelta);
      setVelocity(Math.min(v, 3)); // Cap velocity multiplier

      lastScrollY = currentScrollY;
      lastTime = currentTime;
      rafId = requestAnimationFrame(checkVelocity);
    };

    rafId = requestAnimationFrame(checkVelocity);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return velocity;
};

/**
 * Reusable GSAP Context cleanup hook
 */
export const useGSAPContext = (effect, scope, deps = []) => {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(effect, scope);
    return () => ctx.revert();
    // eslint-disable-next-deps
  }, [reducedMotion, scope, ...deps]);
};

export { gsap, ScrollTrigger };
