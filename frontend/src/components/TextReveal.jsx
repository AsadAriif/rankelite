import React, { useRef, useEffect } from 'react';
import { useReducedMotion, gsap, ScrollTrigger, LUXURY_EASE, LUXURY_EASE_INOUT } from '../utils/useCinematicAnimation';

/**
 * Art-directed TextReveal component:
 * - 'line': Emerging upward from clipped container boundary with zero bounce
 * - 'word': Editorial sequential word entrance
 * - 'mask': Mask reveal through smooth clip-path
 */
const TextReveal = ({
  children,
  type = 'line', // 'line', 'word', 'mask'
  delay = 0,
  duration = 0.85,
  className = '',
  as = 'div'
}) => {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();
  const Component = as;

  useEffect(() => {
    if (reducedMotion || !containerRef.current) return;

    const el = containerRef.current;

    if (type === 'word' && typeof children === 'string') {
      const words = el.querySelectorAll('.text-word-child');
      gsap.fromTo(
        words,
        { y: '100%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration,
          delay,
          stagger: 0.035,
          ease: LUXURY_EASE,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    } else if (type === 'mask') {
      gsap.fromTo(
        el,
        { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', opacity: 0 },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          opacity: 1,
          duration: duration * 1.1,
          delay,
          ease: LUXURY_EASE_INOUT,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    } else {
      // Line reveal from clipping boundary below
      gsap.fromTo(
        el,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          delay,
          ease: LUXURY_EASE,
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === el) t.kill();
      });
    };
  }, [type, delay, duration, children, reducedMotion]);

  if (type === 'word' && typeof children === 'string') {
    const words = children.split(' ');
    return (
      <Component ref={containerRef} className={`inline-block ${className}`}>
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden mr-[0.25em] align-top">
            <span className="text-word-child inline-block">{word}</span>
          </span>
        ))}
      </Component>
    );
  }

  return (
    <Component ref={containerRef} className={`will-change-transform ${className}`}>
      {children}
    </Component>
  );
};

export default TextReveal;
