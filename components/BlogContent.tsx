import React from 'react';
import { CodeBlock, UiLabels } from '@/lib/types';
import PromptBlock from './PromptBlock';

interface BlogContentProps {
  htmlContent: string;
  prompts: CodeBlock[];
  labels: UiLabels;
}

export default function BlogContent({ htmlContent, prompts, labels }: BlogContentProps) {
  // Split HTML content by prompt placeholders and render components
  const renderContentWithPrompts = () => {
    // Try multiple patterns in case remark modifies the HTML
    let parts = htmlContent.split(/<div class="prompt-placeholder" data-prompt-index="(\d+)"><\/div>/g);
    
    // If that didn't work, try without quotes around class
    if (parts.length === 1) {
      parts = htmlContent.split(/<div class=prompt-placeholder data-prompt-index="?(\d+)"?><\/div>/g);
    }
    
    // If still didn't work, try a more flexible approach
    if (parts.length === 1) {
      parts = htmlContent.split(/<div[^>]*data-prompt-index="?(\d+)"?[^>]*><\/div>/g);
    }
    
    const elements: React.ReactNode[] = [];
    
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 0) {
        // This is regular HTML content
        if (parts[i].trim()) {
          elements.push(
            <div
              key={`content-${i}`}
              dangerouslySetInnerHTML={{ __html: parts[i] }}
            />
          );
        }
      } else {
        // This is a prompt index
        const promptIndex = parseInt(parts[i], 10);
        const prompt = prompts[promptIndex];
        if (prompt) {
          elements.push(
            <PromptBlock
              key={`prompt-${promptIndex}`}
              prompt={prompt}
              index={promptIndex}
              labels={labels}
            />
          );
        }
      }
    }
    
    return elements;
  };

  return (
    <div className="blog-content">
      {renderContentWithPrompts()}
    </div>
  );
}