import React from 'react';
import { UiLabels } from '../lib/types';

interface HeadshotProps {
  src?: string;
  alt?: string;
  labels: UiLabels; // supplies the alt text used when `alt` is not set
  size?: 'small' | 'large';
}

export default function Headshot({ src, alt, labels, size = 'small' }: HeadshotProps) {
  const sizeClasses = {
    small: 'w-10 h-10',
    large: 'w-24 h-24'
  };

  if (!src) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-primary shadow-lg`}
        aria-label={alt || labels['headshot-placeholder']}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full overflow-hidden shadow-lg`}>
      <img
        src={src}
        alt={alt || labels['headshot-alt']}
        className="w-full h-full object-cover"
      />
    </div>
  );
} 