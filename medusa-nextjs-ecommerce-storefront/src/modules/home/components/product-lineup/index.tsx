import { listProducts } from "@lib/data/products"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import ProductLineupCarousel, { ProductLineupItem } from "./carousel"

type ProductLineupProps = {
  region: HttpTypes.StoreRegion
  /** 最多展示多少个产品，默认 8 */
  limit?: number
  /** 按 collection_id 筛选 */
  collectionId?: string
}

export default async function ProductLineup({
  region,
  limit = 8,
  collectionId,
}: ProductLineupProps) {
  const queryParams: Record<string, any> = {
    limit,
    fields: "*variants.calculated_price",
  }

  if (collectionId) {
    queryParams.collection_id = collectionId
  }

  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams,
  })

  if (!products || products.length === 0) {
    return null
  }

  // Transform server data into the shape the client carousel needs
  const items: ProductLineupItem[] = products.map((product) => {
    const { cheapestPrice } = getProductPrice({ product })

    // Try to extract a tag from product metadata, tags, or collection
    const tag =
      (product.metadata?.tag as string) ||
      (product as any).tags?.[0]?.value ||
      (product as any).collection?.title ||
      product.type?.value ||
      null

    return {
      id: product.id,
      handle: product.handle || product.id,
      title: product.title,
      subtitle: product.subtitle || null,
      thumbnail: product.thumbnail || null,
      tag,
      cheapestPrice: cheapestPrice?.calculated_price ?? null,
    }
  })

  return <ProductLineupCarousel products={items} />
}
