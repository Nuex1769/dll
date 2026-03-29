import { useState, useCallback } from "react"

interface InventoryCheckItem {
  variant_id: string
  quantity: number
}

interface InventoryCheckResult {
  variant_id: string
  requested: number
  available: number
  in_stock: boolean
}

/**
 * Hook: 检查库存可用性
 */
export function useInventoryCheck() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<InventoryCheckResult[]>([])

  const checkInventory = useCallback(
    async (items: InventoryCheckItem[]) => {
      setLoading(true)
      setError(null)

      try {
        const response = await fetch("/api/inventory/check", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ items }),
        })

        if (!response.ok) {
          throw new Error("Failed to check inventory")
        }

        const data = await response.json()
        setResults(data.inventory_check || [])
        return data.inventory_check
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error"
        setError(message)
        return []
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const isInStock = useCallback(
    (variantId: string, quantity: number = 1): boolean => {
      const result = results.find((r) => r.variant_id === variantId)
      return result ? result.available >= quantity : false
    },
    [results]
  )

  const getAvailable = useCallback(
    (variantId: string): number => {
      const result = results.find((r) => r.variant_id === variantId)
      return result?.available || 0
    },
    [results]
  )

  return {
    checkInventory,
    isInStock,
    getAvailable,
    results,
    loading,
    error,
  }
}

/**
 * Hook: 库存预留（购物车）
 */
export function useInventoryReservation() {
  const [reserved, setReserved] = useState<
    Map<string, { quantity: number; expiresAt: number }>
  >(new Map())

  const reserve = useCallback(
    (variantId: string, quantity: number, timeoutMinutes: number = 15) => {
      const expiresAt = Date.now() + timeoutMinutes * 60 * 1000
      setReserved((prev) => {
        const newMap = new Map(prev)
        newMap.set(variantId, { quantity, expiresAt })
        return newMap
      })
    },
    []
  )

  const release = useCallback((variantId: string) => {
    setReserved((prev) => {
      const newMap = new Map(prev)
      newMap.delete(variantId)
      return newMap
    })
  }, [])

  const getReserved = useCallback(
    (variantId: string): number => {
      const reservation = reserved.get(variantId)
      if (!reservation) return 0
      if (Date.now() > reservation.expiresAt) {
        release(variantId)
        return 0
      }
      return reservation.quantity
    },
    [reserved, release]
  )

  const isExpired = useCallback(
    (variantId: string): boolean => {
      const reservation = reserved.get(variantId)
      return reservation ? Date.now() > reservation.expiresAt : false
    },
    [reserved]
  )

  return {
    reserve,
    release,
    getReserved,
    isExpired,
    reserved,
  }
}
