import { acceptTransferRequest } from "@lib/data/orders"
import { Heading, Text } from "@medusajs/ui"
import TransferImage from "@modules/order/components/transfer-image"
import { getT } from "@lib/util/i18n"

export default async function TransferPage({
  params,
}: {
  params: Promise<{ id: string; token: string; countryCode: string }>
}) {
  const { id, token, countryCode } = await params
  const t = await getT(countryCode)

  const { success, error } = await acceptTransferRequest(id, token)

  return (
    <div className="flex flex-col gap-y-4 items-start w-2/5 mx-auto mt-10 mb-20">
      <TransferImage />
      <div className="flex flex-col gap-y-6">
        {success && (
          <>
            <Heading level="h1" className="text-xl text-zinc-900">
              {t("orders.transfer_accepted")}
            </Heading>
            <Text className="text-zinc-600">
              {t("orders.transfer_accepted_desc").replace("{id}", id)}
            </Text>
          </>
        )}
        {!success && (
          <>
            <Text className="text-zinc-600">
              {t("orders.transfer_accept_error")}
            </Text>
            {error && (
              <Text className="text-red-500">
                {t("orders.error_message").replace("{error}", error)}
              </Text>
            )}
          </>
        )}
      </div>
    </div>
  )
}
