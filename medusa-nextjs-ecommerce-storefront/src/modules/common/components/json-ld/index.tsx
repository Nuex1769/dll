/**
 * JSON-LD structured data component for SEO.
 * Renders a <script type="application/ld+json"> tag with the provided data.
 */
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
