import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'light';
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', variant = 'full', size = 'md' }) => {
  const sizeMap = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14'
  };

  return (
    <div className={`flex items-center gap-3 cursor-pointer select-none ${className}`}>
      {/* Logo Image */}
      <img 
        src="/assets/logo.jpeg" 
        alt="IT-LeadHER Logo" 
        className={`${sizeMap[size]}`}
      />
    </div>
  );
};
