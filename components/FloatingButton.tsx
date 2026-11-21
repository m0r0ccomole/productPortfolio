import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { hoverScale } from '../lib/motion';
import { trackCtaClick } from '../lib/analytics';

interface FloatingButtonProps {
  variant?: 'primary' | 'secondary' | 'accent';
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  trackingLabel?: string;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({
  variant = 'primary',
  href,
  onClick,
  children,
  className = '',
  size = 'md',
  trackingLabel
}) => {
  const handleClick = () => {
    if (href) {
      trackCtaClick({ actionType: 'navigation', destination: href, label: trackingLabel });
    } else if (trackingLabel) {
      trackCtaClick({ actionType: 'action', destination: trackingLabel, label: trackingLabel });
    }
    
    if (onClick) {
      onClick();
    }
  };
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "bg-gradient-primary text-white hover:shadow-float-hover focus:ring-primary-500",
    secondary: "bg-white text-gray-900 border-2 border-gray-200 hover:border-primary-300 hover:shadow-float-hover focus:ring-primary-500",
    accent: "bg-gradient-accent text-white hover:shadow-float-hover focus:ring-accent-500"
  };

  const sizeClasses = {
    sm: "px-4 py-2 text-sm min-h-[36px]",
    md: "px-6 py-3 text-base min-h-[44px]",
    lg: "px-8 py-4 text-lg min-h-[52px]"
  };

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const buttonContent = (
    <motion.span
      className="flex items-center space-x-2"
      {...hoverScale}
    >
      {children}
    </motion.span>
  );

  if (href) {
    return (
      <Link href={href} className={buttonClasses} onClick={handleClick}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button className={buttonClasses} onClick={handleClick}>
      {buttonContent}
    </button>
  );
};

export default FloatingButton; 