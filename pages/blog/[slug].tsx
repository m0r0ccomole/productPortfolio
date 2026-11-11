import React from 'react';
import { GetStaticProps, GetStaticPaths } from 'next';
import Head from 'next/head';
import Layout from '@/components/Layout';
import BlogPostTemplate from '@/components/templates/BlogPost';
import { getBlogPostBySlug, getAllBlogSlugs, getGlobalContent } from '@/lib/contentParser';
import { processMarkdown } from '@/lib/markdownProcessor';
import { BlogPost, GlobalContent, CodeBlock } from '@/lib/types';

interface BlogPostPageProps {
  post: BlogPost;
  prompts: CodeBlock[];
  globalContent: GlobalContent;
}

export default function BlogPostPage({ post, prompts, globalContent }: BlogPostPageProps) {
  return (
    <Layout 
      globalContent={globalContent}
      title={`${post.title} - ${globalContent.ownerName}`}
      description={post.excerpt}
    >
      <Head>
        <meta name="robots" content="noindex" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:author" content={globalContent.ownerName} />
        <meta property="article:section" content={post.category} />
      </Head>
      
      <BlogPostTemplate post={post} prompts={prompts} />
    </Layout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  try {
    const slugs = await getAllBlogSlugs();
    const paths = slugs.map((slug) => ({
      params: { slug },
    }));

    return {
      paths,
      fallback: false,
    };
  } catch (error) {
    console.error('Error generating blog post paths:', error);
    return {
      paths: [],
      fallback: false,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    
    if (!slug) {
      return {
        notFound: true,
      };
    }

    const post = await getBlogPostBySlug(slug);
    
    if (!post) {
      return {
        notFound: true,
      };
    }

    // Process markdown to extract prompts
    let prompts: CodeBlock[] = [];
    if (post.content) {
      const processed = await processMarkdown(post.content);
      prompts = processed.prompts;
    }

    const globalContent = await getGlobalContent();

    return {
      props: {
        post,
        prompts,
        globalContent,
      },
    };
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return {
      notFound: true,
    };
  }
};