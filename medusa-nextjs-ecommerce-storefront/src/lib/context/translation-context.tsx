"use client"

import React, { createContext, useContext, useMemo } from "react"
import en from "../../i18n/locales/en.json"
import zh from "../../i18n/locales/zh.json"

type TranslationDict = Record<string, unknown>
type TranslationFn = (key: string) => string

const translations: Record<string, TranslationDict> = { en, zh }

const TranslationContext = createContext<TranslationFn>((key) => key)

/**
 * 在嵌套的对象中按点分路径查找字符串值。
 */
function resolve(dict: TranslationDict, path: string): string | undefined {
  const keys = path.split(".")
  let result: unknown = dict
  for (const k of keys) {
    if (result == null || typeof result !== "object") return undefined
    result = (result as Record<string, unknown>)[k]
  }
  return typeof result === "string" ? result : undefined
}

/**
 * 为客户端组件提供翻译函数的 Provider。
 * 接收可序列化的 locale 字符串（而非函数），在客户端内部构建翻译查找逻辑。
 *
 * @example
 * // 服务端组件 (page.tsx)
 * const locale = await resolveLocale(countryCode)
 * return <TranslationProvider locale={locale}><ClientComponent /></TranslationProvider>
 *
 * // 客户端组件
 * const t = useT()
 * return <span>{t("checkout.title")}</span>
 */
export function TranslationProvider({
  locale,
  children,
}: {
  locale: string
  children: React.ReactNode
}) {
  const t = useMemo<TranslationFn>(() => {
    return (key: string): string => {
      const dict = translations[locale] || translations["en"]
      const value = resolve(dict, key)
      if (value !== undefined) return value

      // Fallback to English
      if (locale !== "en") {
        const fallback = resolve(translations["en"], key)
        if (fallback !== undefined) return fallback
      }

      return key
    }
  }, [locale])

  return (
    <TranslationContext.Provider value={t}>
      {children}
    </TranslationContext.Provider>
  )
}

/**
 * 在客户端组件中获取翻译函数。
 * 必须在 TranslationProvider 包裹的组件树中使用。
 */
export function useT(): TranslationFn {
  return useContext(TranslationContext)
}
