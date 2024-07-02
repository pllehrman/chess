import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    // Add other environment variables here as needed
  },
};

export default nextConfig;
