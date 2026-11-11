import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Layout from '../../components/Layout';
import IndustryLanding from '../../components/templates/IndustryLanding';
import { getGlobalContent, getIndustryPageContent, getAllIndustries } from '../../lib/contentParser';
import { GlobalContent, IndustryPageContent } from '../../lib/types';

interface IndustryPageProps {
  globalContent: GlobalContent;
  industryContent: IndustryPageContent;
}

const IndustryPage: React.FC<IndustryPageProps> = ({ globalContent, industryContent }) => {
  const industryName = industryContent.displayName;

  return (
    <Layout 
      globalContent={globalContent}
      title={`${industryName} Experience | ${globalContent.ownerName}`}
      description={`${industryName} product leadership experience and achievements by ${globalContent.ownerName}`}
      keywords={`${industryName}, product management, ${industryContent.id}, experience`}
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