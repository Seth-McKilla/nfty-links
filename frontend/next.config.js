/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["prod-metadata.s3.amazonaws.com", "ethereum.org"],
  },
  images: {
    domains: ["cdn.pixabay.com", "prod-metadata.s3.amazonaws.com"],
  },
};
