/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "ui-avatars.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
