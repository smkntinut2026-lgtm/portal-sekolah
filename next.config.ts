import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lkihfswufiglkolnwdlz.supabase.co',
      },
    ],
  },
}

export default nextConfig
