/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return {
      // "beforeFiles" rewrites run before Next.js checks its own file-system routes.
      // This is the correct place for .html paths because Next.js has no .html pages
      // of its own — it would 404 them before afterFiles ever runs.
      beforeFiles: [
        // Proxy any explicit .html request directly to the static server.
        // Covers: /about.html, /product.html, /solutions.html, /pricing.html, etc.
        {
          source: "/:path*.html",
          destination: "http://localhost:3001/:path*.html",
        },
      ],

      // "afterFiles" rewrites run after Next.js checks its own pages but before
      // the 404 fallback — safe to proxy external paths here.
      afterFiles: [
        // Landing page root
        {
          source: "/",
          destination: "http://localhost:3001/",
        },
        // Marketing pages (clean URLs → .html files on the static server)
        {
          source: "/about",
          destination: "http://localhost:3001/about.html",
        },
        {
          source: "/pricing",
          destination: "http://localhost:3001/pricing.html",
        },
        {
          source: "/product",
          destination: "http://localhost:3001/product.html",
        },
        {
          source: "/security",
          destination: "http://localhost:3001/security.html",
        },
        {
          source: "/solutions",
          destination: "http://localhost:3001/solutions.html",
        },
        // Static assets (CSS, JS, images) required by the landing page
        {
          source: "/assets/:path*",
          destination: "http://localhost:3001/assets/:path*",
        },
      ],

      // "fallback" rewrites run only when no page or afterFiles rule matched.
      fallback: [],
    };
  },
};

export default nextConfig;

