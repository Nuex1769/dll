import { useState, useCallback } from "react"

interface PaymentIntentResponse {
  clientSecret: string
  publishableKey: string
  paymentIntentId: string
  amount: number
  currency: string
}

/**
 * Hook: 处理 Stripe 支付
 */
export function useStripePayment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentResponse | null>(null)

  const createPaymentIntent = useCallback(
    async (amount: number, currency: string, orderId?: string) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/payment/stripe/intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, currency, orderId }),
        })

        if (!response.ok) {
          throw new Error("Failed to create payment intent")
        }

        const data = await response.json()
        setPaymentIntent(data)
        return data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const confirmPayment = useCallback(async (paymentIntentId: string) => {
    try {
      const response = await fetch(
        `/api/payment/stripe/confirm?payment_intent=${paymentIntentId}`
      )

      if (!response.ok) {
        throw new Error("Failed to confirm payment")
      }

      const data = await response.json()
      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setError(message)
      throw err
    }
  }, [])

  return {
    createPaymentIntent,
    confirmPayment,
    paymentIntent,
    loading,
    error,
  }
}

/**
 * Hook: 处理 PayPal 支付
 */
export function usePayPalPayment() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createPayPalOrder = useCallback(
    async (amount: number, currency: string, orderId?: string) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/payment/paypal/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, currency, orderId }),
        })

        if (!response.ok) {
          throw new Error("Failed to create PayPal order")
        }

        const data = await response.json()
        return data
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        setError(message)
        throw err
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const capturePayment = useCallback(async (paypalOrderId: string) => {
    try {
      const response = await fetch("/api/payment/paypal/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paypalOrderId }),
      })

      if (!response.ok) {
        throw new Error("Failed to capture payment")
      }

      return await response.json()
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error"
      setError(message)
      throw err
    }
  }, [])

  return {
    createPayPalOrder,
    capturePayment,
    loading,
    error,
  }
}

/**
 * Hook: 处理 Apple Pay
 */
export function useApplePayPayment() {
  const [supported, setSupported] = useState(false)

  const isApplePayAvailable = () => {
    if (typeof window !== "undefined" && "ApplePaySession" in window) {
      const ApplePaySession = (window as any).ApplePaySession
      return ApplePaySession.canMakePayments()
    }
    return false
  }

  return {
    supported: isApplePayAvailable(),
  }
}
