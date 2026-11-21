import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '../../components/Layout';
import IndustryLanding from '../../components/templates/IndustryLanding';
import { getGlobalContent, getIndustryPageContent, getAllIndustries } from '../../lib/contentParser';
import { GlobalContent, IndustryPageContent } from '../../lib/types';
import { fillLabel } from '../../lib/labels';

interface IndustryPageProps {
  globalContent: GlobalContent;
  industryContent: IndustryPageContent;
}

const IndustryPage: React.FC<IndustryPageProps> = ({ globalContent, industryContent }) => {
  const labels = globalContent.uiLabels;
  const values = {
    industry: industryContent.displayName,
    owner: globalContent.ownerName,
    id: industryContent.id
  };

  return (
    <Layout 
      globalContent={globalContent}
      title={fillLabel(labels['industry-meta-title'], values)}
      description={fillLabel(labels['industry-meta-description'], values)}
      keywords={fillLabel(labels['industry-meta-keywords'], values)}
    >
      <IndustryLanding content={industryContent} globalContent={globalContent} />
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const industries = await getAllIndustries();
  
  const paths = industries.map((industry) => ({
    params: { industry }
  }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const industry = params?.industry as string;
  
  if (!industry) {
    return {
      notFound: true
    };
  }

  const globalContent = await getGlobalContent();
  const industryContent = await getIndustryPageContent(industry);
  
  if (!industryContent) {
    return {
      notFound: true
    };
  }

  return {
    props: {
      globalContent,
      industryContent,
    },
  };
};

export default IndustryPage; 