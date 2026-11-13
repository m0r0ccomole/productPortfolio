import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Navigation from './Navigation';
import FreshnessIndicator from './FreshnessIndicator';
import { GlobalContent } from '../lib/types';

interface LayoutProps {
  children: React.ReactNode;
  globalContent: GlobalContent;
  metaKey?: string; // Looks up title/description in <seo><page id="..."> of global-elements.xml
  title?: string; // Explicit props win over the metaKey lookup
  description?: string;
  keywords?: string;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  globalContent,
  metaKey,
  title,
  description,
  keywords = globalContent.seo.defaultKeywords
}) => {
  const pageMeta = metaKey ? globalContent.seo.pages[metaKey] : undefined;
  title = title ?? pageMeta?.title ?? globalContent.siteTitle;
  description = description ?? pageMeta?.description ?? globalContent.seo.defaultDescription;
  const siteUrl = (process.env.SITE_URL || globalContent.siteUrl).replace(/\/$/, '');
  const { favicon, ogImage } = globalContent.globalImages ?? {};
  const ogImageUrl = ogImage ? `${siteUrl}${ogImage}` : undefined;
  const labels = globalContent.uiLabels;

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={globalContent.ownerName} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {favicon && <link rel="icon" href={favicon} />}

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        {ogImageUrl && <meta property="og:image" content={ogImageUrl} />}

        {/* Twitter */}
        <meta property="twitter:card" content={ogImageUrl ? 'summary_large_image' : 'summary'} />
        <meta property="twitter:url" content={siteUrl} />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        {ogImageUrl && <meta property="twitter:image" content={ogImageUrl} />}
        
        {/* Analytics handled by GTM in _document.tsx */}
        
        {process.env.MICROSOFT_CLARITY_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${process.env.MICROSOFT_CLARITY_ID}");
              `,
            }}
          />
        )}
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Skip to content link for accessibility */}
        <a href="#main-content" className="skip-link">
          {labels['skip-link']}
        </a>

        <Navigation 
          navigation={globalContent.navigation} 
          siteTitle={globalContent.siteTitle}
          globalImages={globalContent.globalImages}
          labels={labels}
        />

        <main id="main-content" className="pt-16">
          {children}
        </main>

        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <FreshnessIndicator label={labels['last-updated']} />
              </div>
              
              <div className="flex space-x-6 text-sm text-gray-600">
                <Link href="/privacy" className="hover:text-primary-600 transition-colors">
                  {labels['footer-privacy']}
                </Link>
                <a href={`mailto:${globalContent.contactEmail}`} className="hover:text-primary-600 transition-colors">
                  {labels['footer-contact']}
                </a>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
              © {new Date().getFullYear()} {globalContent.ownerName}. {labels['footer-rights']}
              {globalContent.credit && (
                <>
                  {' · '}
                  <a href={globalContent.credit.href} className="hover:text-primary-600 transition-colors">
                    {globalContent.credit.text}
                  </a>
                </>
              )}
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout; 