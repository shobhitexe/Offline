/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  transpilePackages: ["@repo/ui", "@repo/types", "@repo/config-tailwind"],
  images: {
    remotePatterns: [{ hostname: "res.cloudinary.com" }, { hostname: "*" }],
  },
};
