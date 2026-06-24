/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return {
      beforeFiles: [],

      afterFiles: [
        // Proxy the landing page root and all marketing routes to the
        // new Next.js landing-page app running on port 3000.
        {
          source: "/",
          destination: "http://localhost:3000/",
        },
        {
          source: "/about",
          destination: "http://localhost:3000/about",
        },
        {
          source: "/pricing",
          destination: "http://localhost:3000/pricing",
        },
        {
          source: "/product",
          destination: "http://localhost:3000/product",
        },
        {
          source: "/security",
          destination: "http://localhost:3000/security",
        },
        {
          source: "/solutions",
          destination: "http://localhost:3000/solutions",
        },
        // Proxy Next.js internal assets (_next/*) from the landing page app
        // so scripts and styles load correctly when pages are proxied.
        {
          source: "/_next/:path*",
          destination: "http://localhost:3000/_next/:path*",
        },
      ],

      fallback: [],
    };
  },
};

export default nextConfig;
