/** @type {import('next').NextConfig} */

const NextFederationPlugin = require("@module-federation/nextjs-mf");

const nextConfig = {
  reactStrictMode: true,
  webpack5: true,
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: "mfeApp2",
        filename: "static/chunks/remoteEntry.js",
        exposes: {
          "./UserForm": "./src/components/UserForm.tsx",
        },
      })
    );
    config.optimization.splitChunks = false;
    return config;
  },
};

module.exports = nextConfig;
