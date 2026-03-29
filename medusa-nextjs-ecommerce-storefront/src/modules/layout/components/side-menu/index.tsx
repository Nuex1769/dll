"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { ArrowRightMini, XMark } from "@medusajs/icons"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { NAV_ITEMS } from "../nav-links"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

const SideMenuItems = [
  ...NAV_ITEMS.map((item) => ({ name: item.label, href: item.href })),
  { name: "Account", href: "/account" },
  { name: "Cart", href: "/cart" },
]

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full flex items-center transition-all ease-out duration-200 focus:outline-none text-dll-foreground"
                >
                  {/* Hamburger icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    />
                  </svg>
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] bg-black/20 backdrop-blur-sm pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-300"
                enterFrom="-translate-x-full opacity-0"
                enterTo="translate-x-0 opacity-100"
                leave="transition ease-in duration-200"
                leaveFrom="translate-x-0 opacity-100"
                leaveTo="-translate-x-full opacity-0"
              >
                <PopoverPanel className="fixed left-0 top-0 w-[85vw] max-w-sm h-screen z-[51] bg-white shadow-2xl">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full justify-between p-6 pt-8"
                  >
                    {/* Header */}
                    <div>
                      <div className="flex items-center justify-between mb-10">
                        <span className="text-xl font-bold tracking-tight text-dll-foreground">
                          DLL
                        </span>
                        <button
                          data-testid="close-menu-button"
                          onClick={close}
                          className="p-1 text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
                        >
                          <XMark className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Navigation Links */}
                      <ul className="flex flex-col gap-6">
                        {SideMenuItems.map((item) => (
                          <li key={item.name}>
                            <LocalizedClientLink
                              href={item.href}
                              className="text-2xl font-medium text-dll-foreground hover:text-dll-foreground-secondary transition-colors"
                              onClick={close}
                              data-testid={`${item.name.toLowerCase().replace(/\s+/g, "-")}-link`}
                            >
                              {item.name}
                            </LocalizedClientLink>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom: Region & Language */}
                    <div className="flex flex-col gap-y-6 border-t border-dll-border pt-6">
                      {!!locales?.length && (
                        <div
                          className="flex justify-between items-center text-dll-foreground-secondary"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                          <ArrowRightMini
                            className={clx(
                              "transition-transform duration-150",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                          />
                        </div>
                      )}
                      <div
                        className="flex justify-between items-center text-dll-foreground-secondary"
                        onMouseEnter={countryToggleState.open}
                        onMouseLeave={countryToggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                        )}
                        <ArrowRightMini
                          className={clx(
                            "transition-transform duration-150",
                            countryToggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                      <Text className="text-xs text-dll-foreground-secondary">
                        &copy; {new Date().getFullYear()} DLL. All rights reserved.
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu
