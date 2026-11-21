import { promises as fs, existsSync } from 'fs';
import { join } from 'path';
import { parseString } from 'xml2js';
import matter from 'gray-matter';
import {
  GlobalContent,
  IndustryPageContent,
  DeepDiveContent,
  PageContent,
  MetricData,
  NavigationItem,
  Achievement,
  TimelineEvent,
  Testimonial,
  TestimonialsSection,
  CTAContent,
  ProductsBuilt,
  ProductCard,
  BlogPost,
  CommentBlock,
  Project,
  RetiredProject,
  UiLabels,
  UI_LABEL_KEYS,
  PAGE_LABEL_KEYS,
  LabelledPageId,
  PageLabels
} from './types';
import { processMarkdown, getReadingTime } from './markdownProcessor';

let cachedGlobalElements: any = null;
let cachedTestimonials: any = null;
let cachedPages: any = null;
let cachedIndustryPages: any = null;
let cachedDeepDives: any = null;
let cachedBlogPosts: BlogPost[] | null = null;

// The site owner's content lives in /content. The upstream project never ships
// that folder, so a fresh copy falls back to the sample persona in /sample/content.
const usingSampleContent = !existsSync(join(process.cwd(), 'content'));
const contentRoot = usingSampleContent ? join('sample', 'content') : 'content';
let warnedSampleContent = false;

function contentPath(...parts: string[]): string {
  if (usingSampleContent && !warnedSampleContent) {
    warnedSampleContent = true;
    console.warn('[content] No content/ folder found, building from sample/content. Copy sample/content to content/ to make the site yours.');
  }
  return join(process.cwd(), contentRoot, ...parts);
}

// Upstream adds new optional fields to sample/content first. A site owner's
// content/ predates them, so the parser reads the sample copy of the same file
// to fill whatever the owner's file lacks. This keeps default copy in XML, not in code.
// Only generic UI text falls back this way; persona copy in the sample never does.
const cachedSampleXml: Record<string, Promise<any>> = {};

function parseSampleXml(file: string): Promise<any> {
  // Clear cache in development/build to always read fresh XML
  if (process.env.NODE_ENV !== 'production') {
    delete cachedSampleXml[file];
  }

  if (!cachedSampleXml[file]) {
    cachedSampleXml[file] = fs
      .readFile(join(process.cwd(), 'sample', 'content', file), 'utf8')
      .then(
        (xml) =>
          new Promise<any>((resolve, reject) => {
            parseString(xml, (err: any, result: any) => (err ? reject(err) : resolve(result)));
          })
      );
  }
  return cachedSampleXml[file];
}

// The sample is the source of defaults, so a default missing from it is an
// upstream bug. Fail the build instead of rendering a blank.
function missingSampleDefault(file: string, what: string): Error {
  return new Error(
    `[content] sample/content/${file} is missing ${what}. ` +
    'Every label the code declares needs a default in sample/content.'
  );
}

// Reads a keyed label list: <label key="...">text</label> children of the given node.
function readLabels(node: any): Record<string, string> {
  return Object.fromEntries(
    (node?.label ?? []).map((l: any) => [l.$.key, l._ ?? ''])
  );
}

// Returns the owner's labels, with each key in `keys` that the owner's file
// lacks filled from the sample. `pick` selects the same label container node
// from either parsed file. A key the owner defines always wins, even when
// empty. Keys outside `keys` are passed through but never filled.
async function labelsWithSampleFallback<K extends string>(
  file: string,
  ownerRoot: any,
  pick: (root: any) => any,
  keys: readonly K[],
  where: string
): Promise<Record<K, string> & Record<string, string>> {
  const labels = readLabels(pick(ownerRoot));
  const missing = keys.filter((key) => !(key in labels));
  if (missing.length > 0) {
    const sample = usingSampleContent ? {} : readLabels(pick(await parseSampleXml(file)));
    for (const key of missing) {
      if (!(key in sample)) {
        throw missingSampleDefault(file, `<label key="${key}"> in ${where}`);
      }
      labels[key] = sample[key];
    }
  }
  return labels as Record<K, string> & Record<string, string>;
}

// Finds <page id="..."> in a parsed pages.xml or industry-pages.xml.
function findPage(root: any, rootKey: string, pageId: string): any {
  return (root?.[rootKey]?.page ?? []).find((p: any) => p.$?.id === pageId);
}

// The sample's copy of a page, for filling generic elements the owner's page
// lacks. Undefined when the build is already reading the sample.
async function findSamplePage(file: string, rootKey: string, pageId: string): Promise<any> {
  return usingSampleContent ? undefined : findPage(await parseSampleXml(file), rootKey, pageId);
}

// Returns the page with each element in `elements` that the owner's page lacks
// copied from the sample's page of the same id. List only elements whose
// sample text is generic UI copy.
async function pageWithSampleElements(
  file: string,
  rootKey: string,
  pageId: string,
  page: any,
  elements: readonly string[]
): Promise<any> {
  const missing = elements.filter((el) => !page[el]);
  if (missing.length === 0) {
    return page;
  }
  const samplePage = await findSamplePage(file, rootKey, pageId);
  const filled = { ...page };
  for (const el of missing) {
    if (!samplePage?.[el]) {
      throw missingSampleDefault(file, `<${el}> in <page id="${pageId}">`);
    }
    filled[el] = samplePage[el];
  }
  return filled;
}

// Generic elements of each static page that fall back to the sample.
const SAMPLE_FALLBACK_ELEMENTS: Record<string, readonly string[]> = {
  about: ['timeline-heading'],
  projects: ['project-labels', 'closing-cta'],
  privacy: ['title'],
  'not-found': ['not-found']
};

// NEW: Parse global elements from separate file
async function parseGlobalElementsContent(): Promise<any> {
  // Clear cache in development/build to always read fresh XML
  if (process.env.NODE_ENV !== 'production') {
    cachedGlobalElements = null;
  }
  
  if (cachedGlobalElements) {
    return cachedGlobalElements;
  }

  try {
    const xmlPath = contentPath('global-elements.xml');
    const xmlContent = await fs.readFile(xmlPath, 'utf8');
    
    return new Promise((resolve, reject) => {
      parseString(xmlContent, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          cachedGlobalElements = result;
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error('Error parsing global elements XML content:', error);
    throw error;
  }
}

// NEW: Parse global elements from new structure  
async function parseUiLabels(content: any): Promise<UiLabels> {
  const pick = (root: any) => root?.['global-elements']?.global?.[0]?.['ui-labels']?.[0];
  const known: readonly string[] = UI_LABEL_KEYS;
  for (const key of Object.keys(readLabels(pick(content)))) {
    if (!known.includes(key)) {
      console.warn(`[content] global-elements.xml: <ui-labels> key "${key}" is not used by the site. Check the spelling.`);
    }
  }
  return labelsWithSampleFallback('global-elements.xml', content, pick, UI_LABEL_KEYS, '<ui-labels>');
}

async function parseGlobalElements(): Promise<GlobalContent> {
  const content = await parseGlobalElementsContent();
  const global = content['global-elements'].global[0];
  
  const seo = global.seo?.[0];
  const result: GlobalContent = {
    siteTitle: global['site-title'][0],
    tagline: global.tagline[0],
    ownerName: global['owner-name']?.[0] ?? global['site-title'][0],
    siteUrl: (global['site-url']?.[0] ?? '').replace(/\/$/, ''),
    contactEmail: global['contact-email'][0],
    navigation: global.navigation[0].item.map((item: any) => ({
      href: item.$.href,
      text: item._
    })),
    uiLabels: await parseUiLabels(content),
    buttons: {
      ctaPrimary: global.buttons[0]['cta-primary'][0],
      ctaSecondary: global.buttons[0]['cta-secondary'][0],
      ctaEmail: global.buttons[0]['cta-email'][0]
    },
    seo: {
      defaultDescription: seo?.['default-description']?.[0] ?? '',
      defaultKeywords: seo?.['default-keywords']?.[0] ?? '',
      pages: Object.fromEntries(
        (seo?.page ?? []).map((p: any) => [
          p.$.id,
          {
            ...(p.title ? { title: p.title[0] } : {}),
            ...(p.description ? { description: p.description[0] } : {})
          }
        ])
      )
    }
  };

  if (global['scheduling-url']?.[0]) {
    result.schedulingUrl = global['scheduling-url'][0];
  }

  const credit = global.credit?.[0];
  if (credit?._ && credit.$?.href) {
    result.credit = { text: credit._, href: credit.$.href };
  }

  // Parse global images if they exist
  if (global['global-images']) {
    const images = global['global-images'][0];
    result.globalImages = {};
    if (images.headshot) {
      result.globalImages.headshot = images.headshot[0];
    }
    if (images['headshot-alt']) {
      result.globalImages.headshotAlt = images['headshot-alt'][0];
    }
    if (images.favicon) {
      result.globalImages.favicon = images.favicon[0];
    }
    if (images['og-image']) {
      result.globalImages.ogImage = images['og-image'][0];
    }
  }

  // Parse CTA content if it exists
  if (global['cta-content']) {
    const ctaContent = global['cta-content'][0];
    result.ctaContent = {
      heading: ctaContent.heading[0],
      subheading: ctaContent.subheading[0],
      emailSubjects: {
        deepDive: ctaContent['email-subjects'][0]['deep-dive'][0],
        industry: ctaContent['email-subjects'][0]['industry'][0],
        general: ctaContent['email-subjects'][0]['general'][0]
      },
      primaryButtons: {
        general: ctaContent['primary-buttons'][0]['general'][0],
        deepDive: ctaContent['primary-buttons'][0]['deep-dive'][0],
        industry: ctaContent['primary-buttons'][0]['industry'][0],
        productBrief: ctaContent['primary-buttons'][0]['product-brief'][0]
      },
      secondaryButtons: {
        viewWork: ctaContent['secondary-buttons'][0]['view-work'][0],
        viewCaseStudies: ctaContent['secondary-buttons'][0]['view-case-studies'][0],
        viewProjects: ctaContent['secondary-buttons'][0]['view-projects'][0]
      }
    };
  }

  return result;
}

// NEW: Parse testimonials from separate file
async function parseTestimonialsContent(): Promise<any> {
  // Clear cache in development/build to always read fresh XML
  if (process.env.NODE_ENV !== 'production') {
    cachedTestimonials = null;
  }
  
  if (cachedTestimonials) {
    return cachedTestimonials;
  }

  try {
    const xmlPath = contentPath('testimonials.xml');
    const xmlContent = await fs.readFile(xmlPath, 'utf8');
    
    return new Promise((resolve, reject) => {
      parseString(xmlContent, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          cachedTestimonials = result;
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error('Error parsing testimonials XML content:', error);
    throw error;
  }
}

// NEW: Parse testimonials from new structure
async function parseTestimonialsFromNewStructure(): Promise<Testimonial[]> {
  try {
    const content = await parseTestimonialsContent();
    const testimonials = content['testimonials-content'].testimonials;
    
    if (!testimonials || !testimonials[0] || !testimonials[0].testimonial) {
      return [];
    }
    
    return testimonials[0].testimonial.map((t: any) => ({
      id: t.$.id,
      quote: t.quote[0],
      name: t.name ? t.name[0] : (t.n ? t.n[0] : ''),
      title: t.title[0],
      company: t.company[0],
      // Omit missing keys: getStaticProps can't serialize undefined
      ...(t.image ? { image: t.image[0] } : {}),
      ...(t['image-alt'] ? { imageAlt: t['image-alt'][0] } : {})
    }));
  } catch (error) {
    console.error('Error getting testimonials from new structure:', error);
    return [];
  }
}

// NEW: Parse static pages from separate file
async function parsePagesContent(): Promise<any> {
  // Clear cache in development/build to always read fresh XML
  if (process.env.NODE_ENV !== 'production') {
    cachedPages = null;
  }
  
  if (cachedPages) {
    return cachedPages;
  }

  try {
    const xmlPath = contentPath('pages.xml');
    const xmlContent = await fs.readFile(xmlPath, 'utf8');
    
    return new Promise((resolve, reject) => {
      parseString(xmlContent, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          cachedPages = result;
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error('Error parsing pages XML content:', error);
    throw error;
  }
}

// Shared by <project> entries on the projects page, active and retired
function parseProject(project: any): Project {
  return {
    id: project.$.id,
    title: project.title[0],
    description: project.description[0],
    techStack: project['tech-stack']?.[0]?.tech ?? [],
    highlights: project.highlights?.[0]?.highlight ?? []
  };
}

// NEW: Parse static pages from new structure
async function parseStaticPagesFromNewStructure(pageId: string): Promise<PageContent | null> {
  const content = await parsePagesContent();
  const pages = content['pages-content'].page;
  
  // 404 and privacy are made of generic copy only, so they resolve from the
  // sample even when the owner's pages.xml has no such page
  const ownerPage = pages.find((p: any) => p.$.id === pageId)
    ?? (pageId === 'not-found' || pageId === 'privacy' ? { $: { id: pageId } } : undefined);
  if (!ownerPage) return null;

  const page = await pageWithSampleElements(
    'pages.xml',
    'pages-content',
    pageId,
    ownerPage,
    SAMPLE_FALLBACK_ELEMENTS[pageId] ?? []
  );

  const result: PageContent = { id: pageId };

  // Parse different page types
  if (page.hero) {
    result.hero = {
      headline: page.hero[0].headline[0]
    };
    if (page.hero[0].subheading) {
      result.hero.subheading = page.hero[0].subheading[0];
    }
  }

  if (page['metrics-summary']) {
    result.metricsSummary = page['metrics-summary'][0].metric.map((m: any) => ({
      value: m.value[0],
      label: m.label[0]
    }));
  }

  if (page['metrics-heading']) {
    result.metricsHeading = page['metrics-heading'][0];
  }

  if (page['featured-studies-heading']) {
    result.featuredStudiesHeading = page['featured-studies-heading'][0];
  }

  if (page['featured-case-studies']) {
    result.featuredCaseStudies = page['featured-case-studies'][0]['case-study'].map((cs: any) => ({
      title: cs.title[0],
      description: cs.description[0],
      href: cs.href[0],
      buttonLabel: cs['button-label'][0]
    }));
  }

  if (page['industries-heading']) {
    result.industriesHeading = page['industries-heading'][0];
  }

  if (page['featured-industries']) {
    result.featuredIndustries = page['featured-industries'][0].id.map((id: any) => id);
  }

  if (page.intro) {
    // Handle both structured intro object and plain text intro
    if (typeof page.intro[0] === 'string') {
      // Plain text intro (like hello page)
      result.intro = page.intro[0];
    } else {
      // Structured intro object
      result.intro = {};
      if (page.intro[0].greeting) {
        result.intro.greeting = page.intro[0].greeting[0];
      }
      if (page.intro[0].summary) {
        result.intro.summary = page.intro[0].summary[0];
      }
      if (page.intro[0].title) {
        result.intro.title = page.intro[0].title[0];
      }
      if (page.intro[0].description) {
        result.intro.description = page.intro[0].description[0];
      }
    }
  }

  if (page['timeline-data']) {
    result.timelineData = page['timeline-data'][0].event.map((e: any) => {
      // <company url="..."> parses to { _, $ }; plain <company> parses to a string
      const company = e.company[0];
      const event: TimelineEvent = {
        year: e.year[0],
        company: typeof company === 'object' ? company._ : company,
        role: e.role[0],
        highlight: e.highlight[0]
      };
      if (typeof company === 'object' && company.$?.url) {
        event.companyUrl = company.$.url;
      }
      return event;
    });
  }

  if (page['personalized-greeting']) {
    result.personalizedGreeting = page['personalized-greeting'][0];
  }

  if (page['generic-greeting']) {
    result.genericGreeting = page['generic-greeting'][0];
  }

  if (page['quick-links']) {
    result.quickLinks = page['quick-links'][0]['link-group'].map((lg: any) => ({
      title: lg.$.title,
      links: lg.link.map((l: any) => ({
        href: l.$.href,
        text: l._
      }))
    }));
  }

  if (page['hero-image']) {
    result.heroImage = page['hero-image'][0];
  }

  if (page['hero-image-alt']) {
    result.heroImageAlt = page['hero-image-alt'][0];
  }

  if (page.personal) {
    result.personal = page.personal[0].section.map((section: any) => ({
      title: section.$.title,
      paragraphs: section.p.map((p: any) => p)
    }));
  }

  if (page.project) {
    result.projects = page.project.map(parseProject);
  }

  if (page['retired-projects']) {
    const retired = page['retired-projects'][0];
    let heading: string | undefined = retired.heading?.[0];
    if (heading === undefined) {
      // Generic section heading: take the sample's when the owner's block has none
      const samplePage = await findSamplePage('pages.xml', 'pages-content', pageId);
      heading = samplePage?.['retired-projects']?.[0]?.heading?.[0];
      if (heading === undefined) {
        throw missingSampleDefault('pages.xml', `<retired-projects><heading> in <page id="${pageId}">`);
      }
    }
    result.retiredProjects = {
      heading,
      projects: (retired.project ?? []).map((project: any) => {
        const parsed: RetiredProject = {
          ...parseProject(project),
          postMortem: project['post-mortem']?.[0]?.p ?? []
        };
        if (project.retired) {
          parsed.retired = project.retired[0];
        }
        return parsed;
      })
    };
    if (retired.description) {
      result.retiredProjects.description = retired.description[0];
    }
  }

  if (page['timeline-heading']) {
    result.timelineHeading = page['timeline-heading'][0];
  }

  if (page['project-labels']) {
    const labels = page['project-labels'][0];
    result.projectLabels = {
      techStack: labels['tech-stack'][0],
      keyFeatures: labels['key-features'][0],
      retired: labels.retired[0],
      postMortem: labels['post-mortem'][0]
    };
  }

  if (page['closing-cta']) {
    const cta = page['closing-cta'][0];
    result.closingCta = {
      heading: cta.heading[0],
      primaryButton: cta['primary-button'][0]._ ?? cta['primary-button'][0],
      primaryHref: cta['primary-button'][0].$?.href ?? '/'
    };
  }

  const labelKeys = pageId in PAGE_LABEL_KEYS ? PAGE_LABEL_KEYS[pageId as LabelledPageId].required : [];
  if (page.labels || labelKeys.length > 0) {
    result.labels = await labelsWithSampleFallback(
      'pages.xml',
      content,
      (root) => findPage(root, 'pages-content', pageId)?.labels?.[0],
      labelKeys,
      `<page id="${pageId}"><labels>`
    );
  }

  if (page['not-found']) {
    const nf = page['not-found'][0];
    result.notFound = {
      heading: nf.heading[0],
      message: nf.message[0],
      primaryButton: nf['primary-button'][0],
      secondaryButton: nf['secondary-button'][0]
    };
  }

  if (pageId === 'privacy') {
    result.privacyContent = {
      title: page.title[0],
      sections: (page.content?.[0]?.section ?? []).map((section: any) => ({
        title: section.h2[0],
        content: section.p[0]
      }))
    };
  }

  return result;
}

// NEW: Parse industry pages from separate file
async function parseIndustryPagesContent(): Promise<any> {
  // Clear cache in development/build to always read fresh XML
  if (process.env.NODE_ENV !== 'production') {
    cachedIndustryPages = null;
  }
  
  if (cachedIndustryPages) {
    return cachedIndustryPages;
  }

  try {
    const xmlPath = contentPath('industry-pages.xml');
    const xmlContent = await fs.readFile(xmlPath, 'utf8');
    
    return new Promise((resolve, reject) => {
      parseString(xmlContent, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          cachedIndustryPages = result;
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error('Error parsing industry pages XML content:', error);
    throw error;
  }
}

// NEW: Parse industry pages from new structure
async function parseIndustryPageFromNewStructure(industry: string): Promise<IndustryPageContent | null> {
  try {
    const content = await parseIndustryPagesContent();
    
    if (!content || !content['industry-pages-content']) {
      return null;
    }
    
    const pages = content['industry-pages-content'].page;
    
    if (!pages || !Array.isArray(pages)) {
      return null;
    }
    
    const page = pages.find((p: any) => p.$.id === industry);
    if (!page) {
      return null;
    }

  const result: IndustryPageContent = {
    id: industry,
    displayName: page['display-name'][0],
    hero: {
      headline: page.hero[0].headline[0],
      hook: page.hero[0].hook[0]
    },
    relevance: {
      statement: page.relevance[0].statement[0]
    },
    featuredAchievements: page['featured-achievements'][0].achievement.map((a: any) => ({
      metric: a.metric[0],
      context: a.context[0]
    })),
    relevantSkills: page['relevant-skills'][0].skill.map((s: any) => s)
  };

  // Optional sections
  if (page['products-built']) {
    result.productsBuilt = {
      title: page['products-built'][0].title[0],
      products: page['products-built'][0].products[0].product.map((p: any) => ({
        id: p.id[0],
        name: p.name[0],
        year: p.year[0],
        metric: p.metric[0],
        metricLabel: p['metric-label'][0],
        image: p.image[0],
        imageAlt: p['image-alt'][0]
      }))
    };
  }

  if (page.testimonials) {
    const allTestimonials = await parseTestimonialsFromNewStructure();
    result.testimonials = {
      testimonials: allTestimonials,
      selectedIds: page.testimonials[0]['selected-ids'][0].id.map((id: any) => id)
    };
  }

  return result;
  } catch (error) {
    console.error('Error in parseIndustryPageFromNewStructure:', error);
    return null;
  }
}

// NEW: Parse hello page from new structure
async function parseHelloPageFromNewStructure(): Promise<PageContent | null> {
  const content = await parseIndustryPagesContent();
  const pages = content['industry-pages-content'].page;
  
  const ownerPage = pages.find((p: any) => p.$.id === 'hello');
  if (!ownerPage) return null;

  const page = await pageWithSampleElements(
    'industry-pages.xml',
    'industry-pages-content',
    'hello',
    ownerPage,
    ['read-more-label']
  );

  const result: PageContent = {
    id: 'hello'
  };

  // Only add properties that exist
  if (page['personalized-greeting']) {
    result.personalizedGreeting = page['personalized-greeting'][0];
  }
  if (page['generic-greeting']) {
    result.genericGreeting = page['generic-greeting'][0];
  }
  if (page.intro) {
    result.intro = page.intro[0];
  }
  if (page['email-context-hook']) {
    result.emailContextHook = page['email-context-hook'][0];
  }

  // Parse quick links if they exist
  if (page['quick-links'] && page['quick-links'][0] && page['quick-links'][0]['link-group']) {
    result.quickLinks = page['quick-links'][0]['link-group'].map((lg: any) => ({
      title: lg.$.title || '',
      links: (lg.link || []).map((l: any) => ({
        href: l.$.href || '#',
        title: (l.title && l.title[0]) || l._ || '',
        context: (l.context && l.context[0]) || ''
      }))
    }));
  }

  // Parse closing hook if it exists
  if (page['closing-hook'] && page['closing-hook'][0]) {
    const closingHook = page['closing-hook'][0];
    if (closingHook.text && closingHook['cta-text'] && closingHook['calendar-text']) {
      result.closingHook = {
        text: closingHook.text[0] || '',
        ctaText: closingHook['cta-text'][0] || '',
        calendarText: closingHook['calendar-text'][0] || ''
      };
      if (closingHook['email-subject']) {
        result.closingHook.emailSubject = closingHook['email-subject'][0];
      } else {
        // Generic mail subject: take the sample's when the owner's block has none
        const samplePage = await findSamplePage('industry-pages.xml', 'industry-pages-content', 'hello');
        const subject = samplePage?.['closing-hook']?.[0]?.['email-subject']?.[0];
        if (subject === undefined) {
          throw missingSampleDefault('industry-pages.xml', '<closing-hook><email-subject> in <page id="hello">');
        }
        result.closingHook.emailSubject = subject;
      }
    }
  }

  if (page['read-more-label']) {
    result.readMoreLabel = page['read-more-label'][0];
  }

  return result;
}

// NEW: Parse deep dives from separate file
async function parseDeepDivesContent(): Promise<any> {
  // Clear cache in development/build to always read fresh XML
  if (process.env.NODE_ENV !== 'production') {
    cachedDeepDives = null;
  }
  
  if (cachedDeepDives) {
    return cachedDeepDives;
  }

  try {
    const xmlPath = contentPath('deep-dives.xml');
    const xmlContent = await fs.readFile(xmlPath, 'utf8');
    
    return new Promise((resolve, reject) => {
      parseString(xmlContent, (err: any, result: any) => {
        if (err) {
          reject(err);
        } else {
          cachedDeepDives = result;
          resolve(result);
        }
      });
    });
  } catch (error) {
    console.error('Error parsing deep dives XML content:', error);
    throw error;
  }
}

// NEW: Parse deep dive from new structure
async function parseDeepDiveFromNewStructure(id: string): Promise<DeepDiveContent | null> {
  const content = await parseDeepDivesContent();
  const deepDives = content['deep-dives-content']['deep-dive'];
  
  const deepDive = deepDives.find((dd: any) => dd.$.id === id);
  if (!deepDive) return null;
  
  const result: DeepDiveContent = {
    id: deepDive.$.id,
    title: deepDive.title[0],
    type: deepDive.$.type || 'case-study',
    listed: deepDive.$.listed === 'true',
    context: {
      company: deepDive.context[0].company[0],
      timeframe: deepDive.context[0].timeframe[0],
      role: deepDive.context[0].role[0],
      stakes: deepDive.context[0].stakes[0]
    },
    problem: {
      summary: deepDive.problem[0].summary[0],
      details: deepDive.problem[0].details[0].detail
    },
    process: deepDive.process[0].phase.map((phase: any) => ({
      name: phase.$.name,
      steps: phase.step
    })),
    results: deepDive.results[0].metric.map((metric: any) => ({
      value: metric.value[0],
      label: metric.label[0]
    }))
  };

  // Parse images if they exist
  if (deepDive.images) {
    result.images = deepDive.images[0].image.map((img: any) => ({
      src: img.$.src,
      alt: img.$.alt,
      caption: img.$.caption
    }));
  }

  // Parse related work link if it exists
  if (deepDive['related-work']) {
    result.relatedWork = {
      label: deepDive['related-work'][0].label[0],
      href: deepDive['related-work'][0].href[0]
    };
  }

  return result;
}

// NEW: Get all deep dives from new structure
async function getAllDeepDivesFromNewStructure(): Promise<DeepDiveContent[]> {
  const content = await parseDeepDivesContent();
  const deepDives = content['deep-dives-content']['deep-dive'];
  
  return deepDives.map((dd: any) => {
    const result: DeepDiveContent = {
      id: dd.$.id,
      title: dd.title[0],
      type: dd.$.type || 'case-study',
      listed: dd.$.listed === 'true',
      context: {
        company: dd.context[0].company[0],
        timeframe: dd.context[0].timeframe[0],
        role: dd.context[0].role[0],
        stakes: dd.context[0].stakes[0]
      },
      problem: {
        summary: dd.problem[0].summary[0],
        details: dd.problem[0].details[0].detail
      },
      process: dd.process[0].phase.map((phase: any) => ({
        name: phase.$.name,
        steps: phase.step
      })),
      results: dd.results[0].metric.map((metric: any) => ({
        value: metric.value[0],
        label: metric.label[0]
      }))
    };

    // Parse images if they exist
    if (dd.images) {
      result.images = dd.images[0].image.map((img: any) => ({
        src: img.$.src,
        alt: img.$.alt,
        caption: img.$.caption
      }));
    }

    return result;
  });
}

export async function getGlobalContent(): Promise<GlobalContent> {
  return await parseGlobalElements();
}

export async function getPageContent(pageId: string): Promise<PageContent | null> {
  // Handle static pages
  const staticPages = ['home', 'about', 'projects', 'privacy', 'not-found', 'blog', 'deep-dives'];
  if (staticPages.includes(pageId)) {
    return await parseStaticPagesFromNewStructure(pageId);
  }

  // Handle hello page from industry pages structure
  if (pageId === 'hello') {
    return await parseHelloPageFromNewStructure();
  }

  // Page not found
  return null;
}

// Typed <labels> for a static page. Required keys are always present.
export async function getPageLabels<P extends LabelledPageId>(pageId: P): Promise<PageLabels<P>> {
  const page = await parseStaticPagesFromNewStructure(pageId);
  // When the owner's pages.xml has no such page, the required labels still resolve from the sample
  const labels: Record<string, string> = page?.labels ?? await labelsWithSampleFallback(
    'pages.xml',
    await parsePagesContent(),
    (root) => findPage(root, 'pages-content', pageId)?.labels?.[0],
    PAGE_LABEL_KEYS[pageId].required,
    `<page id="${pageId}"><labels>`
  );
  return labels as unknown as PageLabels<P>;
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  return await parseTestimonialsFromNewStructure();
}

export async function getIndustryPageContent(industry: string): Promise<IndustryPageContent | null> {
  return await parseIndustryPageFromNewStructure(industry);
}

export async function getDeepDiveContent(id: string): Promise<DeepDiveContent | null> {
  return await parseDeepDiveFromNewStructure(id);
}

export async function getListedDeepDives(): Promise<DeepDiveContent[]> {
  const allDeepDives = await getAllDeepDivesFromNewStructure();
  return allDeepDives.filter(dd => dd.listed === true);
}

// New function to get only product briefs
export async function getListedProductBriefs(): Promise<DeepDiveContent[]> {
  const allDeepDives = await getListedDeepDives();
  return allDeepDives.filter(dd => dd.type === 'product-brief');
}

// New function to get only case studies
export async function getListedCaseStudies(): Promise<DeepDiveContent[]> {
  const allDeepDives = await getListedDeepDives();
  return allDeepDives.filter(dd => dd.type === 'case-study');
}

export async function getAllIndustries(): Promise<string[]> {
  const content = await parseIndustryPagesContent();
  const pages = content['industry-pages-content'].page;
  
  if (!pages || !Array.isArray(pages)) {
    return [];
  }
  
  // Return all page IDs from the new structure, excluding hello
  return pages
    .map((page: any) => page.$.id)
    .filter((id: string) => id && id !== 'hello');
}

export async function getAllDeepDives(): Promise<string[]> {
  const content = await parseDeepDivesContent();
  const deepDives = content['deep-dives-content']['deep-dive'];
  
  if (!deepDives || !Array.isArray(deepDives)) {
    return [];
  }
  
  // Return all deep dive IDs (both listed and unlisted)
  return deepDives.map((dd: any) => dd.$.id).filter(Boolean);
}

// Blog content parsing functions
async function scanBlogMarkdownFiles(): Promise<BlogPost[]> {
  // Clear cache in development/build to always read fresh files
  if (process.env.NODE_ENV !== 'production') {
    cachedBlogPosts = null;
  }
  
  if (cachedBlogPosts) {
    return cachedBlogPosts;
  }

  try {
    const blogDir = contentPath('blog-markdown');
    const files = await fs.readdir(blogDir);
    const markdownFiles = files.filter(file => file.endsWith('.md'));
    
    const blogPosts: BlogPost[] = [];
    
    for (const filename of markdownFiles) {
      const filePath = join(blogDir, filename);
      const fileContent = await fs.readFile(filePath, 'utf8');
      
      // Parse frontmatter using gray-matter (same as processMarkdown)
      const { data } = matter(fileContent);
      
      // Generate slug from filename if not specified in frontmatter
      const slug = data.slug || filename.replace('.md', '');
      
      // Generate id from slug
      const id = slug;
      
      // Default listed to true if not specified
      const listed = data.listed !== undefined ? data.listed : true;
      
      // Validate required frontmatter fields
      if (!data.title || !data.date || !data.category || !data.excerpt) {
        console.warn(`Blog post ${filename} is missing required frontmatter fields (title, date, category, excerpt)`);
        continue;
      }
      
      const blogPost: BlogPost = {
        id,
        slug,
        title: data.title,
        date: data.date,
        category: data.category,
        excerpt: data.excerpt,
        listed
      };
      
      blogPosts.push(blogPost);
    }
    
    // Sort posts by date (newest first)
    blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    cachedBlogPosts = blogPosts;
    return blogPosts;
  } catch (error) {
    console.error('Error scanning blog markdown files:', error);
    throw error;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  return await scanBlogMarkdownFiles();
}

export async function getListedBlogPosts(): Promise<BlogPost[]> {
  const allPosts = await getBlogPosts();
  return allPosts.filter(post => post.listed);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const allPosts = await getBlogPosts();
  const post = allPosts.find(p => p.slug === slug);
  
  if (!post) {
    return null;
  }

  // Load and process the markdown content
  try {
    const markdownPath = contentPath('blog-markdown', `${slug}.md`);
    const markdownContent = await fs.readFile(markdownPath, 'utf8');
    
    const processed = await processMarkdown(markdownContent);
    
    return {
      ...post,
      content: processed.content,
      htmlContent: processed.htmlContent
    };
  } catch (error) {
    console.error(`Error loading markdown for blog post ${slug}:`, error);
    return post; // Return post without content if markdown fails to load
  }
}

export async function getAllBlogSlugs(): Promise<string[]> {
  const posts = await getBlogPosts();
  return posts.map(post => post.slug);
} 