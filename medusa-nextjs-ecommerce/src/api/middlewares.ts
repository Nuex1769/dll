import { defineMiddlewares, authenticate } from "@medusajs/framework/http"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/blog*",
      middlewares: [authenticate("user", ["session", "bearer"])],
    },
  ],
})
