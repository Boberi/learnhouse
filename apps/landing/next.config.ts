import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: '/landing',
  output: 'standalone',
  reactStrictMode: true,
  images: {
    // Avoid /_next/image server-side fetches (Unsplash). In Docker those often
    // hang with no/slow egress and nginx returns 504 Gateway Timeout.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
