# Site Architecture Breakdown for Content Feedback

Here's a comprehensive breakdown of how content flows from XML to presentation on this Next.js portfolio site:

## 1. Content Management System

### XML File Structure (5 Specialized Files)
The site uses a **distributed XML content management system** with 5 specialized files:

1. **`content/global-elements.xml`** - Site-wide elements
   - Navigation menu items
   - Site title and tagline
   - Button text (CTA primary, secondary, email)
   - Global images (headshot with alt text)
   - CTA content strings (email subjects, button text variants)
   - Owner identity (name, site URL, contact email, optional scheduling link and footer credit) and SEO defaults

2. **`content/testimonials.xml`** - Social proof system
   - Complete testimonials collection
   - Each testimonial has: id, quote, name, title, company, image, imageAlt
   - Used selectively across different pages via ID references

3. **`content/pages.xml`** - Static page content
   - Home page (hero, metrics summary)
   - About page (hero image, personal sections, timeline)
   - Projects page (side projects with tech stacks)
   - Privacy policy (sections and content)

4. **`content/industry-pages.xml`** - Industry-specific landing pages
   - One page per target role, served at `/resume/{id}`
   - Each has: hero (headline/hook), relevance statement, achievements, skills
   - **Optional products-built sections** - showcase of 0-1 products with metrics/images
   - **Testimonials integration** - selected testimonial IDs for each page
   - **Hello page** - email signature landing with personalization

5. **`content/deep-dives.xml`** - Case studies and product content
   - **Two content types**: `type="case-study"` (default) vs `type="product-brief"`
   - **Visibility control**: `listed="true/false"` controls appearance in listings
   - Each entry has: context, problem, process, results, images
   - **Images array** with src, alt, and caption for visual proof

## 2. Content Processing Pipeline

### TypeScript Interface Layer (`lib/types.ts`)
All content is type-safe through comprehensive interfaces:
- `GlobalContent` - site-wide elements with optional sections
- `PageContent` - flexible structure supporting different page types
- `IndustryPageContent` - industry landing pages with optional products-built
- `DeepDiveContent` - case studies/product briefs with type differentiation
- `Testimonial` - social proof with image fallbacks
- `ProductCard` - product showcase with metrics and navigation

### Content Parser (`lib/contentParser.ts`)
**Specialized parsing functions** handle each content type:
- **Caching system** - content cached in production, fresh in development
- **Filtered queries** - separate functions for listed vs unlisted content
- **Type differentiation** - `getListedProductBriefs()` vs `getListedCaseStudies()`
- **Content validation** - graceful handling of missing sections

## 3. Page Types and Content Flow

### Homepage (`pages/index.tsx`)
**Content Sources**: `pages.xml` (home page section)
**Key Sections**:
- Hero section with headline/subheading
- Metrics summary (animated cards)
- Featured case studies (selected in XML)
- Industry expertise links (navigation to industry pages)

### Industry Landing Pages (`pages/resume/[industry].tsx`)
**Content Sources**: `industry-pages.xml` + `testimonials.xml`
**Template**: `components/templates/IndustryLanding.tsx`
**Key Sections**:
- Hero with industry-specific headline/hook
- Relevance statement (value proposition)
- Featured achievements (metric + context)
- **Products Built** (optional) - visual product cards with metrics
- **Testimonials** (optional) - filtered by selected-ids
- Relevant skills grid
- **Contextual CTA** - industry-specific email subjects and button text

### Deep Dives Listing (`pages/deep-dives/index.tsx`)
**Content Sources**: `deep-dives.xml` (filtered)
**Two distinct sections**:
1. **"Products I've Built"** - shows `type="product-brief"` + `listed="true"`
2. **"Deep Dive Case Studies"** - shows `type="case-study"` + `listed="true"`

### Individual Deep Dives (`pages/deep-dives/[id].tsx`)
**Content Sources**: `deep-dives.xml` (single entry)
**Template**: `components/templates/DeepDive.tsx`
**Conditional Layout**:
- **Product Briefs** (`type="product-brief"`):
  - Hero image at top
  - Simplified "Opportunity" section
  - Streamlined process (grid layout)
  - Emphasized results
- **Case Studies** (`type="case-study"`):
  - Detailed problem breakdown
  - Sequential process visualization
  - Visual proof section with multiple images
  - Longer-form content

## 4. Content Presentation Patterns

### Visual Hierarchy
1. **Hero sections** - Large headlines with supporting text
2. **Metrics** - Animated number cards with context
3. **Process visualization** - Step-by-step or phase-based
4. **Results** - Prominent achievement metrics
5. **Visual proof** - Screenshots and UI examples
6. **Social proof** - Testimonials with headshots
7. **CTAs** - Contextual calls-to-action with smart email subjects

### Content Categorization
- **Listed vs Unlisted**: `listed="true/false"` controls visibility in indexes
- **Type Differentiation**: `type="product-brief"` vs `type="case-study"`
- **Industry Segmentation**: Content filtered by industry relevance
- **Testimonial Selection**: `selected-ids` for page-specific social proof

### Interactive Elements
- **Product cards** - hover effects, click-through to briefs
- **Navigation** - active state tracking, headshot integration
- **Floating buttons** - gradient styling, size variants
- **Animations** - `motion` (shared variants in `lib/motion.ts`) for progressive disclosure

## 5. Content Relationships and Dependencies

### Cross-Referenced Content
- **Products Built** → **Product Briefs**: Industry pages reference deep-dive IDs
- **Testimonials** → **Pages**: Selected testimonial IDs filter display
- **Navigation** → **Global**: Site-wide navigation from global elements
- **CTAs** → **Context**: Smart email subjects based on page type

### Content Context Flow
1. **Industry pages** showcase products → link to product briefs
2. **Product briefs** emphasize outcomes → link to contact
3. **Case studies** detail process → demonstrate expertise
4. **Testimonials** provide social proof → build credibility

## 6. Content Management Workflow

### Content Creation Process
1. **Add content** to appropriate XML file
2. **Reference images** in `/public/images/` subdirectories (the sample persona uses `/public/sample/`)
3. **Set visibility** with `listed="true/false"`
4. **Choose type** with `type="product-brief"` or `type="case-study"`
5. **Build site** to regenerate static pages

### Content Organization Strategy
- **Global elements** - site-wide consistency
- **Industry segmentation** - targeted messaging
- **Content type differentiation** - appropriate presentation
- **Selective display** - curated content experience