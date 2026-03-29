import { NextRequest, NextResponse } from "next/server"
import axios from "axios"

const PAYPAL_API_BASE =
  process.env.PAYPAL_MODE === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com"

/**
 * 获取 PayPal Access Token
 */
async function getPayPalAccessToken(): Promise<string> {
  try {
    const response = await axios.post(
      `${PAYPAL_API_BASE}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        auth: {
          username: process.env.PAYPAL_CLIENT_ID || "",
          password: process.env.PAYPAL_SECRET || "",
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    )

    return response.data.access_token
  } catch (error) {
    console.error("Failed to get PayPal access token:", error)
    throw error
  }
}

/**
 * POST /api/payment/paypal/orders
 * 创建 PayPal Order
 */
export async function POST(request: NextRequest) {
  try {
    const { amount, currency, orderId } = await request.json()

    if (!amount || !currency) {
      return NextResponse.json(
        { error: "Amount and currency are required" },
        { status: 400 }
      )
    }

    const accessToken = await getPayPalAccessToken()

    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: orderId || "ORDER_" + Date.now(),
            amount: {
              currency_code: currency.toUpperCase(),
              value: amount.toString(),
            },
            description: "Order from Medusa Store",
          },
        ],
        // 支付成功/失败后的重定向URL
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/confirm?method=paypal`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout?cancelled=true`,
          brand_name: "Medusa Store",
          locale: "en-US",
          landing_page: "BILLING",
          user_action: "PAY_NOW",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )

    const order = response.data

    // 找到 approve 链接
    const approveLink = order.links.find(
      (link: any) => link.rel === "approve"
    )?.href

    return NextResponse.json(
      {
        orderId: order.id,
        status: order.status,
        approveUrl: approveLink,
        links: order.links,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("PayPal order creation error:", error)
    return NextResponse.json(
      { error: "Failed to create PayPal order" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/payment/paypal/capture
 * 捕获 PayPal 支付
 */
export async function capturePayment(paypalOrderId: string) {
  try {
    const accessToken = await getPayPalAccessToken()

    const response = await axios.post(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    )

    const order = response.data

    return {
      status: order.status,
      id: order.id,
      purchase_units: order.purchase_units,
      payer: order.payer,
    }
  } catch (error) {
    console.error("PayPal capture error:", error)
    throw error
  }
}

/**
 * POST /api/payment/paypal/webhook
 * PayPal Webhook 处理
 */
export async function handlePayPalWebhook(request: NextRequest) {
  try {
    const body = await request.json()

    // 验证 webhook 签名
    const webhookId = process.env.PAYPAL_WEBHOOK_ID
    const webhookSignature = request.headers.get("paypal-transmission-sig")
    const webhookId_header = request.headers.get("paypal-transmission-id")
    const webhookTime = request.headers.get("paypal-transmission-time")

    // 在生产环境中应该验证签名
    // 这里为示例代码

    // 处理不同的webhook事件
    const eventType = body.event_type

    switch (eventType) {
      case "CHECKOUT.ORDER.COMPLETED":
        console.log("PayPal order completed:", body.resource.id)
        // TODO: 更新订单状态为 paid
        break

      case "PAYMENT.CAPTURE.COMPLETED":
        console.log("PayPal payment captured:", body.resource.id)
        // TODO: 更新订单支付状态
        break

      case "PAYMENT.CAPTURE.REFUNDED":
        console.log("PayPal payment refunded:", body.resource.id)
        // TODO: 更新订单退款状态
        break

      default:
        console.log(`Unhandled PayPal event: ${eventType}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error("PayPal webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/payment/paypal/verify
 * 验证 PayPal 订单状态
 */
export async function verifyPayment(paypalOrderId: string) {
  try {
    const accessToken = await getPayPalAccessToken()

    const response = await axios.get(
      `${PAYPAL_API_BASE}/v2/checkout/orders/${paypalOrderId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    )

    return response.data
  } catch (error) {
    console.error("PayPal verification error:", error)
    throw error
  }
}
