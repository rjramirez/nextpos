import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'localhost', // Allow images from localhost
      'your-project.supabase.co',
    ],
  },
};

export default nextConfig;
