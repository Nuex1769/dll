import { MedusaRequest, MedusaResponse } from "@medusajs/medusa"
import Stripe from "stripe"

// Stripe Payment Processor
const stripe = new Stripe(process.env.STRIPE_API_KEY || "", {
  apiVersion: "2023-10-16",
})

/**
 * POST /admin/orders/:id/capture
 * Manually capture a payment for an order
 */
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const orderService = req.scope.resolve("orderService")
  const paymentService = req.scope.resolve("paymentService")

  try {
    const order = await orderService.retrieve(id, {
      relations: ["payments"],
    })

    if (!order.payments || order.payments.length === 0) {
      return res.status(400).json({ error: "No payment found for order" })
    }

    const payment = order.payments[0]

    if (payment.provider_id === "stripe") {
      // 捕获 Stripe 支付
      const paymentIntent = await stripe.paymentIntents.retrieve(payment.data.id)

      if (paymentIntent.status === "succeeded") {
        // 更新订单状态
        const updatedOrder = await orderService.update(id, {
          payment_status: "captured",
        })
        return res.json({ order: updatedOrder })
      }
    }

    return res.status(400).json({ error: "Payment status is not ready" })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

/**
 * Refund an order payment
 */
export async function refundPayment(req: MedusaRequest, res: MedusaResponse) {
  const { orderId, amount } = req.body
  const refundService = req.scope.resolve("refundService")
  const orderService = req.scope.resolve("orderService")

  try {
    const order = await orderService.retrieve(orderId, {
      relations: ["payments"],
    })

    const payment = order.payments?.[0]
    if (!payment) {
      return res.status(400).json({ error: "No payment found" })
    }

    if (payment.provider_id === "stripe") {
      const refund = await stripe.refunds.create({
        payment_intent: payment.data.id,
        amount: Math.round(amount * 100),
      })

      return res.json({ refund })
    }

    return res.status(400).json({ error: "Unsupported payment provider" })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}

/**
 * Get payment methods available for a region
 */
export async function getAvailablePaymentMethods(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { regionId } = req.params
  const regionService = req.scope.resolve("regionService")

  try {
    const region = await regionService.retrieve(regionId)

    const paymentMethods = region.payment_providers || []

    return res.json({
      region_id: regionId,
      currency: region.currency_code,
      payment_methods: paymentMethods,
      supported_methods: {
        stripe: true,
        paypal: true,
        apple_pay: true, // via Stripe
      },
    })
  } catch (error) {
    return res.status(500).json({ error: error.message })
  }
}
