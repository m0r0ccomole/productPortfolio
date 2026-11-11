// ROLE: building block
// PURPOSE: Reusable call-to-action section (heading, subheading, primary/secondary buttons).
// CONTENT: none of its own — receives a CTAConfig prop the caller assembles from content/global-elements.xml.
// SAFE TO RESTYLE: layout, spacing, semantic color tokens.
// DO NOT: hardcode copy here, fetch content here.

import React from 'react';
import FloatingButton from './FloatingButton';
import { CTAConfig } from '../lib/types';

interface CTASectionProps {
  config: CTAConfig;
  className?: string;
}

const CTASection: React.FC<CTASectionProps> = ({ config, className = '' }) => {
  return (
    <section className={`mt-16 pt-12 border-t border-gray-200 ${className}`}>
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {config.heading}
        </h3>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
          {config.subheading}
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <FloatingButton
            variant="primary"
            href={config.primaryHref}
            size="lg"
            className="w-full sm:w-auto"
            trackingLabel="CTA Section - Primary"
          >
            {config.primaryText}
          </FloatingButton>
          
          {config.secondaryText && config.secondaryHref && (
            <FloatingButton
              variant="secondary"
              href={config.secondaryHref}
              size="lg"
              className="w-full sm:w-auto"
              trackingLabel="CTA Section - Secondary"
            >
              {config.secondaryText}
            </FloatingButton>
          )}
        </div>
      </div>
    </section>
  );
};

export default CTASection; 