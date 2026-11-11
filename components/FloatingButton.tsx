import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { hoverScale } from '../lib/motion';

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
  // UTM tracking function
  const trackUTMClick = (actionType: string, destination: string) => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const utm_source = urlParams.get('utm_source');
      const utm_medium = urlParams.get('utm_medium');
      const utm_campaign = urlParams.get('utm_campaign');
      const utm_content = urlParams.get('utm_content');
      const utm_term = urlParams.get('utm_term');
      
      // Track the click with UTM parameters
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'cta_click', {
          event_category: 'CTA',
          event_label: trackingLabel || destination,
          action_type: actionType,
          destination: destination,
          utm_source: utm_source,
          utm_medium: utm_medium,
          utm_campaign: utm_campaign,
          utm_content: utm_content,
          utm_term: utm_term,
          page_path: window.location.pathname
        });
      }
    }
  };

  const handleClick = () => {
    if (href) {
      trackUTMClick('navigation', href);
    } else if (trackingLabel) {
      trackUTMClick('action', trackingLabel);
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