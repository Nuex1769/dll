"use server"

const MEDUSA_BACKEND_URL =
  process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"

const PUBLISHABLE_KEY =
  process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

export type BlogPost = {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  cover_image: string | null
  author: string | null
  status: "draft" | "published"
  tags: string[] | null
  locale: string
  published_at: string | null
  created_at: string
  updated_at: string
}

type ListBlogPostsResponse = {
  posts: BlogPost[]
  count: number
  limit: number
  offset: number
}

const headers: Record<string, string> = {
  "x-publishable-api-key": PUBLISHABLE_KEY,
}

/**
 * 获取已发布的博客文章列表
 */
export async function listBlogPosts(options?: {
  locale?: string
  tag?: string
  limit?: number
  offset?: number
}): Promise<ListBlogPostsResponse> {
  const { locale, tag, limit = 10, offset = 0 } = options || {}

  const params = new URLSearchParams()
  params.set("limit", String(limit))
  params.set("offset", String(offset))
  if (locale) params.set("locale", locale)
  if (tag) params.set("tag", tag)

  try {
    const res = await fetch(
      `${MEDUSA_BACKEND_URL}/store/blog?${params.toString()}`,
      { headers, next: { revalidate: 60 } }
    )

    if (!res.ok) {
      return { posts: [], count: 0, limit, offset }
    }

    return await res.json()
  } catch {
    return { posts: [], count: 0, limit, offset }
  }
}

/**
 * 获取单篇已发布的博客文章
 */
export async function getBlogPost(
  slug: string
): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${MEDUSA_BACKEND_URL}/store/blog/${slug}`, {
      headers,
      next: { revalidate: 60 },
    })

    if (!res.ok) return null

    const data = await res.json()
    return data.post || null
  } catch {
    return null
  }
}
