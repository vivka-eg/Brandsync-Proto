/** @type {import('next').NextConfig} */
function getWordPressImageRemotePatterns() {
  return [
    {
      protocol: "https",
      hostname: "brand.cmsegsync.com",
      pathname: "/**",
    },
  ];
}

const nextConfig = {
  images: {
    remotePatterns: [
      // Dev S3 bucket
      {
        protocol: "https",
        hostname:
          "dev-brandsync-asset-manager-457087769501.s3.eu-central-1.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname:
          "dev-brandsync-asset-manager-457087769501.s3.eu-central-1.amazonaws.com",
        pathname: "/**",
      },
      // Stage S3 bucket
      {
        protocol: "https",
        hostname: "s3-brandsync-strapi-stage-01.s3.eu-central-1.amazonaws.com",
        pathname: "/**",
      },
      // Prod S3 bucket
      {
        protocol: "https",
        hostname: "s3-brandsync-strapi-prod-01.s3.eu-central-1.amazonaws.com",
        pathname: "/**",
      },

      // mcp s3 bucket 
        {
        protocol: "https",
        hostname: "dev-brandsync-mcp-source.s3.eu-central-1.amazonaws.com",
        pathname: "/**",
      },
      ...getWordPressImageRemotePatterns(),
    ],
  },
};

export default nextConfig;
