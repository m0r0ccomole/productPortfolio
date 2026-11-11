import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import { CodeBlock, CommentBlock } from './types';

export interface ProcessedMarkdown {
  content: string;
  data: any;
  htmlContent: string;
  prompts: CodeBlock[];
}

// Process markdown content with frontmatter and custom prompt blocks
export async function processMarkdown(markdownContent: string): Promise<ProcessedMarkdown> {
  const { content, data } = matter(markdownContent);
  
  // Extract prompt blocks before processing markdown
  const prompts = extractPromptBlocks(content);
  
  // Replace prompt blocks with placeholder markers for HTML processing
  let processedContent = content;
  const promptBlockRegex = /:::prompt\s*\r?\n([\s\S]*?)\r?\n\s*:::/g;
  let promptIndex = 0;
  
  processedContent = processedContent.replace(promptBlockRegex, () => {
    const placeholder = `<div class="prompt-placeholder" data-prompt-index="${promptIndex++}"></div>`;
    return placeholder;
  });
  
  // Process markdown to HTML
  const processedMarkdown = await remark()
    .use(remarkHtml, { sanitize: false }) // Allow HTML for our placeholders
    .process(processedContent);
  
  let htmlContent = processedMarkdown.toString();
  
  // Remove the first H1 heading to avoid duplication with the template title
  htmlContent = htmlContent.replace(/<h1[^>]*>.*?<\/h1>\s*/i, '');
  
  return {
    content,
    data,
    htmlContent,
    prompts
  };
}

// Extract prompt blocks and process inline comments
function extractPromptBlocks(content: string): CodeBlock[] {
  const promptBlocks: CodeBlock[] = [];
  // More flexible regex that handles different line endings and whitespace
  const promptRegex = /:::prompt\s*\r?\n([\s\S]*?)\r?\n\s*:::/g;
  
  let match;
  while ((match = promptRegex.exec(content)) !== null) {
    const promptContent = match[1];
    const { cleanContent, comments } = extractCommentsFromContent(promptContent);
    
    promptBlocks.push({
      content: promptContent,
      cleanContent: cleanContent.trim(),
      language: 'text',
      comments
    });
  }
  
  return promptBlocks;
}

// Extract comments and return clean content with comment metadata
function extractCommentsFromContent(content: string): { cleanContent: string; comments: CommentBlock[] } {
  const comments: CommentBlock[] = [];
  const lines = content.split('\n');
  let cleanLines: string[] = [];
  let commentId = 0;
  
  lines.forEach((line, index) => {
    const commentMatch = line.match(/\{\{comment:\s*([^}]*)\}\}/);
    if (commentMatch) {
      // Extract the comment
      comments.push({
        id: `comment-${commentId++}`,
        text: commentMatch[1].trim(),
        lineNumber: index
      });
      
      // Remove the comment from the line, but keep the rest of the line if it has content
      const cleanLine = line.replace(/\{\{comment:\s*[^}]*\}\}/g, '').trim();
      if (cleanLine) {
        cleanLines.push(cleanLine);
      }
    } else {
      cleanLines.push(line);
    }
  });
  
  return {
    cleanContent: cleanLines.join('\n'),
    comments
  };
}

// Remove inline comments in the format {{comment: text}}
function stripInlineComments(content: string): string {
  // Remove {{comment: ...}} blocks
  return content.replace(/\{\{comment:\s*[^}]*\}\}/g, '').trim();
}

// Get reading time estimate
export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}