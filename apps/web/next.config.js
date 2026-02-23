const withNextIntl = require("next-intl/plugin")("./src/i18n.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    transpilePackages: ["@blinddate/database", "@blinddate/shared", "@blinddate/i18n"],
};

module.exports = withNextIntl(nextConfig);
