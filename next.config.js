/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Disable static generation for pages that use Clerk during build
    missingSuspenseWithCSRBailout: false,
  },
  // Ignore build errors from missing environment variables during build
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Environment variable validation
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '',
  },
}

module.exports = nextConfig
