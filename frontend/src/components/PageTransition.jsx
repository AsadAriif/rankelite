import React, { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useReducedMotion, gsap, LUXURY_EASE_INOUT } from '../utils/useCinematicAnimation';

const PageTransition = ({ children }) => {
  const location = useLocation();
  const overlayRef = useRef(null);
  const contentRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !overlayRef.current || !contentRef.current) return;

    const overlay = overlayRef.current;
    const content = contentRef.current;

    // Fast, elegant curtain transition layer (700ms)
    const tl = gsap.timeline();

    tl.set(overlay, { clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)', display: 'block' })
      .to(overlay, {
        clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
        duration: 0.35,
        ease: 'power2.in'
      })
      .fromTo(
        content,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      )
      .to(
        overlay,
        {
          clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)',
          duration: 0.35,
          ease: 'power2.out'
        },
        '-=0.2'
      )
      .set(overlay, { display: 'none' });

    return () => tl.kill();
  }, [location.pathname, reducedMotion]);

  return (
    <div className="relative">
      {/* Fast Cinematic Transition Overlay Layer */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[9990] bg-gradient-to-r from-[#2E1065] via-[#7C3AED] to-[#059669] pointer-events-none hidden"
        style={{ willChange: 'clip-path' }}
      />
      <div ref={contentRef}>{children}</div>
    </div>
  );
};

export default PageTransition;
