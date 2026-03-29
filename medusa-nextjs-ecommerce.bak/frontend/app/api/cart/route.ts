import { NextRequest, NextResponse } from "next/server"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"

/**
 * POST /api/cart
 * 创建新的购物车
 */
export async function POST(request: NextRequest) {
  try {
    const { region_id, currency_code } = await request.json()

    const response = await fetch(`${MEDUSA_URL}/store/carts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        region_id: region_id || "",
        currency_code: currency_code || "USD",
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to create cart")
    }

    const data = await response.json()

    return NextResponse.json({
      cart_id: data.cart.id,
      items: data.cart.items || [],
      subtotal: data.cart.subtotal,
      tax_total: data.cart.tax_total,
      shipping_total: data.cart.shipping_total,
      total: data.cart.total,
      currency_code: data.cart.currency_code,
    })
  } catch (error) {
    console.error("Cart creation error:", error)
    return NextResponse.json(
      { error: "Failed to create cart" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/cart/[cartId]
 * 获取购物车内容
 */
export async function getCart(cartId: string) {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/carts/${cartId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Cart not found")
    }

    const data = await response.json()
    const cart = data.cart

    return {
      cart_id: cart.id,
      items: cart.items,
      subtotal: cart.subtotal,
      tax_total: cart.tax_total,
      shipping_total: cart.shipping_total,
      total: cart.total,
      currency_code: cart.currency_code,
    }
  } catch (error) {
    console.error("Failed to fetch cart:", error)
    throw error
  }
}

/**
 * POST /api/cart/[cartId]/line-items
 * 添加产品到购物车
 */
export async function addToCart(
  cartId: string,
  variant_id: string,
  quantity: number
) {
  try {
    const response = await fetch(
      `${MEDUSA_URL}/store/carts/${cartId}/line-items`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variant_id,
          quantity,
        }),
      }
    )

    if (!response.ok) {
      throw new Error("Failed to add item to cart")
    }

    const data = await response.json()
    return data.cart
  } catch (error) {
    console.error("Add to cart error:", error)
    throw error
  }
}

/**
 * DELETE /api/cart/[cartId]/line-items/[lineItemId]
 * 从购物车移除产品
 */
export async function removeFromCart(
  cartId: string,
  lineItemId: string
) {
  try {
    const response = await fetch(
      `${MEDUSA_URL}/store/carts/${cartId}/line-items/${lineItemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )

    if (!response.ok) {
      throw new Error("Failed to remove item from cart")
    }

    const data = await response.json()
    return data.cart
  } catch (error) {
    console.error("Remove from cart error:", error)
    throw error
  }
}

/**
 * PATCH /api/cart/[cartId]/line-items/[lineItemId]
 * 更新购物车商品数量
 */
export async function updateLineItemQuantity(
  cartId: string,
  lineItemId: string,
  quantity: number
) {
  try {
    const response = await fetch(
      `${MEDUSA_URL}/store/carts/${cartId}/line-items/${lineItemId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity }),
      }
    )

    if (!response.ok) {
      throw new Error("Failed to update quantity")
    }

    const data = await response.json()
    return data.cart
  } catch (error) {
    console.error("Update quantity error:", error)
    throw error
  }
}
