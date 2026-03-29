import { getRequestConfig } from "next-intl/server"

type Locale = "en" | "zh" | "ja" | "de"

const locales: Locale[] = ["en", "zh", "ja", "de"]

const messages = {
  en: () => import("./locales/en.json").then((module) => module.default),
  zh: () => import("./locales/zh.json").then((module) => module.default),
  ja: () => import("./locales/ja.json").then((module) => module.default),
  de: () => import("./locales/de.json").then((module) => module.default),
}

export default getRequestConfig(async ({ locale }) => ({
  messages: await messages[locale as Locale](),
  timeZone: "UTC",
  now: new Date(),
}))

export { locales }
