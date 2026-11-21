// ROLE: bespoke page
// PURPOSE: 404 error page.
// CONTENT: content/pages.xml (page id="not-found") via getPageContent('not-found'). Next.js allows getStaticProps on 404.
// SAFE TO RESTYLE: layout, motion tokens, semantic color tokens, spacing.
// DO NOT: bypass lib/motion.ts or tokens.

import React from 'react';
import { GetStaticProps } from 'next';
import { motion } from 'motion/react';
import Layout from '../components/Layout';
import FloatingButton from '../components/FloatingButton';
import { getGlobalContent, getPageContent } from '../lib/contentParser';
import { GlobalContent, PageContent } from '../lib/types';
import { fadeUp } from '../lib/motion';

interface NotFoundPageProps {
  globalContent: GlobalContent;
  pageContent: PageContent | null;
}

const Custom404: React.FC<NotFoundPageProps> = ({ globalContent, pageContent }) => {
  // The parser fills <not-found> from sample/content when the owner's page lacks it
  const copy = pageContent?.notFound;

  return (
    <Layout globalContent={globalContent} metaKey="not-found">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center px-4">
          <motion.div {...fadeUp}>
            <h1 className="text-9xl font-bold text-primary-600 mb-4">404</h1>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              {copy?.heading}
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              {copy?.message}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <FloatingButton href="/" size="lg">
                {copy?.primaryButton}
              </FloatingButton>
              <FloatingButton href="/about" variant="secondary" size="lg">
                {copy?.secondaryButton}
              </FloatingButton>
            </div>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const globalContent = await getGlobalContent();
  const pageContent = await getPageContent('not-found');

  return {
    props: {
      globalContent,
      pageContent,
    },
  };
};

export default Custom404;
