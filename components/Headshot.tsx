import React from 'react';

interface HeadshotProps {
  src?: string;
  alt?: string;
  size?: 'small' | 'large';
}

export default function Headshot({ src, alt, size = 'small' }: HeadshotProps) {
  const sizeClasses = {
    small: 'w-10 h-10',
    large: 'w-24 h-24'
  };

  if (!src) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-primary shadow-lg`}
        aria-label={alt || 'Profile photo placeholder'}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden shadow-lg`}>
      <img
        src={src}
        alt={alt || 'Profile photo'}
        className="w-full h-full object-cover"
      />
    </div>
  );
} 