import React, { useEffect, useState, useRef } from 'react';
import { useReducedMotion } from '../utils/useCinematicAnimation';

const CustomCursor = () => {
  const targetPos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const ringPos = useRef({ x: -100, y: -100 });
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) return;

    // Check for fine pointer and window width > 768
    const isFinePointer = window.matchMedia('(pointer: fine)').matches && window.innerWidth > 768;
    if (!isFinePointer) return;

    document.body.classList.add('has-custom-cursor');

    const handleMouseMove = (e) => {
      targetPos.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    const handleElementHover = (e) => {
      const target = e.target;
      const isInteractive = target.closest('a, button, [role="button"], input, select, textarea, .hud-card, .category-hero-block');
      setIsHovered(!!isInteractive);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseover', handleElementHover);

    // Lerp animation loop for physical inertia
    let animId;
    const lerp = (start, end, factor) => start + (end - start) * factor;

    const render = () => {
      // Precise dot lerp (fast)
      currentPos.current.x = lerp(currentPos.current.x, targetPos.current.x, 0.45);
      currentPos.current.y = lerp(currentPos.current.y, targetPos.current.y, 0.45);

      // Smooth ambient ring lerp (inertia lag)
      ringPos.current.x = lerp(ringPos.current.x, targetPos.current.x, 0.16);
      ringPos.current.y = lerp(ringPos.current.y, targetPos.current.y, 0.16);

      if (dotRef.current) {
        const scale = isClicking ? 0.6 : isHovered ? 1.4 : 1;
        dotRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0) scale(${scale})`;
      }

      if (ringRef.current) {
        const scale = isClicking ? 0.85 : isHovered ? 1.75 : 1;
        ringRef.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0) scale(${scale})`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseover', handleElementHover);
    };
  }, [reducedMotion, isVisible, isHovered, isClicking]);

  if (reducedMotion || !isVisible) return null;

  return (
    <>
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full bg-[#7C3AED] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#7C3AED]"
        style={{ willChange: 'transform' }}
      />
      
      {/* Smooth Ambient Inertia Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-[#7C3AED]/40 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 bg-[#7C3AED]/10 backdrop-blur-[1px] transition-colors duration-300"
        style={{ willChange: 'transform' }}
      />
    </>
  );
};

export default CustomCursor;
