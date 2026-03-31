import { retrieveCustomer } from "@lib/data/customer"
import { Toaster } from "@medusajs/ui"
import AccountLayout from "@modules/account/templates/account-layout"
import { resolveLocale } from "@lib/util/i18n"
import { TranslationProvider } from "@lib/context/translation-context"

export default async function AccountPageLayout(props: {
  dashboard?: React.ReactNode
  login?: React.ReactNode
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const customer = await retrieveCustomer().catch(() => null)
  const locale = await resolveLocale(countryCode)

  return (
    <TranslationProvider locale={locale}>
      <AccountLayout customer={customer}>
        {customer ? props.dashboard : props.login}
        <Toaster />
      </AccountLayout>
    </TranslationProvider>
  )
}
