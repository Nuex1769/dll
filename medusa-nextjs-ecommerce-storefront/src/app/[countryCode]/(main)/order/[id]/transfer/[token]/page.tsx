import { Heading, Text } from "@medusajs/ui"
import TransferActions from "@modules/order/components/transfer-actions"
import TransferImage from "@modules/order/components/transfer-image"
import { getT, resolveLocale } from "@lib/util/i18n"
import { TranslationProvider } from "@lib/context/translation-context"

export default async function TransferPage({
  params,
}: {
  params: Promise<{ id: string; token: string; countryCode: string }>
}) {
  const { id, token, countryCode } = await params
  const t = await getT(countryCode)
  const locale = await resolveLocale(countryCode)

  return (
    <TranslationProvider locale={locale}>
      <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
        <TransferImage />
        <div className="flex flex-col gap-y-6">
          <Heading level="h1" className="text-xl text-zinc-900">
            {t("orders.transfer_request").replace("{id}", id)}
          </Heading>
          <Text className="text-zinc-600">
            {t("orders.transfer_description")}
          </Text>
          <div className="w-full h-px bg-zinc-200" />
          <Text className="text-zinc-600">
            {t("orders.transfer_accept_consequence")}
          </Text>
          <Text className="text-zinc-600">
            {t("orders.transfer_decline_note")}
          </Text>
          <div className="w-full h-px bg-zinc-200" />
          <TransferActions id={id} token={token} />
        </div>
      </div>
    </TranslationProvider>
  )
}
