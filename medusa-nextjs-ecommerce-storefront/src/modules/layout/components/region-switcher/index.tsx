"use client"

import { Fragment, useEffect, useMemo, useState, useTransition } from "react"
import { useParams, usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import ReactCountryFlag from "react-country-flag"
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"

import { updateRegion } from "@lib/data/cart"
import { updateLocale } from "@lib/data/locale-actions"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"
import { useT } from "@lib/context/translation-context"

// ─── Country / Region Switcher ──────────────────────────────────────
type CountryOption = {
  country: string
  region: string
  label: string
}

function CountrySwitcher({ regions }: { regions: HttpTypes.StoreRegion[] }) {
  const t = useT()
  const { countryCode } = useParams()
  const currentPath = usePathname().split(`/${countryCode}`)[1]
  const [current, setCurrent] = useState<CountryOption | undefined>(undefined)

  const options = useMemo(() => {
    return regions
      ?.flatMap((r) =>
        r.countries?.map((c) => ({
          country: c.iso_2,
          region: r.id,
          label: c.display_name,
        })) ?? []
      )
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [regions])

  useEffect(() => {
    if (countryCode) {
      const option = options?.find((o) => o.country === countryCode)
      setCurrent(option)
    }
  }, [options, countryCode])

  const handleChange = (option: CountryOption) => {
    updateRegion(option.country, currentPath)
  }

  return (
    <Listbox as="div" className="relative" onChange={handleChange}>
      <ListboxButton className="flex items-center gap-x-1.5 text-xs text-dll-foreground-secondary hover:text-dll-foreground transition-colors cursor-pointer">
        {current?.country && (
          // @ts-ignore
          <ReactCountryFlag
            svg
            style={{ width: "14px", height: "14px" }}
            countryCode={current.country}
          />
        )}
        <span>{current?.label ?? t("common.select_region")}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </ListboxButton>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ListboxOptions className="absolute bottom-full mb-2 left-0 max-h-60 w-52 overflow-y-auto rounded-lg bg-white shadow-lg ring-1 ring-black/5 text-xs z-50 no-scrollbar">
          {options?.map((o) => (
            <ListboxOption
              key={o.country}
              value={o}
              className="flex items-center gap-x-2 px-3 py-2 cursor-pointer hover:bg-dll-bg-secondary transition-colors data-[selected]:font-medium data-[selected]:text-dll-foreground"
            >
              {/* @ts-ignore */}
              <ReactCountryFlag
                svg
                style={{ width: "14px", height: "14px" }}
                countryCode={o.country}
              />
              {o.label}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Transition>
    </Listbox>
  )
}

// ─── Language Switcher ──────────────────────────────────────────────
type LanguageOption = {
  code: string
  name: string
  localizedName: string
  countryCode: string
}

const getCountryCodeFromLocale = (localeCode: string): string => {
  try {
    const locale = new Intl.Locale(localeCode)
    if (locale.region) return locale.region.toUpperCase()
    const maximized = locale.maximize()
    return maximized.region?.toUpperCase() ?? localeCode.toUpperCase()
  } catch {
    const parts = localeCode.split(/[-_]/)
    return parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase()
  }
}

const getLocalizedLanguageName = (
  code: string,
  fallback: string,
  displayLocale = "en-US"
): string => {
  try {
    return new Intl.DisplayNames([displayLocale], { type: "language" }).of(code) ?? fallback
  } catch {
    return fallback
  }
}

// Default language option - name/localizedName will be replaced at runtime via t()
const DEFAULT_LANG: LanguageOption = {
  code: "",
  name: "Default",
  localizedName: "Default",
  countryCode: "",
}

function LanguageSwitcher({
  locales,
  currentLocale,
}: {
  locales: Locale[]
  currentLocale: string | null
}) {
  const t = useT()
  const [current, setCurrent] = useState<LanguageOption | undefined>(undefined)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const options = useMemo(() => {
    const mapped = (locales ?? []).map((l) => ({
      code: l.code,
      name: l.name,
      localizedName: getLocalizedLanguageName(l.code, l.name, currentLocale ?? "en-US"),
      countryCode: getCountryCodeFromLocale(l.code),
    }))
    return [DEFAULT_LANG, ...mapped]
  }, [locales, currentLocale])

  useEffect(() => {
    if (currentLocale) {
      const option = options.find(
        (o) => o.code.toLowerCase() === currentLocale.toLowerCase()
      )
      setCurrent(option ?? DEFAULT_LANG)
    } else {
      setCurrent(DEFAULT_LANG)
    }
  }, [options, currentLocale])

  const handleChange = (option: LanguageOption) => {
    startTransition(async () => {
      await updateLocale(option.code)
      router.refresh()
    })
  }

  return (
    <Listbox as="div" className="relative" onChange={handleChange} disabled={isPending}>
      <ListboxButton className="flex items-center gap-x-1.5 text-xs text-dll-foreground-secondary hover:text-dll-foreground transition-colors cursor-pointer">
        {/* Globe icon */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3.5 h-3.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
        </svg>
        <span>{isPending ? "..." : current?.localizedName ?? t("common.language")}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </ListboxButton>
      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <ListboxOptions className="absolute bottom-full mb-2 left-0 max-h-60 w-48 overflow-y-auto rounded-lg bg-white shadow-lg ring-1 ring-black/5 text-xs z-50 no-scrollbar">
          {options.map((o) => (
            <ListboxOption
              key={o.code || "default"}
              value={o}
              className="flex items-center gap-x-2 px-3 py-2 cursor-pointer hover:bg-dll-bg-secondary transition-colors data-[selected]:font-medium data-[selected]:text-dll-foreground"
            >
              {o.countryCode ? (
                // @ts-ignore
                <ReactCountryFlag
                  svg
                  style={{ width: "14px", height: "14px" }}
                  countryCode={o.countryCode}
                />
              ) : (
                <span className="w-3.5 h-3.5" />
              )}
              {o.localizedName}
            </ListboxOption>
          ))}
        </ListboxOptions>
      </Transition>
    </Listbox>
  )
}

// ─── Combined Region Switcher ───────────────────────────────────────
type RegionSwitcherProps = {
  regions: HttpTypes.StoreRegion[]
  locales: Locale[]
  currentLocale: string | null
}

export default function RegionSwitcher({
  regions,
  locales,
  currentLocale,
}: RegionSwitcherProps) {
  return (
    <div className="flex items-center gap-x-4 divide-x divide-dll-border">
      <CountrySwitcher regions={regions} />
      {(locales ?? []).length > 0 && (
        <div className="pl-4">
          <LanguageSwitcher locales={locales} currentLocale={currentLocale} />
        </div>
      )}
    </div>
  )
}
