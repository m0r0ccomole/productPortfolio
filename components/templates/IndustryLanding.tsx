// ROLE: template
// PURPOSE: Renders an industry landing page from an IndustryPageContent object.
// CONTENT: content/industry-pages.xml via getIndustryPageContent(id); CTA heading and section headings (<ui-labels>) from content/global-elements.xml.
// SAFE TO RESTYLE: layout, motion tokens, semantic color tokens, spacing.
// NOTE: the per-industry CTA button text and email subjects in generateIndustryCTA are still inline. See docs/todo.md.
// DO NOT: put per-page copy here (it belongs in industry-pages.xml), bypass tokens or lib/motion.ts.

import React from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import FloatingButton from '../FloatingButton';
import MetricCard from '../MetricCard';
import Testimonials from '../Testimonials';
import CTASection from '../CTASection';
import ProductCard from '../ProductCard';
import { IndustryPageContent, GlobalContent, CTAConfig } from '../../lib/types';
import { fadeUp, fadeUpStagger, MOTION_DURATION } from '../../lib/motion';

interface IndustryLandingProps {
  content: IndustryPageContent;
  globalContent: GlobalContent;
}

const IndustryLanding: React.FC<IndustryLandingProps> = ({ content, globalContent }) => {
  const labels = globalContent.uiLabels;

  // Helper function to find matching key using contains logic
  const findMatchingKey = (industryId: string, availableKeys: string[]): string | null => {
    // First try exact match
    if (availableKeys.includes(industryId)) {
      return industryId;
    }
    
    // Then try contains logic - check if industry ID contains any of the keys
    for (const key of availableKeys) {
      if (industryId.includes(key)) {
        return key;
      }
    }
    
    return null;
  };

  // Generate industry-specific CTA
  const generateIndustryCTA = (industryContent: IndustryPageContent): CTAConfig => {
    const industryKeys = ['fintech', 'consumer', 'iot', 'platform'];
    const matchingKey = findMatchingKey(industryContent.id.toLowerCase(), industryKeys);
    
    const industryEmailSubjects: { [key: string]: string } = {
      'fintech': 'Fintech Product Leadership Discussion',
      'consumer': 'Consumer Product Leadership Discussion',
      'iot': 'IoT Product Leadership Discussion',
      'platform': 'Platform Product Leadership Discussion'
    };
    
    const industryPrimaryText: { [key: string]: string } = {
      'fintech': 'Discuss Fintech Opportunities',
      'consumer': 'Discuss Consumer Product Needs',
      'iot': 'Discuss IoT Product Strategy',
      'platform': 'Discuss Platform Product Goals'
    };
    
    const industrySecondaryLinks: { [key: string]: { text: string; href: string } } = {
      'fintech': { text: 'View More of My Work', href: '/deep-dives' },
      'consumer': { text: 'View More of My Work', href: '/deep-dives' },
      'iot': { text: 'View More of My Work', href: '/deep-dives' },
      'platform': { text: 'View More of My Work', href: '/deep-dives' }
    };
    
    const subject = (matchingKey && industryEmailSubjects[matchingKey]) || 'Product Leadership Discussion';
    const primaryText = (matchingKey && industryPrimaryText[matchingKey]) || 'Let\'s Discuss Your Needs';
    const secondaryLink = (matchingKey && industrySecondaryLinks[matchingKey]) || { text: 'View More of My Work', href: '/deep-dives' };
    
    return {
      primaryText,
      primaryHref: `mailto:${globalContent.contactEmail}?subject=${encodeURIComponent(subject)}`,
      secondaryText: secondaryLink.text,
      secondaryHref: secondaryLink.href,
      heading: globalContent.ctaContent?.heading,
      subheading: globalContent.ctaContent?.subheading
    };
  };
  
  const ctaConfig = generateIndustryCTA(content);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            {...fadeUp}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
          >
            {content.hero.headline}
          </motion.h1>
          
          <motion.p
            {...fadeUpStagger(1)}
            className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            {content.hero.hook}
          </motion.p>
        </div>
      </section>

      {/* Relevance Statement */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            {...fadeUpStagger(2)}
            className="bg-white rounded-2xl shadow-float p-8 md:p-12"
          >
            {labels['industry-relevance'] && (
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                {labels['industry-relevance']}
              </h2>
            )}
            <p className="text-lg text-gray-700 leading-relaxed">
              {content.relevance.statement}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured Achievements */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          {labels['industry-achievements'] && (
            <motion.h2
              {...fadeUpStagger(3)}
              className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
            >
              {labels['industry-achievements']}
            </motion.h2>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {content.featuredAchievements.map((achievement, index) => (
              <motion.div
                key={index}
                {...fadeUpStagger(4 + index)}
                className="bg-white rounded-2xl shadow-float p-6 floating-element"
              >
                <div className="text-2xl md:text-3xl font-bold text-primary-600 mb-3">
                  {achievement.metric}
                </div>
                <p className="text-gray-600 text-sm md:text-base">
                  {achievement.context}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Built Section */}
      {content.productsBuilt && (
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              {...fadeUpStagger(7)}
              className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
            >
              {content.productsBuilt.title}
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {content.productsBuilt.products.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
            
            <motion.div
              {...fadeUpStagger(8 + content.productsBuilt.products.length)}
              className="text-center"
            >
              <Link
                href="/deep-dives"
                className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium text-xl transition-colors duration-200"
              >
                {labels['industry-more-work']}
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {content.testimonials && (
        <Testimonials testimonialsSection={content.testimonials} labels={labels} />
      )}

      {/* Skills Grid */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {labels['industry-skills'] && (
            <motion.h2
              {...fadeUpStagger(content.testimonials ? 9 : 7)}
              className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
            >
              {labels['industry-skills']}
            </motion.h2>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {content.relevantSkills.map((skill, index) => (
              /* MOTION: scale-grow skills grid — no token applies. */
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: MOTION_DURATION.base, delay: (content.testimonials ? 2.0 : 1.6) + index * 0.1 }}
                className="bg-gradient-primary text-white px-4 py-3 rounded-lg text-center font-medium text-sm md:text-base floating-element"
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            {...fadeUpStagger(content.testimonials ? 11 : 9)}
          >
            <CTASection config={ctaConfig} />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default IndustryLanding; 