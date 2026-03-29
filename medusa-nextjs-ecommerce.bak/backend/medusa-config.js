import { loadEnv, defineConfig } from "@medusajs/utils"

loadEnv(process.env.NODE_ENV, process.cwd())

export default defineConfig({
  projectConfig: {
    databaseURL: process.env.DATABASE_URL,
    redisURL: process.env.REDIS_URL || "redis://localhost:6379",
    http: {
      storeCors: process.env.STORE_CORS || "*",
      adminCors: process.env.ADMIN_CORS || "http://localhost:7001",
      authCors: process.env.AUTH_CORS || "*",
      jwtSecret: process.env.JWT_SECRET || "your_jwt_secret",
      cookieSecret: process.env.COOKIE_SECRET || "your_cookie_secret",
    },
  },
  featureFlags: {
    inventory: true,
    publishable_api_keys: true,
  },
  // 支付提供商
  plugins: [
    // Stripe 支付方式  
    {
      resolve: "@medusajs/payment-stripe",
      options: {
        api_key: process.env.STRIPE_API_KEY,
      },
    },
  ],
  // Admin Plugin
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "false",
    autoRebuild: true,
  },
  workerMode: process.env.MEDUSA_WORKER_MODE || "shared",
})
