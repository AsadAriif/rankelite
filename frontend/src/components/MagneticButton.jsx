import React, { useRef } from 'react';
import { useReducedMotion, gsap, LUXURY_EASE } from '../utils/useCinematicAnimation';

const MagneticButton = ({ children, className = '', strength = 0.25, onClick, ...props }) => {
  const buttonRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e) => {
    if (reducedMotion || !buttonRef.current || window.innerWidth <= 768) return;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    // Restrain movement distance (max 6px offset)
    const deltaX = Math.max(-6, Math.min(6, (e.clientX - centerX) * strength));
    const deltaY = Math.max(-6, Math.min(6, (e.clientY - centerY) * strength));

    gsap.to(buttonRef.current, {
      x: deltaX,
      y: deltaY,
      duration: 0.3,
      ease: LUXURY_EASE,
      overwrite: 'auto'
    });
  };

  const handleMouseLeave = () => {
    if (reducedMotion || !buttonRef.current) return;
    gsap.to(buttonRef.current, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.4)',
      overwrite: 'auto'
    });
  };

  return (
    <div
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default MagneticButton;
