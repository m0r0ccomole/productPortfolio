// ROLE: bespoke page
// PURPOSE: About page — hero, journey timeline, personal sections.
// CONTENT: content/pages.xml (page id="about") via getPageContent('about').
// SAFE TO RESTYLE: layout, motion tokens, semantic color tokens, spacing.
// DO NOT: bypass lib/motion.ts or tokens.

import React from 'react';
import { GetStaticProps } from 'next';
import { motion } from 'motion/react';
import Layout from '../components/Layout';
import HeroImage from '../components/HeroImage';
import { getGlobalContent, getPageContent, getPageLabels } from '../lib/contentParser';
import { GlobalContent, PageContent, PageLabels, TimelineEvent } from '../lib/types';
import { fadeUp, fadeUpStagger } from '../lib/motion';

interface AboutPageProps {
  globalContent: GlobalContent;
  pageContent: PageContent;
  pageLabels: PageLabels<'about'>;
}

const TimelineWidget: React.FC<{ data: TimelineEvent[] }> = ({ data }) => {
  return (
    <div className="relative">
      {data.map((event, index) => (
        <motion.div
          key={index}
          {...fadeUpStagger(index)}
          className={`flex items-center mb-8 relative ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
        >
          <div className={`w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
            <div className="bg-white rounded-xl shadow-float p-6 floating-element">
              <div className="text-2xl font-bold text-primary-600 mb-2">
                {event.year} {/* EDIT: Change year here */}
              </div>
              <div className="text-xl font-semibold text-gray-900 mb-1">
                {event.companyUrl ? (
                  <a
                    href={event.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary-600 hover:underline underline-offset-4 transition-colors"
                  >
                    {event.company}
                  </a>
                ) : (
                  event.company
                )}
              </div>
              <div className="text-gray-600 mb-2">
                {event.role} {/* EDIT: Job title */}
              </div>
              <div className="text-sm text-primary-600 font-medium">
                {event.highlight} {/* EDIT: Main achievement */}
              </div>
            </div>
          </div>
          
          <div className="w-2/12 flex justify-center relative">
            <div className="w-4 h-4 bg-primary-500 rounded-full border-4 border-white shadow-lg z-10 relative"></div>
            {/* Connecting line segment */}
            {index < data.length - 1 && (
              <div className="absolute left-1/2 top-1/2 w-0.5 h-48 bg-primary-300 transform -translate-x-1/2 translate-y-2 z-0"></div>
            )}
          </div>
          
          <div className="w-5/12"></div>
        </motion.div>
      ))}
    </div>
  );
};

const AboutPage: React.FC<AboutPageProps> = ({ globalContent, pageContent, pageLabels }) => {
  return (
    <Layout 
      globalContent={globalContent}
      metaKey="about"
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              {...fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              {typeof pageContent.intro === 'object' && pageContent.intro?.greeting
                ? pageContent.intro.greeting
                : pageLabels.heading}
            </motion.h1>
            
            <motion.p
              {...fadeUpStagger(1)}
              className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
            >
              {typeof pageContent.intro === 'object' && pageContent.intro?.summary 
                ? pageContent.intro.summary 
                : typeof pageContent.intro === 'string' 
                  ? pageContent.intro 
                  : ''}
            </motion.p>
          </div>
        </section>

        {/* Hero Image */}
        {pageContent.heroImage && (
          <section className="px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
              <motion.div
                {...fadeUpStagger(2)}
                className="text-center"
              >
                <HeroImage
                  src={pageContent.heroImage}
                  alt={pageContent.heroImageAlt}
                  fallbackAlt={globalContent.uiLabels['hero-image-alt']}
                />
              </motion.div>
            </div>
          </section>
        )}

        {/* Timeline */}
        {pageContent.timelineData && (
          <section className="px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                {...fadeUpStagger(2)}
                className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16"
              >
                {pageContent.timelineHeading}
              </motion.h2>
              
              <TimelineWidget data={pageContent.timelineData} />
            </div>
          </section>
        )}

        {/* Personal Sections */}
        {pageContent.personal && (
          <section className="px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pageContent.personal.map((section, index) => (
                  <motion.div
                    key={section.title}
                    {...fadeUpStagger(4 + index)}
                    className="bg-white rounded-2xl shadow-float p-8 floating-element"
                  >
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      {section.title}
                    </h3>
                    {section.paragraphs.map((paragraph, pIndex) => (
                      <p key={pIndex} className="text-gray-600 leading-relaxed mt-4 first:mt-0">
                        {paragraph}
                      </p>
                    ))}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const globalContent = await getGlobalContent();
  const pageContent = await getPageContent('about');
  const pageLabels = await getPageLabels('about');

  return {
    props: {
      globalContent,
      pageContent,
      pageLabels,
    },
  };
};

export default AboutPage; 