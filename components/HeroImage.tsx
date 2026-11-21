import React from 'react';

interface HeroImageProps {
  src?: string;
  alt?: string;
  fallbackAlt: string; // ui-labels "hero-image-alt", used when `alt` is not set
}

export default function HeroImage({ src, alt, fallbackAlt }: HeroImageProps) {
  if (!src) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
        <img
          src={src}
          alt={alt || fallbackAlt}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
} 