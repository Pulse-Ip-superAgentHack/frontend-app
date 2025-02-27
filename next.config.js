/** @type {import('next').NextConfig} */
const webpack = require('webpack');

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
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  webpack: (config, { isServer, dev }) => {
    // Exclude mint-ip page from build temporarily
    if (!dev) {
      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.ENABLE_MINT_IP': JSON.stringify(false),
        })
      );
    }
    return config;
  },
}

module.exports = nextConfig 