// ROLE: template
// PURPOSE: Renders a case study or product brief from a DeepDiveContent object.
// CONTENT: content/deep-dives.xml via getDeepDiveContent(id); CTA copy from content/global-elements.xml.
// SAFE TO RESTYLE: layout, motion tokens, semantic color tokens, spacing. Section headings are template defaults.
// DO NOT: put per-page copy here (it belongs in deep-dives.xml), bypass tokens or lib/motion.ts.

import React from 'react';
import { motion } from 'motion/react';
import FloatingButton from '../FloatingButton';
import MetricCard from '../MetricCard';
import CaseStudyImage from '../CaseStudyImage';
import CTASection from '../CTASection';
import { DeepDiveContent, GlobalContent, CTAConfig } from '../../lib/types';
import { fadeUp, fadeUpStagger, slideInLeft, MOTION_DURATION } from '../../lib/motion';

interface DeepDiveProps {
  content: DeepDiveContent;
  globalContent: GlobalContent;
}

const DeepDive: React.FC<DeepDiveProps> = ({ content, globalContent }) => {
  const estimatedReadTime = Math.ceil(content.title.length / 200) + 3; // Rough estimate
  const isProductBrief = content.type === 'product-brief';
  const cta = globalContent.ctaContent;

  // Generate contextual CTA. Copy comes from global-elements.xml; the per-page
  // related-work link comes from the deep-dive's own <related-work> in deep-dives.xml.
  const generateCTA = (deepDiveContent: DeepDiveContent): CTAConfig => {
    const baseEmailSubject = `Discussion: ${deepDiveContent.title}`;
    const emailHref = `mailto:${globalContent.contactEmail}?subject=${encodeURIComponent(baseEmailSubject)}`;

    const relatedWork = deepDiveContent.relatedWork ?? {
      label: cta?.secondaryButtons.viewCaseStudies ?? '',
      href: '/deep-dives'
    };

    return {
      primaryText: isProductBrief ? (cta?.primaryButtons.productBrief ?? '') : (cta?.primaryButtons.deepDive ?? ''),
      primaryHref: emailHref,
      secondaryText: relatedWork.label,
      secondaryHref: relatedWork.href,
      heading: cta?.heading,
      subheading: cta?.subheading
    };
  };

  const ctaConfig = generateCTA(content);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Title and Context */}
      <section className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            {...fadeUp}
            className="text-center mb-12"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              {content.title}
            </h1>
            <p className="text-lg text-gray-600">
              {isProductBrief ? 'Product Brief' : `${estimatedReadTime} min read`} • {content.context.company} • {content.context.timeframe}
            </p>
          </motion.div>
          
          {/* Hero Image for Product Briefs */}
          {isProductBrief && content.images && content.images.length > 0 && (
            <motion.div
              {...fadeUpStagger(1)}
              className="mb-12"
            >
              <CaseStudyImage
                src={content.images[0].src}
                alt={content.images[0].alt}
                caption={content.images[0].caption}
              />
            </motion.div>
          )}
          
          <motion.div
            {...fadeUpStagger(isProductBrief ? 2 : 1)}
            className="bg-white rounded-2xl shadow-float p-8 md:p-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Role</h3>
                <p className="text-gray-600 mb-4">{content.context.role}</p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Company</h3>
                <p className="text-gray-600">{content.context.company}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Timeframe</h3>
                <p className="text-gray-600 mb-4">{content.context.timeframe}</p>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{isProductBrief ? 'Challenge' : 'Stakes'}</h3>
                <p className="text-gray-600">{content.context.stakes}</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      {!isProductBrief && (
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              {...fadeUpStagger(2)}
              className="bg-white rounded-2xl shadow-float p-8 md:p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Problem
              </h2>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                {content.problem.summary}
              </p>
              
              <div className="space-y-3">
                {content.problem.details.map((detail, index) => (
                  <motion.div
                    key={index}
                    {...slideInLeft()}
                    transition={{ duration: MOTION_DURATION.medium, delay: 0.6 + index * 0.1 }}
                    className="flex items-start space-x-3"
                  >
                    <div className="w-2 h-2 bg-accent-500 rounded-full mt-3 flex-shrink-0"></div>
                    <p className="text-gray-600">{detail}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Simplified Problem for Product Briefs */}
      {isProductBrief && (
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <motion.div
              {...fadeUpStagger(3)}
              className="bg-white rounded-2xl shadow-float p-8 md:p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Opportunity
              </h2>
              <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                {content.problem.summary}
              </p>
            </motion.div>
          </div>
        </section>
      )}

      {/* Process */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            {...fadeUpStagger(4)}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
          >
            {isProductBrief ? 'How We Built It' : 'My Approach'}
          </motion.h2>
          
          <div className={isProductBrief ? 'grid grid-cols-1 md:grid-cols-2 gap-8' : 'space-y-8'}>
            {content.process.map((phase, phaseIndex) => (
              <motion.div
                key={phaseIndex}
                {...fadeUpStagger(5 + phaseIndex)}
                className="bg-white rounded-2xl shadow-float p-8 floating-element"
              >
                <h3 className={`font-bold text-primary-600 mb-6 ${isProductBrief ? 'text-xl' : 'text-2xl'}`}>
                  {isProductBrief ? phase.name : `${phaseIndex + 1}. ${phase.name}`}
                </h3>
                
                <div className="space-y-4">
                  {phase.steps.map((step, stepIndex) => (
                    <motion.div
                      key={stepIndex}
                      {...slideInLeft()}
                      transition={{ duration: MOTION_DURATION.medium, delay: 1.2 + phaseIndex * 0.2 + stepIndex * 0.1 }}
                      className={`flex items-start space-x-4 ${isProductBrief ? 'space-x-3' : 'space-x-4'}`}
                    >
                      {!isProductBrief && (
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm flex-shrink-0">
                          {stepIndex + 1}
                        </div>
                      )}
                      {isProductBrief && (
                        <div className="w-2 h-2 bg-primary-500 rounded-full mt-3 flex-shrink-0"></div>
                      )}
                      <p className={`text-gray-700 ${isProductBrief ? 'text-sm' : 'pt-1'}`}>{step}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            {...fadeUpStagger(8)}
            className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
          >
            {isProductBrief ? 'What We Achieved' : 'Results'}
          </motion.h2>
          
          <div className={`grid gap-6 ${
            content.results.length <= 2 
              ? 'grid-cols-1 md:grid-cols-2 justify-items-center' 
              : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
          }`}>
            {content.results.map((result, index) => (
              <MetricCard
                key={index}
                value={result.value}
                label={result.label}
                delay={1.8 + index * 0.2}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Images - Only for Case Studies (Product Briefs show image at top) */}
      {!isProductBrief && content.images && content.images.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              {...fadeUpStagger(7)}
              className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
            >
             Evidence you can see in action
            </motion.h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {content.images.map((image, index) => (
                <motion.div
                  key={index}
                  {...fadeUp}
                  transition={{ duration: MOTION_DURATION.slow, delay: 1.6 + index * 0.1 }}
                >
                  <CaseStudyImage
                    src={image.src}
                    alt={image.alt}
                    caption={image.caption}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            {...fadeUpStagger(10)}
          >
            <CTASection config={ctaConfig} />
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DeepDive; 