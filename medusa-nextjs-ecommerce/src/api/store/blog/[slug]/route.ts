import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import BlogModuleService from "../../../../modules/blog/service"
import { BLOG_MODULE } from "../../../../modules/blog"

/**
 * GET /store/blog/:slug
 * 公开接口 — 获取单篇已发布的博客文章
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const blogService: BlogModuleService = req.scope.resolve(BLOG_MODULE)
  const { slug } = req.params

  const [posts] = await blogService.listAndCountBlogPosts(
    { slug, status: "published" },
    { take: 1 }
  )

  if (!posts.length) {
    res.status(404).json({ message: "Post not found" })
    return
  }

  res.json({ post: posts[0] })
}
