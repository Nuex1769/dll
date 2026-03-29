import { MedusaContainer } from "@medusajs/medusa"
import { createClient } from "redis"
import * as express from "express"

const initializeBackend = async (container: MedusaContainer) => {
  const app = container.resolve("app") as express.Application

  // 自定义 API 路由示例
  app.get("/store/custom/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() })
  })

  // Region API 扩展 - 获取支持的货币
  app.get("/store/regions", async (req, res) => {
    const regionService = container.resolve("regionService")
    try {
      const regions = await regionService.list()
      const formattedRegions = regions.map((region) => ({
        id: region.id,
        name: region.name,
        currency_code: region.currency_code,
        countries: region.countries,
        payment_providers: region.payment_providers,
      }))
      res.json({ regions: formattedRegions })
    } catch (error) {
      res.status(500).json({ error: error.message })
    }
  })

  // Inventory API - 检查库存
  app.post("/store/inventory/check", async (req, res) => {
    const inventoryService = container.resolve("inventoryService")
    const { items } = req.body

    try {
      const checks = await Promise.all(
        items.map(async (item: { variant_id: string; quantity: number }) => {
          // 获取库存信息
          const inventory = await inventoryService.retrieveInventoryItem(
            item.variant_id
          )
          return {
            variant_id: item.variant_id,
            requested: item.quantity,
            available: inventory.quantity || 0,
            in_stock: (inventory.quantity || 0) >= item.quantity,
          }
        })
      )

      res.json({ inventory_check: checks })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
  })
}

export default initializeBackend
