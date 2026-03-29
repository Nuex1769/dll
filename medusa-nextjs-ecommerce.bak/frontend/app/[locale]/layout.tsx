import { ReactNode } from "react"
import { notFound } from "next/navigation"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { Header } from "@/components/Header"
import { locales } from "@/app/i18n-config"

type Props = {
  children: ReactNode
  params: {
    locale: string
  }
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params: { locale },
}: Omit<Props, "children">) {
  const messages: any = await getMessages({ locale })

  return {
    title: {
      default: "Medusa Store",
      template: "%s | Medusa Store",
    },
    description: messages.header?.welcome || "Global ecommerce platform",
  }
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Props) {
  // 验证locale值
  if (!locales.includes(locale as never)) {
    notFound()
  }

  let messages
  try {
    messages = await getMessages({ locale })
  } catch (error) {
    notFound()
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="flex flex-col min-h-screen">
        <Header locale={locale} />
        <main className="flex-1">{children}</main>
      </div>
    </NextIntlClientProvider>
  )
}
