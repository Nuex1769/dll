/** @type {import('next').NextConfig} */
const nextConfig = {
  // 国际化由 next-intl 在 App Router 中处理，不使用 next.config 的 i18n

  // 图片优化
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.stripe.com",
      },
      {
        protocol: "https",
        hostname: "**.medusa.dev",
      },
      // 添加你的CDN域名
      {
        protocol: "https",
        hostname: "cdn.example.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
  },

  // 环境变量
  env: {
    NEXT_PUBLIC_MEDUSA_URL: process.env.NEXT_PUBLIC_MEDUSA_URL,
    NEXT_PUBLIC_STRIPE_KEY: process.env.NEXT_PUBLIC_STRIPE_KEY,
    NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
  },

  // 响应头配置安全性
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ]
  },

  // 重定向规则
  async redirects() {
    return [
      // 旧URL重定向
      {
        source: "/shop/:path*",
        destination: "/en/products/:path*",
        permanent: true,
      },
    ]
  },

  // 重写规则 - 代理 Medusa API 请求
  async rewrites() {
    const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_URL
    if (!medusaUrl) {
      return { beforeFiles: [] }
    }
    return {
      beforeFiles: [
        {
          source: "/api/medusa/:path*",
          destination: `${medusaUrl}/:path*`,
        },
      ],
    }
  },

  // TypeScript和ESLint
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },

  eslint: {
    dirs: ["app", "components", "lib", "hooks"],
  },

  // React 严格模式
  reactStrictMode: true,

  // 性能优化
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
