import type {
  MedusaRequest,
  MedusaResponse,
} from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

interface InventoryCheckItem {
  variant_id: string
  quantity: number
}

/**
 * POST /store/inventory
 * 批量检查商品库存可用性
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const inventoryModule = req.scope.resolve(Modules.INVENTORY)
  const { items } = req.body as { items: InventoryCheckItem[] }

  if (!items || !Array.isArray(items)) {
    res.status(400).json({ error: "items array is required" })
    return
  }

  try {
    const checks = await Promise.all(
      items.map(async (item) => {
        const [inventoryItem] = await inventoryModule.listInventoryItems({
          sku: item.variant_id,
        })

        const available = inventoryItem
          ? await inventoryModule.retrieveAvailableQuantity(inventoryItem.id)
          : 0

        return {
          variant_id: item.variant_id,
          requested: item.quantity,
          available: Number(available) || 0,
          in_stock: (Number(available) || 0) >= item.quantity,
        }
      })
    )

    res.json({ inventory_check: checks })
  } catch (error: any) {
    res.status(500).json({ error: error.message })
  }
}
