import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '../../components/Layout';
import DeepDive from '../../components/templates/DeepDive';
import { getGlobalContent, getDeepDiveContent, getAllDeepDives } from '../../lib/contentParser';
import { GlobalContent, DeepDiveContent } from '../../lib/types';
import { fillLabel } from '../../lib/labels';

interface DeepDivePageProps {
  globalContent: GlobalContent;
  deepDiveContent: DeepDiveContent;
}

const DeepDivePage: React.FC<DeepDivePageProps> = ({ globalContent, deepDiveContent }) => {
  return (
    <Layout 
      globalContent={globalContent}
      title={`${deepDiveContent.title} | ${globalContent.ownerName}`}
      description={fillLabel(globalContent.uiLabels['deep-dive-meta-description'], {
        summary: deepDiveContent.problem.summary
      })}
      keywords={fillLabel(globalContent.uiLabels['deep-dive-meta-keywords'], {
        company: deepDiveContent.context.company,
        id: deepDiveContent.id
      })}
    >
      <DeepDive content={deepDiveContent} globalContent={globalContent} />
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const deepDives = await getAllDeepDives();
  
  const paths = deepDives.map((id) => ({
    params: { id }
  }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const id = params?.id as string;
  
  if (!id) {
    return {
      notFound: true
    };
  }

  const globalContent = await getGlobalContent();
  const deepDiveContent = await getDeepDiveContent(id);
  
  if (!deepDiveContent) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      globalContent,
      deepDiveContent,
    },
  };
};

export default DeepDivePage; 