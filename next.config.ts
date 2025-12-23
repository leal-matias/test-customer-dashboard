import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // AssetPrefix: URL de tu app en Amplify (donde están los archivos estáticos)
  // Esto hace que los JS/CSS se carguen directamente desde Amplify, no del proxy de Shopify
  assetPrefix: process.env.NEXT_PUBLIC_APP_URL || undefined,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: `frame-ancestors https://*.myshopify.com https://admin.shopify.com;`,
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
