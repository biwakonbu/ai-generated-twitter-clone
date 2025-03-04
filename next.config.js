/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    serverComponentsExternalPackages: ["better-sqlite3", "fs", "path"],
  },
  webpack: (config, { isServer }) => {
    // サーバーサイドでのみNode.jsモジュールを許可
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        util: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
