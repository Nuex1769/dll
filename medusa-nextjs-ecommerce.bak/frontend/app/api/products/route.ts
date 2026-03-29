import { NextRequest, NextResponse } from "next/server"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"

/**
 * GET /api/products
 * 获取产品列表
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const locale = searchParams.get("locale") || "en"
    const currency = searchParams.get("currency") || "USD"
    const limit = searchParams.get("limit") || "20"
    const offset = searchParams.get("offset") || "0"

    const response = await fetch(
      `${MEDUSA_URL}/store/products?limit=${limit}&offset=${offset}`,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Medusa API error: ${response.statusText}`)
    }

    const data = await response.json()

    // 转换产品数据
    const products = data.products.map((product: any) => ({
      id: product.id,
      handle: product.handle,
      title: product.metadata?.translations?.[locale]?.title || product.title,
      description:
        product.metadata?.translations?.[locale]?.description ||
        product.description,
      thumbnail: product.thumbnail,
      images: product.images,
      variants: product.variants.map((variant: any) => ({
        id: variant.id,
        title: variant.title,
        sku: variant.sku,
        prices: variant.prices,
        inventory_quantity: variant.inventory_quantity,
      })),
    }))

    return NextResponse.json({
      products,
      count: data.count,
      offset: parseInt(offset as string),
    })
  } catch (error) {
    console.error("Failed to fetch products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/products/[handle]
 * 获取单个产品详情
 */
export async function getProductByHandle(handle: string, locale: string = "en") {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/products/${handle}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Product not found")
    }

    const data = await response.json()
    const product = data.product

    return {
      id: product.id,
      handle: product.handle,
      title: product.metadata?.translations?.[locale]?.title || product.title,
      description:
        product.metadata?.translations?.[locale]?.description ||
        product.description,
      thumbnail: product.thumbnail,
      images: product.images,
      collection: product.collection,
      variants: product.variants,
      options: product.options,
      metadata: product.metadata,
    }
  } catch (error) {
    console.error("Failed to fetch product:", error)
    throw error
  }
}

/**
 * GET /api/products/search
 * 搜索产品
 */
export async function searchProducts(
  query: string,
  locale: string = "en"
): Promise<any[]> {
  try {
    const response = await fetch(
      `${MEDUSA_URL}/store/products?query=${encodeURIComponent(query)}&limit=10`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      throw new Error("Search failed")
    }

    const data = await response.json()
    return data.products || []
  } catch (error) {
    console.error("Search error:", error)
    return []
  }
}
