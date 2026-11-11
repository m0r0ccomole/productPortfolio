import React, { useState } from 'react';
import { CodeBlock, CommentBlock } from '@/lib/types';
import { copyToClipboard } from '@/lib/copyToClipboard';

interface PromptBlockProps {
  prompt: CodeBlock;
  index: number;
}

export default function PromptBlock({ prompt, index }: PromptBlockProps) {
  const [copied, setCopied] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Set<string>>(
    new Set(prompt.comments.map(c => c.id))
  );

  const handleCopy = async () => {
    const success = await copyToClipboard(prompt.cleanContent);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleComment = (commentId: string) => {
    const newExpanded = new Set(expandedComments);
    if (newExpanded.has(commentId)) {
      newExpanded.delete(commentId);
    } else {
      newExpanded.add(commentId);
    }
    setExpandedComments(newExpanded);
  };

  // Render the prompt content with inline comment toggles
  const renderContentWithComments = () => {
    const lines = prompt.content.split('\n');
    const elements: React.ReactNode[] = [];
    
    lines.forEach((line, lineIndex) => {
      // Check if this line has a comment
      const comment = prompt.comments.find(c => c.lineNumber === lineIndex);
      
      if (comment) {
        // Line with comment - show toggle and expandable comment
        const cleanLine = line.replace(/\{\{comment:\s*[^}]*\}\}/g, '').trim();
        const isExpanded = expandedComments.has(comment.id);
        
        elements.push(
          <div key={lineIndex} className="text-gray-300">
            {cleanLine}{' '}
            <button
              onClick={() => toggleComment(comment.id)}
              className="text-primary-300 hover:text-primary-200 text-sm font-mono"
              title={isExpanded ? "Hide comment" : "Show comment"}
            >
              {isExpanded ? '−' : '+'}
            </button>
            {isExpanded && (
              <span className="text-gray-400 italic ml-1">
                {comment.text}
              </span>
            )}
          </div>
        );
      } else {
        // Regular line without comment
        elements.push(
          <div key={lineIndex} className="text-gray-300">
            {line}
          </div>
        );
      }
    });
    
    return elements;
  };

  return (
    <div className="my-6 relative">
      <div className="bg-gray-900 rounded-md border border-gray-700 relative">
        {/* Copy button */}
        <button
          onClick={handleCopy}
          className={`absolute top-3 right-3 p-2 rounded-md transition-all duration-200 z-10 ${
            copied
              ? 'bg-green-600 text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          title="Copy to clipboard"
        >
          {copied ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          )}
        </button>

        {/* Code content */}
        <pre className="p-6 pr-16 font-mono text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto">
          {renderContentWithComments()}
        </pre>
      </div>
    </div>
  );
}