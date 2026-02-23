/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    transpilePackages: ["@blinddate/database", "@blinddate/shared"],
};

module.exports = nextConfig;
