// ROLE: template
// PURPOSE: Renders a single blog post (markdown body + inline prompt blocks).
// CONTENT: content/blog-markdown/*.md via getBlogPostBySlug(slug); fixed labels from <ui-labels> in content/global-elements.xml.
// SAFE TO RESTYLE: layout, semantic color tokens, spacing, prose styles.
// DO NOT: put post copy here (it lives in markdown), bypass semantic color tokens.

import React from 'react';
import Link from 'next/link';
import { BlogPost, CodeBlock, UiLabels } from '@/lib/types';
import BlogContent from '@/components/BlogContent';
import { getReadingTime } from '@/lib/markdownProcessor';
import { fillLabel } from '@/lib/labels';

interface BlogPostProps {
  post: BlogPost;
  prompts: CodeBlock[];
  labels: UiLabels;
}

export default function BlogPostTemplate({ post, prompts, labels }: BlogPostProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate reading time
  const readingTime = post.content ? getReadingTime(post.content) : 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-8">
        {/* Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {post.title}
        </h1>

        {/* Meta information */}
        <div className="flex items-center gap-4 text-sm">
          <span className="inline-block px-3 py-1 font-medium bg-accent-100 text-accent-700 rounded-full">
            {post.category}
          </span>
          <time className="text-gray-600">{formatDate(post.date)}</time>
          <span className="text-gray-600">•</span>
          <span className="text-gray-600">{fillLabel(labels['min-read'], { minutes: readingTime })}</span>
        </div>
      </header>

      {/* Content */}
      <div className="prose prose-lg prose-gray max-w-none">
        {post.htmlContent && (
          <BlogContent 
            htmlContent={post.htmlContent}
            prompts={prompts}
            labels={labels}
          />
        )}
      </div>

      {/* Footer navigation */}
      <footer className="mt-12 pt-8 border-t border-gray-200">
        <Link 
          href="/blog" 
          className="inline-flex items-center text-primary-500 hover:text-primary-600 transition-colors"
        >
          {labels['blog-back']}
        </Link>
      </footer>
      </article>
    </div>
  );
}