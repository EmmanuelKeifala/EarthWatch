/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // 'utfs.io'
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
    ],
  },
};
export default nextConfig;
