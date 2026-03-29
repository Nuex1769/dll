import React from "react"

import UnderlineLink from "@modules/common/components/interactive-link"

import AccountNav from "../components/account-nav"
import { HttpTypes } from "@medusajs/types"

interface AccountLayoutProps {
  customer: HttpTypes.StoreCustomer | null
  children: React.ReactNode
}

const AccountLayout: React.FC<AccountLayoutProps> = ({
  customer,
  children,
}) => {
  return (
    <div className="flex-1 py-8 small:py-16" data-testid="account-page">
      <div className="flex-1 content-container h-full max-w-5xl mx-auto bg-white flex flex-col">
        <div className="mb-8">
          <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
            Your Account
          </span>
          <h1 className="text-2xl small:text-3xl font-semibold text-dll-foreground mt-1">
            My Account
          </h1>
        </div>
        <div className="grid grid-cols-1 small:grid-cols-[240px_1fr] gap-8">
          <div>{customer && <AccountNav customer={customer} />}</div>
          <div className="flex-1">{children}</div>
        </div>
        <div className="flex flex-col small:flex-row items-end justify-between border-t border-dll-border py-12 mt-12 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-dll-foreground mb-2">
              Got questions?
            </h3>
            <span className="text-sm text-dll-foreground-secondary">
              You can find frequently asked questions and answers on our
              customer service page.
            </span>
          </div>
          <div>
            <UnderlineLink href="/customer-service">
              Customer Service
            </UnderlineLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountLayout
