import next from 'eslint-config-next';
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals';

const config = [
  ...next,
  ...nextCoreWebVitals,
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**', '.claude/**'],
  },
  {
    // <img> is intentional in the image components: the site is a static
    // export, where next/image needs a custom loader or unoptimized mode.
    files: [
      'components/CaseStudyImage.tsx',
      'components/Headshot.tsx',
      'components/HeroImage.tsx',
      'components/ProductCard.tsx',
      'components/Testimonials.tsx',
    ],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
];

export default config;
