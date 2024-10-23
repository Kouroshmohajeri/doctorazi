/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "doctorazi.com",
        port: "8443",
      },
    ],
  },
};

export default nextConfig;
