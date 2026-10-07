import type { NextConfig } from "next";
import packageJson from "./package.json";

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
  async redirects() {
    return [
      { source: "/blog/binary-search/visual", destination: "/learn/binary-search", permanent: true },
      { source: "/blog/longest-increasing-subsequence/visual", destination: "/learn/longest-increasing-subsequence", permanent: true },
    ];
  },
  transpilePackages: ["browsercc"],
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
    };

    if (!isServer) {
      config.output.environment = {
        ...config.output.environment,
        asyncFunction: true,
      };
    }

    return config;
  },
};

export default nextConfig;
