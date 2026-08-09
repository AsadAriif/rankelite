import React from 'react';

const MagneticButton = ({ children, className = '', onClick, ...props }) => {
  return (
    <div
      onClick={onClick}
      className={`inline-block transition-transform duration-200 ease-out hover:scale-[1.02] active:scale-[0.98] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default MagneticButton;

