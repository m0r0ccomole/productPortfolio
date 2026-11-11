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

export interface GlobalContent {
  siteTitle: string;
  tagline: string;
  ownerName: string; // Used in titles, author meta, footer copyright
  siteUrl: string; // Canonical base URL; SITE_URL env var overrides at build time
  contactEmail: string;
  schedulingUrl?: string; // Calendar booking link. Omitted → calendar buttons are hidden.
  credit?: { text: string; href: string }; // Optional footer link to the template project
  navigation: NavigationItem[];
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
  labels?: Record<string, string>; // <labels><label key="...">text</label></labels>; used by the blog and deep-dives index pages
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