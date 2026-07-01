/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "hotshoes.com.my" }],
        destination: "https://www.hotshoes.asia/:path*",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.hotshoes.com.my" }],
        destination: "https://www.hotshoes.asia/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
