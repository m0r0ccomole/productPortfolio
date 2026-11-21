// ROLE: bespoke page
// PURPOSE: Email-signature landing page with personalized greeting (?name=).
// CONTENT: content/industry-pages.xml (page id="hello") via getPageContent('hello'); fallback greeting from <ui-labels> in content/global-elements.xml.
// SAFE TO RESTYLE: layout, motion tokens, semantic color tokens, spacing.
// DO NOT: bypass lib/motion.ts or tokens.

import React from 'react';
import { GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import { motion } from 'motion/react';
import Layout from '../components/Layout';
import FloatingButton from '../components/FloatingButton';
import { getGlobalContent, getPageContent } from '../lib/contentParser';
import { GlobalContent, PageContent } from '../lib/types';
import { fadeUp, fadeUpStagger, slideInLeft, MOTION_DURATION } from '../lib/motion';

interface HelloPageProps {
  globalContent: GlobalContent;
  pageContent: PageContent | null;
}

const HelloPage: React.FC<HelloPageProps> = ({ globalContent, pageContent }) => {
  // ?name= only exists on the client. On a statically exported page the router
  // query is empty during prerender and hydration, then fills in once
  // router.isReady flips, so the first render matches the static HTML.
  const router = useRouter();
  const nameParam = router.isReady ? router.query.name : undefined;
  const firstName = typeof nameParam === 'string' ? nameParam : '';
  const labels = globalContent.uiLabels;

  // Handle null pageContent
  if (!pageContent) {
    return (
      <Layout 
        globalContent={globalContent}
        metaKey="hello"
      >
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{labels['hello-fallback-heading']}</h1>
            <p className="text-lg text-gray-600">{labels['hello-fallback-message']}</p>
          </div>
        </div>
      </Layout>
    );
  }

  const greeting = firstName 
    ? pageContent.personalizedGreeting?.replace('{firstName}', firstName)
    : pageContent.genericGreeting || labels['hello-fallback-heading'];

  return (
    <Layout 
      globalContent={globalContent}
      metaKey="hello"
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              {...fadeUp}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-8"
            >
              {greeting}
            </motion.h1>
            
            <motion.div
              {...fadeUpStagger(1)}
              className="space-y-6 mb-12"
            >
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {typeof pageContent.intro === 'string' 
                  ? pageContent.intro 
                  : pageContent.intro?.summary || pageContent.intro?.description || ''}
              </p>
              
              {pageContent.emailContextHook && (
                <p className="text-base md:text-lg text-gray-700 max-w-3xl mx-auto font-medium">
                  {pageContent.emailContextHook}
                </p>
              )}
            </motion.div>
          </div>
        </section>

        {/* Quick Links */}
        {pageContent.quickLinks && (
          <section className="px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-4xl mx-auto">
              {pageContent.quickLinks.map((linkGroup, groupIndex) => (
                <motion.div
                  key={groupIndex}
                  {...fadeUpStagger(2 + groupIndex)}
                  className={`mb-12 ${groupIndex > 0 ? 'border-t border-gray-200 pt-12' : ''}`}
                >
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    {linkGroup.title}
                  </h2>
                  
                  <div className="grid gap-4 sm:gap-6">
                    {linkGroup.links.map((link, linkIndex) => (
                      <motion.a
                        key={linkIndex}
                        href={link.href}
                        {...slideInLeft()}
                        transition={{ duration: MOTION_DURATION.medium, delay: 0.6 + linkIndex * 0.1 }}
                        className="bg-white rounded-xl shadow-float p-6 floating-element block group hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary-500 transition-colors">
                              {link.title}
                            </h3>
                            <p className="text-sm text-gray-600 leading-relaxed">
                              {link.context}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-700 group-hover:bg-accent-200 transition-colors">
                              {pageContent.readMoreLabel}
                            </span>
                          </div>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Closing Section */}
        {pageContent.closingHook && (
          <section className="px-4 sm:px-6 lg:px-8 py-16 border-t border-gray-200 bg-gray-50">
            <div className="max-w-4xl mx-auto text-center">
              <motion.p
                {...fadeUpStagger(5)}
                className="text-lg md:text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed"
              >
                {pageContent.closingHook.text}
              </motion.p>
              
              <motion.div
                {...fadeUpStagger(6)}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <FloatingButton 
                  href={`mailto:${globalContent.contactEmail}?subject=${encodeURIComponent(pageContent.closingHook.emailSubject ?? '')}`}
                  size="lg"
                >
                  {pageContent.closingHook.ctaText}
                </FloatingButton>
                {globalContent.schedulingUrl && (
                  <FloatingButton 
                    href={globalContent.schedulingUrl}
                    variant="secondary" 
                    size="lg"
                  >
                    {pageContent.closingHook.calendarText}
                  </FloatingButton>
                )}
              </motion.div>
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const globalContent = await getGlobalContent();
  const pageContent = await getPageContent('hello');
  
  return {
    props: {
      globalContent,
      pageContent,
    },
  };
};

export default HelloPage; 