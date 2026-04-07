import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  deleteProductsWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * DLL Product Seed Script
 *
 * Creates DLL-specific product categories and placeholder products.
 * Run with: npx medusa exec src/scripts/seed-dll-products.ts
 *
 * This script:
 * 1. Deletes existing demo products (T-Shirt, Sweatshirt, etc.)
 * 2. Creates "Smart Helmets" and "Accessories" categories
 * 3. Creates DLL placeholder products with realistic structure
 * 4. Sets up inventory levels
 *
 * Product data uses placeholder values — update names, descriptions,
 * prices, and images in Admin (localhost:9000/app) with real data.
 */
export default async function seedDLLProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)

  // ----- 1. Get required references -----
  logger.info("[DLL] Fetching store references...")

  const defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  })
  if (!defaultSalesChannel.length) {
    throw new Error("Default Sales Channel not found. Run the base seed first.")
  }

  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  })
  if (!shippingProfiles.length) {
    throw new Error("Default Shipping Profile not found. Run the base seed first.")
  }
  const shippingProfile = shippingProfiles[0]

  // Get stock location
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id"],
  })
  if (!stockLocations.length) {
    throw new Error("Stock location not found. Run the base seed first.")
  }
  const stockLocationId = stockLocations[0].id

  // ----- 2. Delete existing demo products -----
  logger.info("[DLL] Removing demo products...")
  const { data: existingProducts } = await query.graph({
    entity: "product",
    fields: ["id", "title"],
  })

  const demoProductTitles = [
    "Medusa T-Shirt",
    "Medusa Sweatshirt",
    "Medusa Sweatpants",
    "Medusa Shorts",
  ]

  const demoProductIds = existingProducts
    .filter((p: any) => demoProductTitles.includes(p.title))
    .map((p: any) => p.id)

  if (demoProductIds.length > 0) {
    await deleteProductsWorkflow(container).run({
      input: { ids: demoProductIds },
    })
    logger.info(`[DLL] Deleted ${demoProductIds.length} demo products.`)
  } else {
    logger.info("[DLL] No demo products found to delete.")
  }

  // ----- 3. Create DLL product categories -----
  logger.info("[DLL] Creating product categories...")

  // Check if categories already exist
  const { data: existingCategories } = await query.graph({
    entity: "product_category",
    fields: ["id", "name"],
  })

  const hasSmartHelmets = existingCategories.some(
    (c: any) => c.name === "Smart Helmets"
  )
  const hasAccessories = existingCategories.some(
    (c: any) => c.name === "Accessories"
  )

  let smartHelmetsCategory: any
  let accessoriesCategory: any

  if (hasSmartHelmets && hasAccessories) {
    smartHelmetsCategory = existingCategories.find(
      (c: any) => c.name === "Smart Helmets"
    )
    accessoriesCategory = existingCategories.find(
      (c: any) => c.name === "Accessories"
    )
    logger.info("[DLL] Categories already exist, skipping creation.")
  } else {
    const categoriesToCreate: {
      name: string
      description: string
      is_active: boolean
    }[] = []
    if (!hasSmartHelmets) {
      categoriesToCreate.push({
        name: "Smart Helmets",
        description: "DLL Smart Helmets with integrated technology for safer rides",
        is_active: true,
      })
    }
    if (!hasAccessories) {
      categoriesToCreate.push({
        name: "Accessories",
        description: "Riding accessories and gear for DLL helmet owners",
        is_active: true,
      })
    }

    if (categoriesToCreate.length > 0) {
      const { result: categoryResult } = await createProductCategoriesWorkflow(
        container
      ).run({
        input: { product_categories: categoriesToCreate },
      })

      for (const cat of categoryResult) {
        if (cat.name === "Smart Helmets") smartHelmetsCategory = cat
        if (cat.name === "Accessories") accessoriesCategory = cat
      }
    }

    // Fill in any that already existed
    if (hasSmartHelmets) {
      smartHelmetsCategory = existingCategories.find(
        (c: any) => c.name === "Smart Helmets"
      )
    }
    if (hasAccessories) {
      accessoriesCategory = existingCategories.find(
        (c: any) => c.name === "Accessories"
      )
    }

    logger.info("[DLL] Product categories created.")
  }

  // ----- 4. Create DLL products -----
  logger.info("[DLL] Creating DLL products...")

  // Check if DLL products already exist
  const { data: currentProducts } = await query.graph({
    entity: "product",
    fields: ["id", "handle"],
  })
  const existingHandles = new Set(currentProducts.map((p: any) => p.handle))

  const dllProducts = [
    // ===== Smart Helmets =====
    {
      title: "DLL Smart Helmet Pro",
      category_ids: [smartHelmetsCategory.id],
      description:
        "The flagship DLL Smart Helmet Pro features integrated Bluetooth 5.3 communication, " +
        "built-in LED turn signals, SOS crash detection, and a 20-hour battery life. " +
        "DOT & ECE certified for maximum safety.",
      handle: "dll-smart-helmet-pro",
      weight: 1200,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [],
      options: [
        {
          title: "Size",
          values: ["S", "M", "L", "XL"],
        },
        {
          title: "Color",
          values: ["Matte Black", "Gloss White", "Carbon Gray"],
        },
      ],
      variants: [
        // Matte Black variants
        { title: "S / Matte Black", sku: "DLL-PRO-S-BLK", options: { Size: "S", Color: "Matte Black" }, prices: [{ amount: 29900, currency_code: "usd" }, { amount: 27900, currency_code: "eur" }] },
        { title: "M / Matte Black", sku: "DLL-PRO-M-BLK", options: { Size: "M", Color: "Matte Black" }, prices: [{ amount: 29900, currency_code: "usd" }, { amount: 27900, currency_code: "eur" }] },
        { title: "L / Matte Black", sku: "DLL-PRO-L-BLK", options: { Size: "L", Color: "Matte Black" }, prices: [{ amount: 29900, currency_code: "usd" }, { amount: 27900, currency_code: "eur" }] },
        { title: "XL / Matte Black", sku: "DLL-PRO-XL-BLK", options: { Size: "XL", Color: "Matte Black" }, prices: [{ amount: 29900, currency_code: "usd" }, { amount: 27900, currency_code: "eur" }] },
        // Gloss White variants
        { title: "S / Gloss White", sku: "DLL-PRO-S-WHT", options: { Size: "S", Color: "Gloss White" }, prices: [{ amount: 29900, currency_code: "usd" }, { amount: 27900, currency_code: "eur" }] },
        { title: "M / Gloss White", sku: "DLL-PRO-M-WHT", options: { Size: "M", Color: "Gloss White" }, prices: [{ amount: 29900, currency_code: "usd" }, { amount: 27900, currency_code: "eur" }] },
        { title: "L / Gloss White", sku: "DLL-PRO-L-WHT", options: { Size: "L", Color: "Gloss White" }, prices: [{ amount: 29900, currency_code: "usd" }, { amount: 27900, currency_code: "eur" }] },
        { title: "XL / Gloss White", sku: "DLL-PRO-XL-WHT", options: { Size: "XL", Color: "Gloss White" }, prices: [{ amount: 29900, currency_code: "usd" }, { amount: 27900, currency_code: "eur" }] },
        // Carbon Gray variants
        { title: "S / Carbon Gray", sku: "DLL-PRO-S-GRY", options: { Size: "S", Color: "Carbon Gray" }, prices: [{ amount: 31900, currency_code: "usd" }, { amount: 29900, currency_code: "eur" }] },
        { title: "M / Carbon Gray", sku: "DLL-PRO-M-GRY", options: { Size: "M", Color: "Carbon Gray" }, prices: [{ amount: 31900, currency_code: "usd" }, { amount: 29900, currency_code: "eur" }] },
        { title: "L / Carbon Gray", sku: "DLL-PRO-L-GRY", options: { Size: "L", Color: "Carbon Gray" }, prices: [{ amount: 31900, currency_code: "usd" }, { amount: 29900, currency_code: "eur" }] },
        { title: "XL / Carbon Gray", sku: "DLL-PRO-XL-GRY", options: { Size: "XL", Color: "Carbon Gray" }, prices: [{ amount: 31900, currency_code: "usd" }, { amount: 29900, currency_code: "eur" }] },
      ],
      sales_channels: [{ id: defaultSalesChannel[0].id }],
    },
    {
      title: "DLL Smart Helmet Lite",
      category_ids: [smartHelmetsCategory.id],
      description:
        "The DLL Smart Helmet Lite offers essential smart features at an accessible price. " +
        "Includes rear LED safety lights, basic Bluetooth audio, and lightweight EPS construction. " +
        "Perfect for urban commuters.",
      handle: "dll-smart-helmet-lite",
      weight: 950,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [],
      options: [
        {
          title: "Size",
          values: ["S", "M", "L", "XL"],
        },
        {
          title: "Color",
          values: ["Matte Black", "Navy Blue"],
        },
      ],
      variants: [
        { title: "S / Matte Black", sku: "DLL-LITE-S-BLK", options: { Size: "S", Color: "Matte Black" }, prices: [{ amount: 19900, currency_code: "usd" }, { amount: 18900, currency_code: "eur" }] },
        { title: "M / Matte Black", sku: "DLL-LITE-M-BLK", options: { Size: "M", Color: "Matte Black" }, prices: [{ amount: 19900, currency_code: "usd" }, { amount: 18900, currency_code: "eur" }] },
        { title: "L / Matte Black", sku: "DLL-LITE-L-BLK", options: { Size: "L", Color: "Matte Black" }, prices: [{ amount: 19900, currency_code: "usd" }, { amount: 18900, currency_code: "eur" }] },
        { title: "XL / Matte Black", sku: "DLL-LITE-XL-BLK", options: { Size: "XL", Color: "Matte Black" }, prices: [{ amount: 19900, currency_code: "usd" }, { amount: 18900, currency_code: "eur" }] },
        { title: "S / Navy Blue", sku: "DLL-LITE-S-NVY", options: { Size: "S", Color: "Navy Blue" }, prices: [{ amount: 19900, currency_code: "usd" }, { amount: 18900, currency_code: "eur" }] },
        { title: "M / Navy Blue", sku: "DLL-LITE-M-NVY", options: { Size: "M", Color: "Navy Blue" }, prices: [{ amount: 19900, currency_code: "usd" }, { amount: 18900, currency_code: "eur" }] },
        { title: "L / Navy Blue", sku: "DLL-LITE-L-NVY", options: { Size: "L", Color: "Navy Blue" }, prices: [{ amount: 19900, currency_code: "usd" }, { amount: 18900, currency_code: "eur" }] },
        { title: "XL / Navy Blue", sku: "DLL-LITE-XL-NVY", options: { Size: "XL", Color: "Navy Blue" }, prices: [{ amount: 19900, currency_code: "usd" }, { amount: 18900, currency_code: "eur" }] },
      ],
      sales_channels: [{ id: defaultSalesChannel[0].id }],
    },
    {
      title: "DLL Smart Helmet Kids",
      category_ids: [smartHelmetsCategory.id],
      description:
        "Designed for young riders, the DLL Smart Helmet Kids features rear LED visibility lights, " +
        "enhanced side impact protection, and an adjustable fit system. " +
        "Fun colors to keep kids excited about safety.",
      handle: "dll-smart-helmet-kids",
      weight: 680,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [],
      options: [
        {
          title: "Size",
          values: ["XS", "S", "M"],
        },
        {
          title: "Color",
          values: ["Blue", "Pink", "Green"],
        },
      ],
      variants: [
        { title: "XS / Blue", sku: "DLL-KIDS-XS-BLU", options: { Size: "XS", Color: "Blue" }, prices: [{ amount: 12900, currency_code: "usd" }, { amount: 11900, currency_code: "eur" }] },
        { title: "S / Blue", sku: "DLL-KIDS-S-BLU", options: { Size: "S", Color: "Blue" }, prices: [{ amount: 12900, currency_code: "usd" }, { amount: 11900, currency_code: "eur" }] },
        { title: "M / Blue", sku: "DLL-KIDS-M-BLU", options: { Size: "M", Color: "Blue" }, prices: [{ amount: 12900, currency_code: "usd" }, { amount: 11900, currency_code: "eur" }] },
        { title: "XS / Pink", sku: "DLL-KIDS-XS-PNK", options: { Size: "XS", Color: "Pink" }, prices: [{ amount: 12900, currency_code: "usd" }, { amount: 11900, currency_code: "eur" }] },
        { title: "S / Pink", sku: "DLL-KIDS-S-PNK", options: { Size: "S", Color: "Pink" }, prices: [{ amount: 12900, currency_code: "usd" }, { amount: 11900, currency_code: "eur" }] },
        { title: "M / Pink", sku: "DLL-KIDS-M-PNK", options: { Size: "M", Color: "Pink" }, prices: [{ amount: 12900, currency_code: "usd" }, { amount: 11900, currency_code: "eur" }] },
        { title: "XS / Green", sku: "DLL-KIDS-XS-GRN", options: { Size: "XS", Color: "Green" }, prices: [{ amount: 12900, currency_code: "usd" }, { amount: 11900, currency_code: "eur" }] },
        { title: "S / Green", sku: "DLL-KIDS-S-GRN", options: { Size: "S", Color: "Green" }, prices: [{ amount: 12900, currency_code: "usd" }, { amount: 11900, currency_code: "eur" }] },
        { title: "M / Green", sku: "DLL-KIDS-M-GRN", options: { Size: "M", Color: "Green" }, prices: [{ amount: 12900, currency_code: "usd" }, { amount: 11900, currency_code: "eur" }] },
      ],
      sales_channels: [{ id: defaultSalesChannel[0].id }],
    },

    // ===== Accessories =====
    {
      title: "DLL Helmet Visor",
      category_ids: [accessoriesCategory.id],
      description:
        "Replacement visor compatible with DLL Smart Helmet Pro and Lite. " +
        "Anti-fog coated, UV400 protection, easy snap-on installation.",
      handle: "dll-helmet-visor",
      weight: 120,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [],
      options: [
        {
          title: "Tint",
          values: ["Clear", "Smoke", "Mirror"],
        },
      ],
      variants: [
        { title: "Clear", sku: "DLL-VISOR-CLR", options: { Tint: "Clear" }, prices: [{ amount: 3900, currency_code: "usd" }, { amount: 3500, currency_code: "eur" }] },
        { title: "Smoke", sku: "DLL-VISOR-SMK", options: { Tint: "Smoke" }, prices: [{ amount: 4500, currency_code: "usd" }, { amount: 3900, currency_code: "eur" }] },
        { title: "Mirror", sku: "DLL-VISOR-MIR", options: { Tint: "Mirror" }, prices: [{ amount: 4900, currency_code: "usd" }, { amount: 4500, currency_code: "eur" }] },
      ],
      sales_channels: [{ id: defaultSalesChannel[0].id }],
    },
    {
      title: "DLL Helmet Inner Padding Set",
      category_ids: [accessoriesCategory.id],
      description:
        "Washable replacement inner padding set for DLL Smart Helmets. " +
        "Moisture-wicking, antibacterial fabric for all-day comfort.",
      handle: "dll-helmet-padding",
      weight: 80,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [],
      options: [
        {
          title: "Size",
          values: ["S", "M", "L", "XL"],
        },
      ],
      variants: [
        { title: "S", sku: "DLL-PAD-S", options: { Size: "S" }, prices: [{ amount: 1900, currency_code: "usd" }, { amount: 1700, currency_code: "eur" }] },
        { title: "M", sku: "DLL-PAD-M", options: { Size: "M" }, prices: [{ amount: 1900, currency_code: "usd" }, { amount: 1700, currency_code: "eur" }] },
        { title: "L", sku: "DLL-PAD-L", options: { Size: "L" }, prices: [{ amount: 1900, currency_code: "usd" }, { amount: 1700, currency_code: "eur" }] },
        { title: "XL", sku: "DLL-PAD-XL", options: { Size: "XL" }, prices: [{ amount: 1900, currency_code: "usd" }, { amount: 1700, currency_code: "eur" }] },
      ],
      sales_channels: [{ id: defaultSalesChannel[0].id }],
    },
    {
      title: "DLL USB-C Charging Cable",
      category_ids: [accessoriesCategory.id],
      description:
        "Premium USB-C charging cable for DLL Smart Helmets. " +
        "1.5m length, braided nylon construction, fast charging support.",
      handle: "dll-charging-cable",
      weight: 50,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [],
      options: [
        {
          title: "Length",
          values: ["1m", "1.5m"],
        },
      ],
      variants: [
        { title: "1m", sku: "DLL-CABLE-1M", options: { Length: "1m" }, prices: [{ amount: 1500, currency_code: "usd" }, { amount: 1300, currency_code: "eur" }] },
        { title: "1.5m", sku: "DLL-CABLE-1.5M", options: { Length: "1.5m" }, prices: [{ amount: 1900, currency_code: "usd" }, { amount: 1700, currency_code: "eur" }] },
      ],
      sales_channels: [{ id: defaultSalesChannel[0].id }],
    },
    {
      title: "DLL Helmet Carry Bag",
      category_ids: [accessoriesCategory.id],
      description:
        "Padded carry bag designed for DLL Smart Helmets. " +
        "Water-resistant exterior, soft interior lining, adjustable shoulder strap.",
      handle: "dll-carry-bag",
      weight: 300,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      images: [],
      options: [
        {
          title: "Color",
          values: ["Black", "Gray"],
        },
      ],
      variants: [
        { title: "Black", sku: "DLL-BAG-BLK", options: { Color: "Black" }, prices: [{ amount: 3900, currency_code: "usd" }, { amount: 3500, currency_code: "eur" }] },
        { title: "Gray", sku: "DLL-BAG-GRY", options: { Color: "Gray" }, prices: [{ amount: 3900, currency_code: "usd" }, { amount: 3500, currency_code: "eur" }] },
      ],
      sales_channels: [{ id: defaultSalesChannel[0].id }],
    },
  ]

  // Filter out products that already exist
  const productsToCreate = dllProducts.filter(
    (p) => !existingHandles.has(p.handle)
  )

  if (productsToCreate.length === 0) {
    logger.info("[DLL] All DLL products already exist, skipping creation.")
  } else {
    await createProductsWorkflow(container).run({
      input: { products: productsToCreate },
    })
    logger.info(
      `[DLL] Created ${productsToCreate.length} DLL products.`
    )
  }

  // ----- 5. Set up inventory levels -----
  logger.info("[DLL] Setting up inventory levels...")

  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })

  // Get existing inventory levels to avoid duplicates
  const { data: existingLevels } = await query.graph({
    entity: "inventory_level",
    fields: ["inventory_item_id", "location_id"],
  })
  const existingLevelKeys = new Set(
    existingLevels.map(
      (l: any) => `${l.inventory_item_id}:${l.location_id}`
    )
  )

  const inventoryLevels: CreateInventoryLevelInput[] = []
  for (const item of inventoryItems) {
    const key = `${item.id}:${stockLocationId}`
    if (!existingLevelKeys.has(key)) {
      inventoryLevels.push({
        location_id: stockLocationId,
        stocked_quantity: 100,
        inventory_item_id: item.id,
      })
    }
  }

  if (inventoryLevels.length > 0) {
    await createInventoryLevelsWorkflow(container).run({
      input: { inventory_levels: inventoryLevels },
    })
    logger.info(
      `[DLL] Created ${inventoryLevels.length} inventory levels.`
    )
  } else {
    logger.info("[DLL] All inventory levels already exist.")
  }

  logger.info("[DLL] ✅ DLL product seeding complete!")
  logger.info("[DLL] Next steps:")
  logger.info("[DLL]   1. Open Admin: http://localhost:9000/app")
  logger.info("[DLL]   2. Upload product images for each product")
  logger.info("[DLL]   3. Update product descriptions with real content")
  logger.info("[DLL]   4. Adjust prices as needed")
}
