/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'your-project.supabase.co', // Replace with your Supabase project domain
      'localhost',
    ],
  },
}

module.exports = nextConfig