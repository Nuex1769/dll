import { model } from "@medusajs/framework/utils"

const BlogPost = model.define("blog_post", {
  id: model.id().primaryKey(),
  title: model.text(),
  slug: model.text().unique(),
  content: model.text(),
  excerpt: model.text().nullable(),
  cover_image: model.text().nullable(),
  author: model.text().nullable(),
  status: model.enum(["draft", "published"]).default("draft"),
  tags: model.array().nullable(),
  locale: model.text().default("en"),
  published_at: model.dateTime().nullable(),
})

export default BlogPost
