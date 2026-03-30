import en from "../../i18n/locales/en.json"
import zh from "../../i18n/locales/zh.json"
import { getLocale } from "@lib/data/locale-actions"

type TranslationDict = Record<string, unknown>

const translations: Record<string, TranslationDict> = { en, zh }

/**
 * Maps country codes to locale identifiers.
 * Used as fallback when no locale cookie is set.
 */
const COUNTRY_LOCALE_MAP: Record<string, string> = {
  us: "en",
  gb: "en",
  au: "en",
  ca: "en",
  de: "en",
  dk: "en",
  se: "en",
  fr: "en",
  es: "en",
  it: "en",
  cn: "zh",
  tw: "zh",
  hk: "zh",
}

/**
 * Resolves a locale string from a country code.
 */
export function getLocaleFromCountry(countryCode: string): string {
  return COUNTRY_LOCALE_MAP[countryCode?.toLowerCase()] || "en"
}

/**
 * Retrieves a translation value by dot-notation key.
 * Falls back to English if the key is missing in the target locale.
 * Returns the key itself if not found in any locale.
 *
 * @example t("en", "home.hero.title") // "Ride Smarter."
 */
export function t(locale: string, key: string): string {
  const resolve = (dict: TranslationDict, path: string): string | undefined => {
    const keys = path.split(".")
    let result: unknown = dict
    for (const k of keys) {
      if (result == null || typeof result !== "object") return undefined
      result = (result as Record<string, unknown>)[k]
    }
    return typeof result === "string" ? result : undefined
  }

  // Try target locale first, then fallback to English
  const dict = translations[locale] || translations["en"]
  const value = resolve(dict, key)
  if (value !== undefined) return value

  // Fallback to English
  if (locale !== "en") {
    const fallback = resolve(translations["en"], key)
    if (fallback !== undefined) return fallback
  }

  // Return the key as last resort
  return key
}

/**
 * Returns a translation function bound to the current locale.
 * Determines locale from: cookie > countryCode mapping > "en" fallback.
 *
 * Usage in server components:
 * ```ts
 * const t = await getT(countryCode)
 * t("home.hero.title") // "Ride Smarter."
 * ```
 */
export async function getT(countryCode?: string) {
  const cookieLocale = await getLocale()
  const locale =
    cookieLocale ||
    (countryCode ? getLocaleFromCountry(countryCode) : "en")

  return (key: string): string => t(locale, key)
}
