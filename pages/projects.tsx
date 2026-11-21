// ROLE: bespoke page
// PURPOSE: Projects page — side-project grid, retired projects with post-mortems, closing CTA.
// CONTENT: content/pages.xml (page id="projects") via getPageContent('projects').
// SAFE TO RESTYLE: layout, motion tokens, semantic color tokens, spacing.
// DO NOT: bypass lib/motion.ts or tokens.

import React from 'react';
import { GetStaticProps } from 'next';
import { motion } from 'motion/react';
import Layout from '../components/Layout';
import FloatingButton from '../components/FloatingButton';
import { getGlobalContent, getPageContent, getPageLabels } from '../lib/contentParser';
import { GlobalContent, PageContent, PageLabels } from '../lib/types';
import { fadeUp, fadeUpStagger } from '../lib/motion';

interface ProjectsPageProps {
  globalContent: GlobalContent;
  pageContent: PageContent;
  pageLabels: PageLabels<'projects'>;
}

const ProjectsPage: React.FC<ProjectsPageProps> = ({ globalContent, pageContent, pageLabels }) => {
  // The parser fills both from sample/content when the owner's page lacks them
  const labels = pageContent.projectLabels;
  const closingCta = pageContent.closingCta;
  const intro = typeof pageContent.intro === 'object' ? pageContent.intro : undefined;

  return (
    <Layout 
      globalContent={globalContent}
      metaKey="projects"
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        {/* Hero Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1
              {...fadeUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6"
            >
              {intro?.title || pageLabels.heading}
            </motion.h1>

            {intro?.description && (
              <motion.p
                {...fadeUpStagger(1)}
                className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
              >
                {intro.description}
              </motion.p>
            )}
          </div>
        </section>

        {/* Projects Grid */}
        {pageContent.projects && (
          <section className="px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {pageContent.projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  {...fadeUpStagger(2 + index)}
                  className="bg-white rounded-2xl shadow-float p-8 floating-element"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {project.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      {labels?.techStack}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {project.techStack.map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      {labels?.keyFeatures}
                    </h4>
                    <ul className="space-y-2">
                      {project.highlights.map((highlight, highlightIndex) => (
                        <li
                          key={highlightIndex}
                          className="flex items-start space-x-3"
                        >
                          <div className="w-2 h-2 bg-primary-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-600">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Retired Projects */}
        {pageContent.retiredProjects && pageContent.retiredProjects.projects.length > 0 && (
          <section className="px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-6xl mx-auto">
              <motion.div {...fadeUpStagger(2)} className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {pageContent.retiredProjects.heading}
                </h2>
                {pageContent.retiredProjects.description && (
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    {pageContent.retiredProjects.description}
                  </p>
                )}
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {pageContent.retiredProjects.projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    {...fadeUpStagger(3 + index)}
                    className="bg-accent-50 border border-accent-200 rounded-2xl p-8"
                  >
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <h3 className="text-2xl font-bold text-gray-700">
                        {project.title}
                      </h3>
                      <span className="px-3 py-1 bg-accent-100 text-accent-600 rounded-full text-sm font-medium whitespace-nowrap">
                        {labels?.retired}{project.retired ? ` ${project.retired}` : ''}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {project.description}
                    </p>

                    {project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.techStack.map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="px-3 py-1 bg-accent-100 text-accent-600 rounded-full text-sm font-medium"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}

                    {project.postMortem.length > 0 && (
                      <div className="border-l-4 border-accent-300 pl-4">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                          {labels?.postMortem}
                        </h4>
                        {project.postMortem.map((paragraph, pIndex) => (
                          <p key={pIndex} className="text-gray-600 leading-relaxed mt-3 first:mt-0">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              {...fadeUpStagger(4)}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
            >
              {closingCta?.heading}
            </motion.h2>

            <motion.div
              {...fadeUpStagger(5)}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              {closingCta && (
                <FloatingButton href={closingCta.primaryHref} size="lg">
                  {closingCta.primaryButton}
                </FloatingButton>
              )}
              <FloatingButton href={`mailto:${globalContent.contactEmail}`} variant="secondary" size="lg">
                {globalContent.buttons.ctaEmail}
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
  const pageContent = await getPageContent('projects');
  const pageLabels = await getPageLabels('projects');

  return {
    props: {
      globalContent,
      pageContent,
      pageLabels,
    },
  };
};

export default ProjectsPage; 