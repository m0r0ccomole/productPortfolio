// ROLE: building block
// PURPOSE: Reusable testimonials section with optional carousel.
// CONTENT: none of its own. Receives a TestimonialsSection prop, and its heading and aria labels from <ui-labels> in content/global-elements.xml.
// SAFE TO RESTYLE: layout, spacing, semantic color tokens, motion tokens.
// DO NOT: hardcode content copy here, fetch content here.

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TestimonialsSection, UiLabels } from '../lib/types';
import { fillLabel } from '../lib/labels';
import { fadeUp, fadeUpStagger, carouselSlide, MOTION_DURATION } from '../lib/motion';

interface TestimonialsProps {
  testimonialsSection: TestimonialsSection;
  labels: UiLabels;
  className?: string;
}

const Testimonials: React.FC<TestimonialsProps> = ({ testimonialsSection, labels, className = '' }) => {
  const { testimonials, selectedIds } = testimonialsSection;
  
  // Filter testimonials if selectedIds are provided
  const displayTestimonials = selectedIds 
    ? testimonials.filter(t => selectedIds.includes(t.id))
    : testimonials;

  const [currentIndex, setCurrentIndex] = useState(0);
  const showCarousel = displayTestimonials.length > 2;
  const itemsPerPage = 2;
  const totalPages = Math.ceil(displayTestimonials.length / itemsPerPage);

  const getCurrentTestimonials = () => {
    const start = currentIndex * itemsPerPage;
    return displayTestimonials.slice(start, start + itemsPerPage);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const TestimonialCard = ({ testimonial, index }: { testimonial: any; index: number }) => (
    <motion.div
      key={testimonial.id}
      {...fadeUpStagger(index)}
      transition={{ duration: MOTION_DURATION.medium, delay: index * 0.2 }}
      className="bg-white rounded-2xl shadow-float p-8 floating-element h-full flex flex-col"
    >
      {/* Quote */}
      <div className="flex-1 mb-6">
        <blockquote className="text-lg md:text-xl text-gray-700 leading-relaxed italic">
          &quot;{testimonial.quote}&quot;
        </blockquote>
      </div>

      {/* Author Info */}
      <div className="flex items-center gap-4">
        {/* Circular Headshot */}
        <div className="flex-shrink-0">
          {testimonial.image ? (
            <div className="w-16 h-16 rounded-full overflow-hidden shadow-lg">
              <img
                src={testimonial.image}
                alt={testimonial.imageAlt || fillLabel(labels['testimonial-image-alt'], { name: testimonial.name })}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div
              className="w-16 h-16 rounded-full bg-gradient-primary shadow-lg flex items-center justify-center"
              aria-label={testimonial.imageAlt || fillLabel(labels['testimonial-placeholder'], { name: testimonial.name })}
            >
              <span className="text-white font-bold text-lg">
                {testimonial.name.split(' ').map((n: string) => n[0]).join('')}
              </span>
            </div>
          )}
        </div>

        {/* Name and Title */}
        <div className="flex-1">
          <div className="font-bold text-gray-900 text-lg">
            {testimonial.name}
          </div>
          <div className="text-gray-600 text-sm">
            {testimonial.title}
          </div>
          <div className="text-gray-500 text-sm">
            {testimonial.company}
          </div>
        </div>
      </div>
    </motion.div>
  );

  if (displayTestimonials.length === 0) {
    return null;
  }

  return (
    <section className={`px-4 sm:px-6 lg:px-8 py-16 ${className}`}>
      <div className="max-w-6xl mx-auto">
        {labels['testimonials-heading'] && (
          <motion.h2
            {...fadeUp}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
          >
            {labels['testimonials-heading']}
          </motion.h2>
        )}

        <div className="relative">
          <AnimatePresence mode="wait">
            {/* MOTION: conditional carousel slide — falls back to fade-only when only one page exists. */}
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: showCarousel ? 50 : 0 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: showCarousel ? -50 : 0 }}
              transition={carouselSlide.transition}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8"
            >
              {getCurrentTestimonials().map((testimonial, index) => (
                <TestimonialCard 
                  key={testimonial.id} 
                  testimonial={testimonial} 
                  index={index} 
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Carousel Controls - Only show if more than 2 testimonials */}
          {showCarousel && (
            <div className="flex justify-center items-center mt-8 gap-4">
              <button
                onClick={prevSlide}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 floating-element"
                aria-label={labels['testimonials-previous']}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="flex gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentIndex 
                        ? 'bg-gradient-primary scale-110' 
                        : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                    aria-label={fillLabel(labels['testimonials-page'], { page: index + 1 })}
                  />
                ))}
              </div>

              <button
                onClick={nextSlide}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 floating-element"
                aria-label={labels['testimonials-next']}
              >
                <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 