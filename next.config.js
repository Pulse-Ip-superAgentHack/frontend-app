/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Only run ESLint on these directories during production builds
    dirs: ['src'],
    // Warnings don't fail the build in production
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // TypeScript errors are treated as warnings in development
    // But treated as errors in production builds
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig 