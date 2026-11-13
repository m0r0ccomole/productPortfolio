import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/types';

interface BlogPostCardProps {
  post: BlogPost;
  readMoreLabel: string; // ui-labels "read-more" from global-elements.xml
}

export default function BlogPostCard({ post, readMoreLabel }: BlogPostCardProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Link href={`/blog/${post.slug}`}>
      <article className="group bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-200 hover:border-primary-300">
        {/* Category badge */}
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-accent-100 text-accent-700 rounded-full">
            {post.category}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-500 transition-colors">
          {post.title}
        </h2>

        {/* Excerpt */}
        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Date and read more */}
        <div className="flex justify-between items-center text-sm">
          <time className="text-gray-500">
            {formatDate(post.date)}
          </time>
          <span className="text-primary-500 font-medium group-hover:text-primary-600 transition-colors">
            {readMoreLabel}
          </span>
        </div>
      </article>
    </Link>
  );
}