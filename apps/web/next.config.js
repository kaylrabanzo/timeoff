/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@timeoff/types',
    '@timeoff/database',
    '@timeoff/utils'
  ],
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com'],
  },
  // Enable standalone output for Docker
  output: 'standalone',
}

module.exports = nextConfig 