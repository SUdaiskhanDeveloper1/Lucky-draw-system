/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lint is run separately (`npm run lint`); don't fail production builds on
  // style rules. Type errors still fail the build.
  eslint: { ignoreDuringBuilds: true },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
