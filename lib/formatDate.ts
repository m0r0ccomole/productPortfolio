const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Format a YYYY-MM-DD string as "January 1, 2026".
 *
 * Parsed by hand rather than with new Date('YYYY-MM-DD'), which is UTC
 * midnight and renders as the previous day in US time zones, and formatted
 * without toLocaleDateString so server and client output always match.
 */
export function formatIsoDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
