import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer";

const nextConfig: NextConfig = {
  experimental: {
    mdxRs: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default withContentlayer(nextConfig);