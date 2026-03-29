import { NextRequest, NextResponse } from "next/server"

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"

/**
 * POST /api/orders
 * 创建订单
 */
export async function POST(request: NextRequest) {
  try {
    const {
      cartId,
      email,
      first_name,
      last_name,
      phone,
      shipping_address,
      billing_address,
      payment_provider,
    } = await request.json()

    // 验证必要字段
    if (!cartId || !email || !shipping_address) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // 调用 Medusa 创建订单
    const response = await fetch(`${MEDUSA_URL}/store/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cart_id: cartId,
        customer_email: email,
        shipping_address: {
          first_name,
          last_name,
          phone,
          ...shipping_address,
        },
        billing_address: billing_address || shipping_address,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create order")
    }

    const orderData = await response.json()

    return NextResponse.json(
      {
        order_id: orderData.order.id,
        display_id: orderData.order.display_id,
        status: orderData.order.status,
        total: orderData.order.total,
        currency_code: orderData.order.currency_code,
        items: orderData.order.items,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Order creation error:", error)
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/orders/[orderId]
 * 获取订单详情
 */
export async function getOrder(orderId: string) {
  try {
    const response = await fetch(`${MEDUSA_URL}/store/orders/${orderId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error("Order not found")
    }

    const data = await response.json()
    const order = data.order

    return {
      id: order.id,
      display_id: order.display_id,
      status: order.status,
      payment_status: order.payment_status,
      fulfillment_status: order.fulfillment_status,
      total: order.total,
      subtotal: order.subtotal,
      tax_total: order.tax_total,
      shipping_total: order.shipping_total,
      currency_code: order.currency_code,
      customer_email: order.customer?.email,
      items: order.items,
      shipping_address: order.shipping_address,
      billing_address: order.billing_address,
      created_at: order.created_at,
      fulfillments: order.fulfillments,
    }
  } catch (error) {
    console.error("Failed to fetch order:", error)
    throw error
  }
}

/**
 * POST /api/orders/[orderId]/customer-email
 * 更新订单客户邮箱
 */
export async function updateOrderEmail(
  orderId: string,
  email: string
) {
  try {
    const response = await fetch(
      `${MEDUSA_URL}/store/orders/${orderId}/customer-email`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    )

    if (!response.ok) {
      throw new Error("Failed to update email")
    }

    const data = await response.json()
    return data.order
  } catch (error) {
    console.error("Update email error:", error)
    throw error
  }
}

/**
 * GET /api/orders/confirmation
 * 订单确认页面数据
 */
export async function getOrderConfirmation(
  orderId: string
) {
  try {
    const order = await getOrder(orderId)

    return {
      order: {
        id: order.id,
        display_id: order.display_id,
        total: order.total,
        currency_code: order.currency_code,
        items: order.items,
        shipping_address: order.shipping_address,
        created_at: order.created_at,
      },
      confirmation_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${orderId}`,
    }
  } catch (error) {
    throw error
  }
}
