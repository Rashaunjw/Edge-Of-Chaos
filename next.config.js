/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Prevent Next.js devtools segment explorer from crashing the dev bundler.
    devtoolSegmentExplorer: false,
  },
  // Optional: reduces dev UI noise (errors will still show via the overlay).
  devIndicators: false,
};

module.exports = nextConfig;

