import React from 'react';
import Link from 'next/link';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Layout from '@/components/Layout';
import BlogPostCard from '@/components/BlogPostCard';
import { getListedBlogPosts, getGlobalContent, getPageContent } from '@/lib/contentParser';
import { BlogPost, GlobalContent } from '@/lib/types';

interface BlogIndexProps {
  posts: BlogPost[];
  globalContent: GlobalContent;
  labels: Record<string, string>;
}

export default function BlogIndex({ posts, globalContent, labels }: BlogIndexProps) {
  return (
    <Layout
      globalContent={globalContent}
      metaKey="blog"
    >
      <Head>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {labels.heading ?? 'Blog'}
          </h1>
          {labels.intro && (
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {labels.intro}
            </p>
          )}
        </header>

        {/* Posts grid */}
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">
              {labels.empty ?? 'No posts yet.'}
            </p>
          </div>
        )}

        {/* Note about direct access */}
        {labels['footer-link'] && (
          <footer className="mt-16 pt-8 border-t border-gray-200">
            <div className="text-center text-sm text-gray-500">
              <p>
                {labels['footer-note'] && <>{labels['footer-note']}{' '}</>}
                <Link href="/" className="text-primary-500 hover:underline">
                  {labels['footer-link']}
                </Link>
              </p>
            </div>
          </footer>
        )}
        </div>
      </div>
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const posts = await getListedBlogPosts();
    const globalContent = await getGlobalContent();
    const labels = (await getPageContent('blog'))?.labels ?? {};

    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return {
      props: {
        posts,
        globalContent,
        labels,
      },
    };
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return {
      props: {
        posts: [],
        globalContent: await getGlobalContent(),
        labels: {},
      },
    };
  }
};