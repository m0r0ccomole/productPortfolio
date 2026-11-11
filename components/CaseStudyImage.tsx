import React, { useState } from 'react';

interface CaseStudyImageProps {
  src: string;
  alt: string;
  caption?: string;
}

export default function CaseStudyImage({ src, alt, caption }: CaseStudyImageProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Grid Item */}
      <div 
        className="group cursor-pointer relative"
        onClick={openModal}
      >
        {/* Image Container with 1:1 Aspect Ratio */}
        <div className="aspect-square bg-gradient-to-br from-primary-50 to-primary-100 rounded-xl p-3 hover:shadow-lg transition-all duration-300">
          <div className="relative w-full h-full rounded-lg overflow-hidden bg-white shadow-sm">
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Expand Icon */}
            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg 
                className="w-4 h-4 text-primary-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" 
                />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Caption */}
        {caption && (
          <p className="mt-3 text-sm text-gray-600 text-center leading-relaxed">
            {caption}
          </p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
        >
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/20 transition-colors duration-200"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Full Size Image */}
          <div className="max-w-full max-h-full">
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            />
            
            {/* Modal Caption */}
            {caption && (
              <p className="mt-4 text-white text-center text-sm opacity-90 max-w-2xl mx-auto">
                {caption}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
} 