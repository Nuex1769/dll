import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
} from "@medusajs/framework/utils"
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import {
  createRegionsWorkflow,
  createShippingOptionsWorkflow,
  createTaxRegionsWorkflow,
  updateStoresStep,
} from "@medusajs/medusa/core-flows"

/**
 * Seed China Region + CNY Currency + US Region + USD
 *
 * Run with: npx medusa exec src/scripts/seed-china-region.ts
 *
 * This script:
 * 1. Adds CNY and USD to supported store currencies (keeps EUR as default)
 * 2. Creates "China" region (CNY, country: cn)
 * 3. Creates "North America" region (USD, countries: us, ca, au)
 * 4. Creates tax regions for new countries
 * 5. Creates fulfillment zones + shipping options for new regions
 */

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies-v2",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[]
    store_id: string
  }) => {
    const normalizedInput = transform({ input }, (data) => ({
      selector: { id: data.input.store_id },
      update: {
        supported_currencies: data.input.supported_currencies.map(
          (currency) => ({
            currency_code: currency.currency_code,
            is_default: currency.is_default ?? false,
          })
        ),
      },
    }))

    const stores = updateStoresStep(normalizedInput)
    return new WorkflowResponse(stores)
  }
)

export default async function seedChinaRegion({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const storeModuleService = container.resolve(Modules.STORE)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)

  // ─── 1. Add CNY + USD to supported currencies ───────────────────
  logger.info("Adding CNY and USD to supported currencies...")
  const [store] = await storeModuleService.listStores()

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        { currency_code: "eur", is_default: true },
        { currency_code: "usd" },
        { currency_code: "cny" },
      ],
    },
  })
  logger.info("Currencies updated: EUR (default), USD, CNY")

  // ─── 2. Create China + North America regions ────────────────────
  logger.info("Creating China and North America regions...")

  // Check if regions already exist
  const regionModule = container.resolve(Modules.REGION)
  const existingRegions = await regionModule.listRegions()
  const existingNames = existingRegions.map((r: any) => r.name)

  const regionsToCreate: {
    name: string
    currency_code: string
    countries: string[]
    payment_providers: string[]
  }[] = []

  if (!existingNames.includes("China")) {
    regionsToCreate.push({
      name: "China",
      currency_code: "cny",
      countries: ["cn"],
      payment_providers: ["pp_system_default"],
    })
  } else {
    logger.info("China region already exists, skipping.")
  }

  if (!existingNames.includes("North America")) {
    regionsToCreate.push({
      name: "North America",
      currency_code: "usd",
      countries: ["us", "ca", "au"],
      payment_providers: ["pp_system_default"],
    })
  } else {
    logger.info("North America region already exists, skipping.")
  }

  let chinaRegion: any = existingRegions.find((r: any) => r.name === "China")
  let naRegion: any = existingRegions.find((r: any) => r.name === "North America")

  if (regionsToCreate.length > 0) {
    const { result: regionResult } = await createRegionsWorkflow(container).run({
      input: { regions: regionsToCreate },
    })

    for (const r of regionResult) {
      if (r.name === "China") chinaRegion = r
      if (r.name === "North America") naRegion = r
    }
  }
  logger.info("Regions ready.")

  // ─── 3. Create tax regions ──────────────────────────────────────
  logger.info("Creating tax regions...")
  const newCountries = ["cn", "us", "ca", "au"]

  try {
    await createTaxRegionsWorkflow(container).run({
      input: newCountries.map((country_code) => ({
        country_code,
        provider_id: "tp_system",
      })),
    })
    logger.info("Tax regions created for: " + newCountries.join(", "))
  } catch (err: any) {
    // Tax regions may already exist
    logger.warn("Tax region creation (some may already exist): " + err.message)
  }

  // ─── 4. Create fulfillment sets for new regions ─────────────────
  logger.info("Setting up fulfillment for new regions...")

  // Find existing stock location
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "name"],
  })
  const stockLocation = stockLocations[0]

  if (!stockLocation) {
    logger.error("No stock location found! Run the main seed first.")
    return
  }

  // Find existing shipping profile
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  })
  const shippingProfile = shippingProfiles[0]

  if (!shippingProfile) {
    logger.error("No shipping profile found! Run the main seed first.")
    return
  }

  // Create fulfillment set for China
  const chinaFulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "China Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "China",
        geo_zones: [{ country_code: "cn", type: "country" }],
      },
    ],
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: chinaFulfillmentSet.id },
  })

  // Create fulfillment set for North America
  const naFulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "North America Warehouse delivery",
    type: "shipping",
    service_zones: [
      {
        name: "North America",
        geo_zones: [
          { country_code: "us", type: "country" },
          { country_code: "ca", type: "country" },
          { country_code: "au", type: "country" },
        ],
      },
    ],
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: naFulfillmentSet.id },
  })

  // ─── 5. Create shipping options ─────────────────────────────────
  logger.info("Creating shipping options...")

  await createShippingOptionsWorkflow(container).run({
    input: [
      // China - Standard
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: chinaFulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 3-5 days.",
          code: "standard",
        },
        prices: [
          { currency_code: "cny", amount: 1500 },
          ...(chinaRegion ? [{ region_id: chinaRegion.id, amount: 1500 }] : []),
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
      // China - Express
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: chinaFulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          { currency_code: "cny", amount: 3000 },
          ...(chinaRegion ? [{ region_id: chinaRegion.id, amount: 3000 }] : []),
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
      // North America - Standard
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: naFulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Ship in 3-5 days.",
          code: "standard",
        },
        prices: [
          { currency_code: "usd", amount: 1000 },
          ...(naRegion ? [{ region_id: naRegion.id, amount: 1000 }] : []),
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
      // North America - Express
      {
        name: "Express Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: naFulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Ship in 24 hours.",
          code: "express",
        },
        prices: [
          { currency_code: "usd", amount: 2000 },
          ...(naRegion ? [{ region_id: naRegion.id, amount: 2000 }] : []),
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
    ],
  })

  logger.info("Shipping options created.")

  // ─── Summary ────────────────────────────────────────────────────
  logger.info("=== China Region Seed Complete ===")
  logger.info("Currencies: EUR (default), USD, CNY")
  logger.info("New regions: China (CNY), North America (USD)")
  logger.info("Shipping: Standard + Express for both regions")
  logger.info("")
  logger.info("Next steps:")
  logger.info("1. Add CNY prices to your products in Admin → Products → Edit → Pricing")
  logger.info("2. Or run a bulk price update script")
}
