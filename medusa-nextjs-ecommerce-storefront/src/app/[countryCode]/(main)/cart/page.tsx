import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { TranslationProvider } from "@lib/context/translation-context"
import { resolveLocale } from "@lib/util/i18n"
import CartTemplate from "@modules/cart/templates"
import { Metadata } from "next"
import { notFound } from "next/navigation"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

export default async function Cart({
  params,
}: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await params
  const locale = await resolveLocale(countryCode)

  const cart = await retrieveCart().catch((error) => {
    console.error(error)
    return notFound()
  })

  const customer = await retrieveCustomer()

  return (
    <TranslationProvider locale={locale}>
      <CartTemplate cart={cart} customer={customer} />
    </TranslationProvider>
  )
}
