// Defaults the freshness indicator to the day the site was built.
// Set LAST_UPDATED (YYYY-MM-DD) to pin a specific date instead.
const buildDate = new Date().toISOString().slice(0, 10)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    MICROSOFT_CLARITY_ID: process.env.MICROSOFT_CLARITY_ID,
    SITE_URL: process.env.SITE_URL,
    LAST_UPDATED: process.env.LAST_UPDATED || buildDate,
  },
}

module.exports = nextConfig 