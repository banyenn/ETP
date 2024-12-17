/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: ['antd'],
  webpack: (config) => {
    return config;
  },
}

module.exports = nextConfig 