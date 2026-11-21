// Click tracking for Google Tag Manager.
//
// Events go to window.dataLayer, which the GTM snippet in pages/_document.tsx
// reads. With no GTM container configured nothing reads the array, so pushing
// is harmless. GTM-side setup: docs/setup-guide.md#contact-button-clicks.

type DataLayerEvent = Record<string, unknown>;

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

interface CtaClick {
  /** 'navigation' for links, 'action' for buttons without an href */
  actionType: 'navigation' | 'action';
  /** Where the click leads, or the tracking label for buttons without an href */
  destination: string;
  /** Optional label identifying the button or link; defaults to destination */
  label?: string;
}

/**
 * Push a `cta_click` event to the GTM data layer.
 *
 * Every parameter is set on every push, missing UTM values as undefined, so
 * GTM's merged data layer never carries a value over from an earlier click.
 */
export function trackCtaClick({ actionType, destination, label }: CtaClick): void {
  if (typeof window === 'undefined') return;

  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string | undefined> = {};
  for (const key of UTM_KEYS) {
    utm[key] = params.get(key) ?? undefined;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'cta_click',
    event_category: 'CTA',
    event_label: label || destination,
    action_type: actionType,
    destination,
    ...utm,
    page_path: window.location.pathname,
  });
}
