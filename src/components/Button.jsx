import React from 'react';
import './Button.css';

const Button = ({ children, variant = 'primary', className = '', type = 'button', onClick, full }) => {
  return (
    <button
      type={type}
      className={`btn btn-${variant} ${full ? 'btn-full' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
