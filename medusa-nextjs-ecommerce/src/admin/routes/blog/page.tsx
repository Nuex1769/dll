import { defineRouteConfig } from "@medusajs/admin-sdk"
import { DocumentText } from "@medusajs/icons"
import { Container, Heading, Table, Badge, Button, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

type BlogPost = {
  id: string
  title: string
  slug: string
  status: "draft" | "published"
  locale: string
  author: string | null
  published_at: string | null
  created_at: string
}

const BlogListPage = () => {
  const { t, i18n } = useTranslation()
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const res = await fetch("/admin/blog?limit=50", {
        credentials: "include",
      })
      const data = await res.json()
      setPosts(data.posts || [])
      setCount(data.count || 0)
    } catch (err) {
      console.error("Failed to fetch posts:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—"
    const dateLocale = i18n.language?.startsWith("zh") ? "zh-CN" : "en-US"
    return new Date(dateStr).toLocaleDateString(dateLocale, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <div>
          <Heading level="h1">{t("blog.title")}</Heading>
          <Text className="text-ui-fg-subtle mt-1">
            {t("blog.description", { count })}
          </Text>
        </div>
        <a href="/app/blog/create">
          <Button variant="primary">{t("blog.create_post")}</Button>
        </a>
      </div>

      {loading ? (
        <Text>{t("blog.loading")}</Text>
      ) : posts.length === 0 ? (
        <div className="text-center py-12">
          <Text className="text-ui-fg-subtle">
            {t("blog.no_posts")}
          </Text>
        </div>
      ) : (
        <Table>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>{t("blog.table.title")}</Table.HeaderCell>
              <Table.HeaderCell>{t("blog.table.status")}</Table.HeaderCell>
              <Table.HeaderCell>{t("blog.table.locale")}</Table.HeaderCell>
              <Table.HeaderCell>{t("blog.table.author")}</Table.HeaderCell>
              <Table.HeaderCell>{t("blog.table.published")}</Table.HeaderCell>
              <Table.HeaderCell>{t("blog.table.created")}</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {posts.map((post) => (
              <Table.Row
                key={post.id}
                className="cursor-pointer"
                onClick={() => {
                  window.location.href = `/app/blog/${post.id}`
                }}
              >
                <Table.Cell>
                  <Text className="font-medium">{post.title}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Badge
                    color={post.status === "published" ? "green" : "grey"}
                  >
                    {t(`blog.status.${post.status}`)}
                  </Badge>
                </Table.Cell>
                <Table.Cell>
                  <Badge color="blue">{post.locale}</Badge>
                </Table.Cell>
                <Table.Cell>
                  <Text>{post.author || "—"}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{formatDate(post.published_at)}</Text>
                </Table.Cell>
                <Table.Cell>
                  <Text>{formatDate(post.created_at)}</Text>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      )}
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Blog",
  icon: DocumentText,
})

export default BlogListPage
