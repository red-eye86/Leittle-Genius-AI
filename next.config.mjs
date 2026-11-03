/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse'],
  },
};

export default nextConfig;

