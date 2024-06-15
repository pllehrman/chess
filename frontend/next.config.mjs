import './dotenv.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    // Add other environment variables here as needed
  },
};

export default nextConfig;
