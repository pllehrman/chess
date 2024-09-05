import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Define security headers for SharedArrayBuffer support
  async headers() {
    return [
      {
        // Apply headers to all routes
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "require-corp",
          },
        ],
      },
    ];
  },

  env: {
    // Add your environment variables here
  },
};

export default nextConfig;
