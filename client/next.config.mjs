/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.doctorazi.com",
        port: "",
        pathname: "/**", // Allow any path from this domain
      },
      {
        protocol: "http",
        hostname: "62.60.204.118", // Include the IP if needed
        port: "8443",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
