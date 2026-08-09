import React, { useRef, useEffect } from 'react';
import { useReducedMotion, gsap, ScrollTrigger } from '../utils/useCinematicAnimation';

const CinematicImage = ({
  src,
  alt = '',
  className = '',
  imageClassName = '',
  aspectRatio = 'aspect-video',
  parallax = true
}) => {
  const containerRef = useRef(null);
  const imgRef = useRef(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !containerRef.current || !imgRef.current) return;

    const container = containerRef.current;
    const img = imgRef.current;

    // Mask & scale reveal animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.fromTo(
      container,
      { clipPath: 'polygon(0 0, 0 0, 0 100%, 0 100%)', opacity: 0 },
      { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', opacity: 1, duration: 1.1, ease: 'power3.inOut' }
    ).fromTo(
      img,
      { scale: 1.12 },
      { scale: 1, duration: 1.4, ease: 'power2.out' },
      '<0.1'
    );

    // Subtle parallax scroll effect
    if (parallax) {
      gsap.to(img, {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.8
        }
      });
    }

    return () => {
      tl.kill();
    };
  }, [reducedMotion, parallax]);

  return (
    <div
      ref={containerRef}
      className={`cinematic-image-container overflow-hidden relative rounded-3xl ${aspectRatio} ${className}`}
    >
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`cinematic-image-target w-full h-full object-cover ${imageClassName}`}
      />
    </div>
  );
};

export default CinematicImage;
