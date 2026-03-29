import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
})

/**
 * POST /api/payment/stripe/intent
 * 创建 Stripe Payment Intent
 */
export async function POST(request: NextRequest) {
  try {
    const { amount, currency, orderId, metadata } = await request.json()

    if (!amount || !currency) {
      return NextResponse.json(
        { error: "Amount and currency are required" },
        { status: 400 }
      )
    }

    // 创建 Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe 用最小单位 (cents)
      currency: currency.toLowerCase(),
      metadata: {
        orderId: orderId || "",
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true, // 启用自动支付方式
      },
      statement_descriptor: "MEDUSA STORE", // 银行卡对账单描述
    })

    return NextResponse.json(
      {
        clientSecret: paymentIntent.client_secret,
        publishableKey: process.env.NEXT_PUBLIC_STRIPE_KEY,
        paymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Stripe error:", error)
    return NextResponse.json(
      { error: "Failed to create payment intent" },
      { status: 500 }
    )
  }
}

/**
 * GET /api/payment/stripe/confirm
 * 确认支付状态
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const paymentIntentId = searchParams.get("payment_intent")

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: "Payment intent ID is required" },
        { status: 400 }
      )
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(
      paymentIntentId
    )

    return NextResponse.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      charges: paymentIntent.charges?.data || [],
      metadata: paymentIntent.metadata,
    })
  } catch (error) {
    console.error("Error confirming payment:", error)
    return NextResponse.json(
      { error: "Failed to confirm payment" },
      { status: 500 }
    )
  }
}

/**
 * POST /api/payment/stripe/webhook
 * Stripe Webhook 处理
 */
export async function handleStripeWebhook(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature") || ""

    let event

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ""
      )
    } catch (error) {
      console.error("Webhook signature verification failed:", error)
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      )
    }

    // 处理不同的webhook事件
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        console.log("Payment succeeded:", paymentIntent.id)
        // TODO: 更新订单状态为 paid
        break

      case "payment_intent.payment_failed":
        const failedIntent = event.data.object as Stripe.PaymentIntent
        console.log("Payment failed:", failedIntent.id)
        // TODO: 更新订单状态为 payment_failed
        break

      case "charge.refunded":
        const refundedCharge = event.data.object as Stripe.Charge
        console.log("Charge refunded:", refundedCharge.id)
        // TODO: 更新订单退款状态
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
