"use client"

import { Button, Heading, Text } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useT } from "@lib/context/translation-context"

const SignInPrompt = () => {
  const t = useT()

  return (
    <div className="bg-white flex items-center justify-between">
      <div>
        <Heading level="h2" className="txt-xlarge">
          {t("cart.sign_in_title")}
        </Heading>
        <Text className="txt-medium text-ui-fg-subtle mt-2">
          {t("cart.sign_in_subtitle")}
        </Text>
      </div>
      <div>
        <LocalizedClientLink href="/account">
          <Button variant="secondary" className="h-10" data-testid="sign-in-button">
            {t("cart.sign_in")}
          </Button>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default SignInPrompt
