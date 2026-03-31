"use client"

import { resetOnboardingState } from "@lib/data/onboarding"
import { Button, Container, Text } from "@medusajs/ui"
import { useT } from "@lib/context/translation-context"

const OnboardingCta = ({ orderId }: { orderId: string }) => {
  const t = useT()

  return (
    <Container className="max-w-4xl h-full bg-ui-bg-subtle w-full">
      <div className="flex flex-col gap-y-4 center p-4 md:items-center">
        <Text className="text-ui-fg-base text-xl">
          {t("orders.onboarding_success")}
        </Text>
        <Text className="text-ui-fg-subtle text-small-regular">
          {t("orders.onboarding_setup")}
        </Text>
        <Button
          className="w-fit"
          size="xlarge"
          onClick={() => resetOnboardingState(orderId)}
        >
          {t("orders.onboarding_complete")}
        </Button>
      </div>
    </Container>
  )
}

export default OnboardingCta
