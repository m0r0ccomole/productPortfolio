export interface MetricData {
  value: string;
  label: string;
}

export interface NavigationItem {
  href: string;
  text: string;
}

export interface GlobalImages {
  headshot?: string;
  headshotAlt?: string;
  favicon?: string; // Path under /public, e.g. /images/favicon.ico. Omitted → no icon link.
  ogImage?: string; // Social share image path under /public. Omitted → no og:image / twitter:image.
}

// Per-page <title> and meta description, keyed by page (home, about, hello, ...)
export interface PageMeta {
  title?: string;
  description?: string;
}

export interface SeoContent {
  defaultDescription: string;
  defaultKeywords: string;
  pages: Record<string, PageMeta>;
}

// Every site-wide UI label the code reads from <ui-labels> in global-elements.xml.
// Adding a key here requires a default in sample/content/global-elements.xml;
// the parser fails the build if the sample lacks one. Text in {braces} is a
// placeholder filled at render time (see lib/labels.ts).
export const UI_LABEL_KEYS = [
  // Layout, navigation, shared image components
  'skip-link',
  'footer-privacy',
  'footer-contact',
  'footer-rights',
  'last-updated',
  'nav-toggle-menu',
  'headshot-alt',
  'headshot-placeholder',
  'hero-image-alt',
  'image-close',
  // Blog
  'read-more',
  'min-read',
  'blog-back',
  'prompt-copy',
  'prompt-show-comment',
  'prompt-hide-comment',
  // Testimonials
  'testimonials-heading',
  'testimonials-previous',
  'testimonials-next',
  'testimonials-page',
  'testimonial-image-alt',
  'testimonial-placeholder',
  // Deep dive template
  'deep-dive-brief-badge',
  'deep-dive-role',
  'deep-dive-company',
  'deep-dive-timeframe',
  'deep-dive-stakes',
  'deep-dive-challenge',
  'deep-dive-problem',
  'deep-dive-opportunity',
  'deep-dive-approach',
  'deep-dive-build',
  'deep-dive-results',
  'deep-dive-achieved',
  'deep-dive-evidence',
  'deep-dive-email-subject',
  'deep-dive-meta-description',
  'deep-dive-meta-keywords',
  // Industry landing template
  'industry-relevance',
  'industry-achievements',
  'industry-more-work',
  'industry-skills',
  'industry-meta-title',
  'industry-meta-description',
  'industry-meta-keywords',
  // Hello page fallbacks
  'hello-fallback-heading',
  'hello-fallback-message'
] as const;

export type UiLabelKey = (typeof UI_LABEL_KEYS)[number];
export type UiLabels = Record<UiLabelKey, string>;

// Per-page <labels> keys in pages.xml. `required` keys always resolve (owner's
// text, else the sample's). `optional` keys never fall back to the sample,
// because the sample's text there is persona copy; the page hides them when absent.
export const PAGE_LABEL_KEYS = {
  about: { required: ['heading'], optional: [] },
  projects: { required: ['heading'], optional: [] },
  blog: { required: ['heading', 'empty'], optional: ['intro', 'footer-note', 'footer-link'] },
  'deep-dives': {
    required: ['heading', 'products-heading', 'product-button', 'case-studies-heading', 'case-study-button', 'back-button'],
    optional: ['intro']
  }
} as const;

export type LabelledPageId = keyof typeof PAGE_LABEL_KEYS;
export type PageLabels<P extends LabelledPageId> =
  Record<(typeof PAGE_LABEL_KEYS)[P]['required'][number], string> &
  Partial<Record<(typeof PAGE_LABEL_KEYS)[P]['optional'][number], string>>;

export interface GlobalContent {
  siteTitle: string;
  tagline: string;
  ownerName: string; // Used in titles, author meta, footer copyright
  siteUrl: string; // Canonical base URL; SITE_URL env var overrides at build time
  contactEmail: string;
  schedulingUrl?: string; // Calendar booking link. Omitted → calendar buttons are hidden.
  credit?: { text: string; href: string }; // Optional footer link to the template project
  navigation: NavigationItem[];
  // Site-wide UI labels: <ui-labels><label key="...">text</label></ui-labels>.
  // Always complete: keys missing from the owner's file are filled from sample/content.
  uiLabels: UiLabels;
  buttons: {
    ctaPrimary: string;
    ctaSecondary: string;
    ctaEmail: string;
  };
  globalImages?: GlobalImages;
  ctaContent?: CTAContent;
  seo: SeoContent;
}

export interface Achievement {
  metric: string;
  context: string;
}

export interface ProductCard {
  id: string; // References deep-dive id
  name: string;
  year: string;
  metric: string;
  metricLabel: string;
  image: string;
  imageAlt: string;
}

export interface ProductsBuilt {
  title: string;
  products: ProductCard[];
}

export interface IndustryPageContent {
  id: string;
  displayName: string;
  hero: {
    headline: string;
    hook: string;
  };
  relevance: {
    statement: string;
  };
  featuredAchievements: Achievement[];
  productsBuilt?: ProductsBuilt;
  testimonials?: TestimonialsSection;
  relevantSkills: string[];
}

export interface DeepDiveContent {
  id: string;
  title: string;
  type?: 'case-study' | 'product-brief';
  listed?: boolean;
  context: {
    company: string;
    timeframe: string;
    role: string;
    stakes: string;
  };
  problem: {
    summary: string;
    details: string[];
  };
  process: {
    name: string;
    steps: string[];
  }[];
  results: MetricData[];
  relatedWork?: {
    label: string;
    href: string;
  };
  artifacts?: {
    type: string;
    description: string;
  }[];
  images?: {
    src: string;
    alt: string;
    caption?: string;
  }[];
}

export interface TimelineEvent {
  year: string;
  company: string;
  companyUrl?: string;
  role: string;
  highlight: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  highlights: string[];
}

export interface RetiredProject extends Project {
  retired?: string; // When it was retired, e.g. "2025"
  postMortem: string[]; // Paragraphs explaining why it was retired
}

export interface RetiredProjectsSection {
  heading: string;
  description?: string;
  projects: RetiredProject[];
}

export interface PageContent {
  id: string;
  hero?: {
    headline: string;
    subheading?: string;
  };
  metricsSummary?: MetricData[];
  metricsHeading?: string;
  featuredStudiesHeading?: string;
  featuredCaseStudies?: { title: string; description: string; href: string; buttonLabel: string }[];
  industriesHeading?: string;
  featuredIndustries?: string[];
  intro?: string | {
    greeting?: string;
    summary?: string;
    title?: string;
    description?: string;
  };
  timelineData?: TimelineEvent[];
  personalizedGreeting?: string;
  genericGreeting?: string;
  emailContextHook?: string;
  quickLinks?: {
    title: string;
    links: {
      href: string;
      title: string;
      context: string;
    }[];
  }[];
  closingHook?: {
    text: string;
    ctaText: string;
    calendarText: string;
    emailSubject?: string;
  };
  readMoreLabel?: string; // hello page quick-link badge
  timelineHeading?: string; // about page
  projectLabels?: {
    techStack: string;
    keyFeatures: string;
    retired: string;
    postMortem: string;
  };
  closingCta?: {
    heading: string;
    primaryButton: string;
    primaryHref: string;
  };
  labels?: Record<string, string>; // <labels><label key="...">text</label></labels>; pages read it through getPageLabels()
  notFound?: {
    heading: string;
    message: string;
    primaryButton: string;
    secondaryButton: string;
  };
  personal?: {
    title: string;
    paragraphs: string[];
  }[];
  projects?: Project[];
  retiredProjects?: RetiredProjectsSection;
  privacyContent?: {
    title: string;
    sections: {
      title: string;
      content: string;
    }[];
  };
  heroImage?: string;
  heroImageAlt?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  title: string;
  company: string;
  image?: string;
  imageAlt?: string;
}

export interface TestimonialsSection {
  testimonials: Testimonial[];
  selectedIds?: string[];
} 

export interface CTAConfig {
  primaryText: string;
  primaryHref: string;
  secondaryText?: string;
  secondaryHref?: string;
  heading?: string;
  subheading?: string;
}

export interface CTAContent {
  heading: string;
  subheading: string;
  emailSubjects: {
    deepDive: string;
    industry: string;
    general: string;
  };
  primaryButtons: {
    general: string;
    deepDive: string;
    industry: string;
    productBrief: string;
  };
  secondaryButtons: {
    viewWork: string;
    viewCaseStudies: string;
    viewProjects: string;
  };
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  listed: boolean;
  content?: string;
  htmlContent?: string;
}

export interface CodeBlock {
  content: string;
  cleanContent: string; // Content with comments stripped for copying
  language?: string;
  comments: CommentBlock[];
}

export interface CommentBlock {
  id: string;
  text: string;
  lineNumber?: number;
} 