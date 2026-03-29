"use client"

import { Fragment, useEffect, useMemo, useState, useTransition } from "react"
import { useParams, usePathname } from "next/navigation"
import { useRouter } from "next/navigation"
import ReactCountryFlag from "react-country-flag"
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/react"

import { updateRegion } from "@lib/data/cart"
import { updateLocale } from "@lib/data/locale-actions"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

type CountryOption = {
  country: string
  region: string
  label: string
}

type LanguageOption = {
  code: string
  localizedName: string
  countryCode: string
}

const getCountryCodeFromLocale = (localeCode: string): string => {
  try {
    const locale = new Intl.Locale(localeCode)
    if (locale.region) return locale.region.toUpperCase()
    return locale.maximize().region?.toUpperCase() ?? localeCode.toUpperCase()
  } catch {
    const parts = localeCode.split(/[-_]/)
    return parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase()
  }
}

type NavRegionButtonProps = {
  regions: HttpTypes.StoreRegion[]
  locales: Locale[]
  currentLocale: string | null
}

export default function NavRegionButton({
  regions,
  locales,
  currentLocale,
}: NavRegionButtonProps) {
  const { countryCode } = useParams()
  const currentPath = usePathname().split(`/${countryCode}`)[1]
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // Country options
  const countryOptions = useMemo(() => {
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

  const currentCountry = countryOptions?.find((o) => o.country === countryCode)

  // Language options
  const languageOptions = useMemo(() => {
    const defaultOpt = { code: "", localizedName: "Default", countryCode: "" }
    const mapped = (locales ?? []).map((l) => {
      let name = l.name
      try {
        name =
          new Intl.DisplayNames([currentLocale ?? "en-US"], { type: "language" }).of(l.code) ??
          l.name
      } catch {}
      return {
        code: l.code,
        localizedName: name,
        countryCode: getCountryCodeFromLocale(l.code),
      }
    })
    return [defaultOpt, ...mapped]
  }, [locales, currentLocale])

  const currentLang = currentLocale
    ? languageOptions.find((o) => o.code.toLowerCase() === currentLocale.toLowerCase()) ??
      languageOptions[0]
    : languageOptions[0]

  const handleCountryChange = (option: CountryOption) => {
    updateRegion(option.country, currentPath)
  }

  const handleLanguageChange = (option: LanguageOption) => {
    startTransition(async () => {
      await updateLocale(option.code)
      router.refresh()
    })
  }

  return (
    <Popover className="relative hidden small:flex items-center">
      <PopoverButton className="flex items-center gap-x-1 text-dll-foreground-secondary hover:text-dll-foreground transition-colors focus:outline-none cursor-pointer">
        {currentCountry?.country && (
          // @ts-ignore
          <ReactCountryFlag
            svg
            style={{ width: "16px", height: "16px" }}
            countryCode={currentCountry.country}
          />
        )}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
          <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </PopoverButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-150"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-lg ring-1 ring-black/5 z-50 overflow-hidden">
          <div className="p-4">
            {/* Country Section */}
            <div className="mb-4">
              <span className="text-[11px] font-medium uppercase tracking-wider text-dll-foreground-secondary">
                Shipping to
              </span>
              <div className="mt-2 max-h-40 overflow-y-auto -mx-1 no-scrollbar">
                {countryOptions?.map((o) => (
                  <button
                    key={o.country}
                    onClick={() => handleCountryChange(o)}
                    className={`flex items-center gap-x-2 w-full px-2 py-1.5 rounded-md text-xs transition-colors ${
                      o.country === countryCode
                        ? "bg-dll-bg-secondary font-medium text-dll-foreground"
                        : "text-dll-foreground-secondary hover:bg-dll-bg-secondary hover:text-dll-foreground"
                    }`}
                  >
                    {/* @ts-ignore */}
                    <ReactCountryFlag
                      svg
                      style={{ width: "14px", height: "14px" }}
                      countryCode={o.country}
                    />
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Language Section */}
            {(locales ?? []).length > 0 && (
              <div className="pt-3 border-t border-dll-border">
                <span className="text-[11px] font-medium uppercase tracking-wider text-dll-foreground-secondary">
                  Language
                </span>
                <div className="mt-2 max-h-40 overflow-y-auto -mx-1 no-scrollbar">
                  {languageOptions.map((o) => (
                    <button
                      key={o.code || "default"}
                      onClick={() => handleLanguageChange(o)}
                      disabled={isPending}
                      className={`flex items-center gap-x-2 w-full px-2 py-1.5 rounded-md text-xs transition-colors ${
                        (currentLocale ?? "").toLowerCase() === o.code.toLowerCase() ||
                        (!currentLocale && o.code === "")
                          ? "bg-dll-bg-secondary font-medium text-dll-foreground"
                          : "text-dll-foreground-secondary hover:bg-dll-bg-secondary hover:text-dll-foreground"
                      }`}
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
                      {isPending ? "..." : o.localizedName}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  )
}
