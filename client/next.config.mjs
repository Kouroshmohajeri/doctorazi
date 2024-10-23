/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "www.doctorazi.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
