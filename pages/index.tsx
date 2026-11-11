// ROLE: bespoke page
// PURPOSE: Homepage — hero, metrics, featured case studies, industry tiles. Canonical bespoke example.
// CONTENT: content/pages.xml (page id="home"), content/global-elements.xml, parsed IndustryPageContent[].
// SAFE TO RESTYLE: layout, motion tokens, semantic color tokens, spacing.
// DO NOT: add string literals to JSX, hardcode industry display names, bypass lib/motion.ts.

import React from 'react';
import { GetStaticProps } from 'next';
import { motion } from 'motion/react';
import Layout from '../components/Layout';
import FloatingButton from '../components/FloatingButton';
import MetricCard from '../components/MetricCard';
import { getGlobalContent, getPageContent, getIndustryPageContent } from '../lib/contentParser';
import { GlobalContent, PageContent } from '../lib/types';
import { fadeUp, fadeUpStagger } from '../lib/motion';

interface FeaturedIndustry {
  id: string;
  displayName: string;
}

interface HomePageProps {
  globalContent: GlobalContent;
  pageContent: PageContent;
  industries: FeaturedIndustry[];
}

const HomePage: React.FC<HomePageProps> = ({ globalContent, pageContent, industries }) => {
  return (
    <Layout globalContent={globalContent}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              {...fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              {pageContent.hero?.headline}
            </motion.h1>

            <motion.p
              {...fadeUpStagger(1)}
              className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
            >
              {pageContent.hero?.subheading}
            </motion.p>

            <motion.div
              {...fadeUpStagger(2)}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <FloatingButton href="#case-studies" size="lg" trackingLabel="Home Hero - Primary CTA">
                {globalContent.buttons.ctaPrimary}
              </FloatingButton>
              <FloatingButton href="/about" variant="secondary" size="lg" trackingLabel="Home Hero - Secondary CTA">
                {globalContent.buttons.ctaSecondary}
              </FloatingButton>
            </motion.div>
          </div>
        </section>

        {/* Metrics Summary */}
        {pageContent.metricsSummary && (
          <section className="px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                {...fadeUpStagger(3)}
                className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
              >
                {pageContent.metricsHeading}
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pageContent.metricsSummary.map((metric, index) => (
                  <MetricCard
                    key={index}
                    value={metric.value}
                    label={metric.label}
                    delay={0.8 + index * 0.2}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Case Studies Section */}
        {pageContent.featuredCaseStudies && (
          <section id="case-studies" className="px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                {...fadeUpStagger(7)}
                className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
              >
                {pageContent.featuredStudiesHeading}
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {pageContent.featuredCaseStudies.map((study, index) => (
                  <motion.div
                    key={study.href}
                    {...fadeUpStagger(8 + index)}
                    className="bg-white rounded-2xl shadow-float p-6 floating-element"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {study.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {study.description}
                    </p>
                    <FloatingButton href={study.href} size="sm">
                      {study.buttonLabel}
                    </FloatingButton>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Industry Expertise */}
        {industries.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                {...fadeUpStagger(10)}
                className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
              >
                {pageContent.industriesHeading}
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {industries.map((industry, index) => (
                  <motion.div
                    key={industry.id}
                    {...fadeUpStagger(11 + index)}
                  >
                    <FloatingButton
                      href={`/resume/${industry.id}`}
                      variant="secondary"
                      className="w-full h-20 text-lg"
                    >
                      {industry.displayName}
                    </FloatingButton>
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
  const pageContent = await getPageContent('home');

  if (!pageContent) {
    throw new Error('Missing home page content in content/pages.xml');
  }

  const featuredIds = pageContent.featuredIndustries ?? [];
  const resolved = await Promise.all(
    featuredIds.map(async (id) => {
      const ipc = await getIndustryPageContent(id);
      return ipc ? { id, displayName: ipc.displayName } : null;
    })
  );
  const industries = resolved.filter((x): x is FeaturedIndustry => x !== null);

  return {
    props: {
      globalContent,
      pageContent,
      industries,
    },
  };
};

export default HomePage;
