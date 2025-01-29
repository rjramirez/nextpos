/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'your-project.supabase.co', // Replace with your Supabase project domain
      'localhost',
      'lh3.googleusercontent.com',
    ],
  },
}

module.exports = nextConfig