/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Disable source maps in development to fix source map errors
  productionBrowserSourceMaps: false,
  // Turbopack configuration (Next.js 16 uses Turbopack by default)
  // Empty config silences the warning - Turbopack works fine without custom config
  turbopack: {},
  // Webpack config for when using --webpack flag (optional)
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = false; // Disable source maps in development
    }
    return config;
  },
}

export default nextConfig
