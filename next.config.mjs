/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === "true";

const nextConfig = {
  htmlLimitedBots: /.*/,
  output: isStaticExport ? "export" : "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dashboard.tourpickkars.in",
      },
    ],
  },
  async redirects() {
    if (isStaticExport) {
      return [];
    }

    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'tourpickkars.in' }],
        destination: 'https://www.tourpickkars.in/:path*',
        permanent: true,
      },
      {
        source: '/enquiry.php',
        destination: '/contact',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
