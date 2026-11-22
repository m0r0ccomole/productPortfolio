import { Html, Head, Main, NextScript } from 'next/document'

// Regions where analytics cookies default to denied: the EEA (EU plus Iceland,
// Liechtenstein and Norway), the UK and Switzerland. ISO 3166-1 alpha-2 codes.
const CONSENT_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE',
  'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  'IS', 'LI', 'NO', 'GB', 'CH',
]

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Google Tag Manager */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          // Not next/script or @next/third-parties: both change
          // when GTM loads, and the second adds a dependency. Keep Google's
          // standard inline snippet in <head> so tag timing stays as it is.
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Consent defaults, set before GTM loads. Analytics cookies are
                // denied by default in the EEA, UK and Switzerland; advertising
                // storage is denied everywhere. GA4 tags in GTM honor these
                // without any container setting. Details: docs/development.md.
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent', 'default', {
                  analytics_storage: 'denied', ad_storage: 'denied',
                  ad_user_data: 'denied', ad_personalization: 'denied',
                  region: ${JSON.stringify(CONSENT_REGIONS)}
                });
                gtag('consent', 'default', {
                  analytics_storage: 'granted', ad_storage: 'denied',
                  ad_user_data: 'denied', ad_personalization: 'denied'
                });
                // Nothing loads when the browser sends Global Privacy Control
                if (!navigator.globalPrivacyControl) (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
              `,
            }}
          />
        )}
      </Head>
      <body>
        {/* Google Tag Manager (noscript) */}
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
        )}
        <Main />
        <NextScript />
      </body>
    </Html>
  )
} 