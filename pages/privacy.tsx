// ROLE: bespoke page
// PURPOSE: Privacy policy — static prose sections.
// CONTENT: content/pages.xml (page id="privacy") via getPageContent('privacy'); "Last updated:" from <ui-labels> in content/global-elements.xml.
// SAFE TO RESTYLE: layout, motion tokens, semantic color tokens, spacing.
// DO NOT: bypass lib/motion.ts or tokens.

import React from 'react';
import { GetStaticProps } from 'next';
import { motion } from 'motion/react';
import Layout from '../components/Layout';
import { getGlobalContent, getPageContent } from '../lib/contentParser';
import { GlobalContent, PageContent } from '../lib/types';
import { fadeUp, fadeUpStagger } from '../lib/motion';

interface PrivacyPageProps {
  globalContent: GlobalContent;
  pageContent: PageContent | null;
}

const PrivacyPage: React.FC<PrivacyPageProps> = ({ globalContent, pageContent }) => {
  const title = pageContent?.privacyContent?.title;
  const sections = pageContent?.privacyContent?.sections ?? [];

  return (
    <Layout 
      globalContent={globalContent}
      metaKey="privacy"
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto">
            <motion.h1
              {...fadeUp}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-8"
            >
              {title}
            </motion.h1>
            
            <motion.p
              {...fadeUpStagger(1)}
              className="text-lg text-gray-600"
            >
              {globalContent.uiLabels['last-updated']} {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </motion.p>
          </div>
        </section>

        {/* Content Sections */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {sections.map((section, index) => (
                <motion.div
                  key={index}
                  {...fadeUpStagger(2 + index)}
                  className="bg-white rounded-2xl shadow-float p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {section.title}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const globalContent = await getGlobalContent();
  const pageContent = await getPageContent('privacy');
  
  return {
    props: {
      globalContent,
      pageContent,
    },
  };
};

export default PrivacyPage; 