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
} from "@medusajs/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"

const CreateBlogPostPage = () => {
  const { t } = useTranslation()
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

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = async (publishNow = false) => {
    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        ...form,
        tags: form.tags
          ? form.tags.split(",").map((t) => t.trim()).filter(Boolean)
          : [],
        status: publishNow ? "published" : form.status,
      }

      if (!payload.slug) delete payload.slug
      if (!payload.excerpt) payload.excerpt = null
      if (!payload.cover_image) payload.cover_image = null
      if (!payload.author) payload.author = null

      const res = await fetch("/admin/blog", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json()
        alert(t("blog.error.generic", { message: err.message || t("blog.error.create_failed") }))
        return
      }

      const data = await res.json()
      window.location.href = `/app/blog/${data.post.id}`
    } catch (err) {
      console.error("Failed to create post:", err)
      alert(t("blog.error.create_failed"))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Container>
      <div className="flex items-center justify-between mb-6">
        <Heading level="h1">{t("blog.create_post")}</Heading>
        <div className="flex gap-2">
          <a href="/app/blog">
            <Button variant="secondary">{t("blog.actions.cancel")}</Button>
          </a>
          <Button
            variant="secondary"
            onClick={() => handleSave(false)}
            disabled={saving || !form.title || !form.content}
          >
            {t("blog.actions.save_draft")}
          </Button>
          <Button
            variant="primary"
            onClick={() => handleSave(true)}
            disabled={saving || !form.title || !form.content}
          >
            {t("blog.actions.publish")}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 max-w-3xl">
        <div>
          <Label htmlFor="title">{t("blog.form.title_required")}</Label>
          <Input
            id="title"
            placeholder={t("blog.form.title_placeholder")}
            value={form.title}
            onChange={(e) => updateField("title", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="slug">{t("blog.form.slug_label")} ({t("blog.form.slug_hint")})</Label>
          <Input
            id="slug"
            placeholder={t("blog.form.slug_placeholder")}
            value={form.slug}
            onChange={(e) => updateField("slug", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="excerpt">{t("blog.form.excerpt_label")}</Label>
          <Textarea
            id="excerpt"
            placeholder={t("blog.form.excerpt_placeholder")}
            value={form.excerpt}
            onChange={(e) => updateField("excerpt", e.target.value)}
            rows={3}
          />
        </div>

        <div>
          <Label htmlFor="content">{t("blog.form.content_required")}</Label>
          <Textarea
            id="content"
            placeholder={t("blog.form.content_placeholder")}
            value={form.content}
            onChange={(e) => updateField("content", e.target.value)}
            rows={20}
          />
          <Text className="text-ui-fg-subtle text-sm mt-1">
            {t("blog.form.content_hint")}
          </Text>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="author">{t("blog.form.author_label")}</Label>
            <Input
              id="author"
              placeholder={t("blog.form.author_placeholder")}
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
            placeholder={t("blog.form.cover_image_placeholder")}
            value={form.cover_image}
            onChange={(e) => updateField("cover_image", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="tags">{t("blog.form.tags_label")}</Label>
          <Input
            id="tags"
            placeholder={t("blog.form.tags_placeholder")}
            value={form.tags}
            onChange={(e) => updateField("tags", e.target.value)}
          />
        </div>
      </div>
    </Container>
  )
}

export const config = defineRouteConfig({
  label: "Create Post",
})

export default CreateBlogPostPage
