import React from 'react';
import { GetStaticProps } from 'next';
import { motion } from 'motion/react';
import Layout from '../../components/Layout';
import FloatingButton from '../../components/FloatingButton';
import ProductCard from '../../components/ProductCard';
import { getGlobalContent, getListedProductBriefs, getListedCaseStudies, getPageLabels } from '../../lib/contentParser';
import { GlobalContent, DeepDiveContent, PageLabels } from '../../lib/types';
import { fadeUp, fadeUpStagger, MOTION_DURATION } from '../../lib/motion';

interface DeepDivesPageProps {
  globalContent: GlobalContent;
  productBriefs: DeepDiveContent[];
  caseStudies: DeepDiveContent[];
  labels: PageLabels<'deep-dives'>;
}

const DeepDivesPage: React.FC<DeepDivesPageProps> = ({ globalContent, productBriefs, caseStudies, labels }) => {
  return (
    <Layout globalContent={globalContent} metaKey="deep-dives">
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Header Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              {...fadeUp}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              {labels.heading}
            </motion.h1>

            {labels.intro && (
              <motion.p
                {...fadeUpStagger(1)}
                className="text-lg md:text-xl text-gray-600 mb-12 max-w-3xl mx-auto"
              >
                {labels.intro}
              </motion.p>
            )}
          </div>
        </section>

        {/* Products Built Section */}
        {productBriefs.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                {...fadeUpStagger(2)}
                className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
              >
                {labels['products-heading']}
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {productBriefs.map((product, index) => (
                  <motion.div
                    key={product.id}
                    {...fadeUp}
                    transition={{ duration: MOTION_DURATION.slow, delay: 0.6 + index * 0.1 }}
                    className="bg-white rounded-2xl shadow-float p-6 floating-element"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {product.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {product.problem.summary}
                        </p>

                        {/* Company and timeframe */}
                        <div className="text-sm text-gray-500 mb-4">
                          <span className="font-medium">{product.context.company}</span> • {product.context.timeframe}
                        </div>

                        {/* Key metrics */}
                        {product.results && product.results.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {product.results.slice(0, 2).map((metric, idx) => (
                                <div key={idx} className="bg-gradient-to-r from-primary-50 to-accent-50 px-3 py-1 rounded-full text-sm">
                                  <span className="font-bold text-primary-700">{metric.value}</span>
                                  <span className="text-gray-600 ml-1">{metric.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        <FloatingButton href={`/deep-dives/${product.id}`} size="sm" className="w-full">
                          {labels['product-button']}
                        </FloatingButton>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Case Studies Section */}
        {caseStudies.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-6xl mx-auto">
              <motion.h2
                {...fadeUpStagger(productBriefs.length > 0 ? 4 : 2)}
                className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-12"
              >
                {labels['case-studies-heading']}
              </motion.h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStudies.map((caseStudy, index) => (
                  <motion.div
                    key={caseStudy.id}
                    {...fadeUp}
                    transition={{ duration: MOTION_DURATION.slow, delay: (productBriefs.length > 0 ? 1.0 : 0.6) + index * 0.1 }}
                    className="bg-white rounded-2xl shadow-float p-6 floating-element"
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                          {caseStudy.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {caseStudy.problem.summary}
                        </p>

                        {/* Company and timeframe */}
                        <div className="text-sm text-gray-500 mb-4">
                          <span className="font-medium">{caseStudy.context.company}</span> • {caseStudy.context.timeframe}
                        </div>

                        {/* Key metrics */}
                        {caseStudy.results && caseStudy.results.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {caseStudy.results.slice(0, 2).map((metric, idx) => (
                                <div key={idx} className="bg-gradient-to-r from-primary-50 to-accent-50 px-3 py-1 rounded-full text-sm">
                                  <span className="font-bold text-primary-700">{metric.value}</span>
                                  <span className="text-gray-600 ml-1">{metric.label}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="mt-auto">
                        <FloatingButton href={`/deep-dives/${caseStudy.id}`} size="sm" className="w-full">
                          {labels['case-study-button']}
                        </FloatingButton>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Back to Home Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              {...fadeUpStagger(3)}
            >
              <FloatingButton href="/" variant="secondary" size="lg">
                {labels['back-button']}
              </FloatingButton>
            </motion.div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const globalContent = await getGlobalContent();
  const productBriefs = await getListedProductBriefs();
  const caseStudies = await getListedCaseStudies();
  const labels = await getPageLabels('deep-dives');

  return {
    props: {
      globalContent,
      productBriefs,
      caseStudies,
      labels,
    },
  };
};

export default DeepDivesPage; 