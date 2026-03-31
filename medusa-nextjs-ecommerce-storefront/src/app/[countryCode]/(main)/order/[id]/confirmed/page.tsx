import { retrieveOrder } from "@lib/data/orders"
import OrderCompletedTemplate from "@modules/order/templates/order-completed-template"
import { Metadata } from "next"
import { notFound } from "next/navigation"
import { resolveLocale } from "@lib/util/i18n"
import { TranslationProvider } from "@lib/context/translation-context"

type Props = {
  params: Promise<{ id: string; countryCode: string }>
}
export const metadata: Metadata = {
  title: "订单确认 | DLL",
  description: "You purchase was successful",
}

export default async function OrderConfirmedPage(props: Props) {
  const params = await props.params
  const { id, countryCode } = params
  const locale = await resolveLocale(countryCode)
  const order = await retrieveOrder(id).catch(() => null)

  if (!order) {
    return notFound()
  }

  return (
    <TranslationProvider locale={locale}>
      <OrderCompletedTemplate order={order} />
    </TranslationProvider>
  )
}
