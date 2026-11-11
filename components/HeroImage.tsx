import React from 'react';

interface HeroImageProps {
  src?: string;
  alt?: string;
}

export default function HeroImage({ src, alt }: HeroImageProps) {
  if (!src) {
    return null;
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
        <img
          src={src}
          alt={alt || 'Hero image'}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
} 