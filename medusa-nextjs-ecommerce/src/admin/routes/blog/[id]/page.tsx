import { defineRouteConfig } from "@medusajs/admin-sdk"
import {
  Container,
  Heading,
  Input,
  Label,
  Textarea,
  Button,
  Select,
  Text,
  Badge,
} from "@medusajs/ui"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"

const EditBlogPostPage = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    cover_image: "",
    author: "",
    tags: "",
    locale: "en",
    status: "draft" as "draft" | "published",
  })

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await fetch(`/admin/blog/${id}`, {
          credentials: "include",
        })
        const data = await res.json()
        const post = data.post
        setForm({
          title: post.title || "",
          slug: post.slug || "",
          content: post.content || "",
          excerpt: post.excerpt || "",
          cover_image: post.cover_image || "",
          author: post.author || "",
          tags: Array.isArray(post.tags) ? post.tags.join(", ") : "",
          locale: post.locale || "en",
          status: post.status || "draft",
        })
      } catch (err) {
        console.error("Failed to fetch post:", err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchPost()
  }, [id])

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (newStatus?: "draft" | "published") => {
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        title: form.title,
        slug: form.slug,
        content: form.content,
        excerpt: form.excerpt || null,
        cover_image: form.cover_image || null,
        author: form.author || null,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        locale: form.locale,
        status: newStatus || form.status,
      }

      const res = await fetch(`/admin/blog/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        alert(t("blog.error.generic", { message: err.message || t("blog.error.update_failed") }))
        return
      }

      if (newStatus) {
        setForm((prev) => ({ ...prev, status: newStatus }))
      }
      alert(t("blog.save_success"))
    } catch (err) {
      console.error("Failed to update post:", err)
      alert(t("blog.error.update_failed"))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(t("blog.confirm_delete"))) return

    try {
      await fetch(`/admin/blog/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
      window.location.href = "/app/blog"
    } catch (err) {
      console.error("Failed to delete post:", err)
      alert(t("blog.error.delete_failed"))
    }
  }

  if (loading) {
    return (
      <Container>
        <Text>{t("blog.loading")}</Text>
      </Container>
    )
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Heading level="h1">{t("blog.edit_post")}</Heading>
          <Badge color={form.status === "published" ? "green" : "grey"}>
            {t(`blog.status.${form.status}`)}
          </Badge>
        </div>
        <div className="flex gap-2">
          <a href="/app/blog">
            <Button variant="secondary">{t("blog.actions.back")}</Button>
          </a>
          <Button
            variant="secondary"
            onClick={handleDelete}
            className="text-red-600"
          >
            {t("blog.actions.delete")}
          </Button>
          {form.status === "published" ? (
            <>
              <Button
                variant="secondary"
                onClick={() => handleSave("draft")}
                disabled={saving}
              >
                {t("blog.actions.unpublish")}
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSave()}
                disabled={saving || !form.title || !form.content}
              >
                {t("blog.actions.save")}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={() => handleSave()}
                disabled={saving || !form.title || !form.content}
              >
                {t("blog.actions.save_draft")}
              </Button>
              <Button
                variant="primary"
                onClick={() => handleSave("published")}
                disabled={saving || !form.title || !form.content}
              >
                {t("blog.actions.publish")}
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="grid gap-6 max-w-3xl">
        <div>
          <Label htmlFor="title">{t("blog.form.title_required")}</Label>
          <Input
            id="title"
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="slug">{t("blog.form.slug_label")}</Label>
          <Input
            id="slug"
            value={form.slug}
            onChange={(e) => updateField("slug", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="excerpt">{t("blog.form.excerpt_label")}</Label>
          <Textarea
            id="excerpt"
            value={form.excerpt}
            onChange={(e) => updateField("excerpt", e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="content">{t("blog.form.content_required")}</Label>
          <Textarea
            id="content"
            value={form.content}
            onChange={(e) => updateField("content", e.target.value)}
            rows={20}
          />
          <Text className="text-ui-fg-subtle text-sm mt-1">
            {t("blog.form.content_hint_short")}
          </Text>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="author">{t("blog.form.author_label")}</Label>
            <Input
              id="author"
              value={form.author}
              onChange={(e) => updateField("author", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="locale">{t("blog.form.locale_label")}</Label>
            <Select
              value={form.locale}
              onValueChange={(v) => updateField("locale", v)}
            >
              <Select.Trigger>
                <Select.Value placeholder={t("blog.form.locale_placeholder")} />
              </Select.Trigger>
              <Select.Content>
                <Select.Item value="en">English</Select.Item>
                <Select.Item value="zh">中文</Select.Item>
              </Select.Content>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="cover_image">{t("blog.form.cover_image_label")}</Label>
          <Input
            id="cover_image"
            value={form.cover_image}
            onChange={(e) => updateField("cover_image", e.target.value)}
          />
          {form.cover_image && (
            <div className="mt-2">
              <img
                src={form.cover_image}
                alt="Cover preview"
                className="max-w-md rounded border"
              />
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="tags">{t("blog.form.tags_label")}</Label>
          <Input
            id="tags"
            value={form.tags}
            onChange={(e) => updateField("tags", e.target.value)}
          />
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Edit Post",
})

export default EditBlogPostPage
