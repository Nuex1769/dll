"use client"

import { useActionState } from "react"
import Input from "@modules/common/components/input"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signup } from "@lib/data/customer"
import { useT } from "@lib/context/translation-context"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Register = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(signup, null)
  const t = useT()

  return (
    <div
      className="max-w-sm flex flex-col items-center"
      data-testid="register-page"
    >
      <h1 className="text-large-semi uppercase mb-6">
        {t("account.become_member")}
      </h1>
      <p className="text-center text-base-regular text-ui-fg-base mb-4">
        {t("account.become_member_desc")}
      </p>
      <form className="w-full flex flex-col" action={formAction}>
        <div className="flex flex-col w-full gap-y-2">
          <Input
            label={t("account.first_name")}
            name="first_name"
            required
            autoComplete="given-name"
            data-testid="first-name-input"
          />
          <Input
            label={t("account.last_name")}
            name="last_name"
            required
            autoComplete="family-name"
            data-testid="last-name-input"
          />
          <Input
            label={t("account.email")}
            name="email"
            required
            type="email"
            autoComplete="email"
            data-testid="email-input"
          />
          <Input
            label={t("account.phone")}
            name="phone"
            type="tel"
            autoComplete="tel"
            data-testid="phone-input"
          />
          <Input
            label={t("account.password")}
            name="password"
            required
            type="password"
            autoComplete="new-password"
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="register-error" />
        <span className="text-center text-ui-fg-base text-small-regular mt-6">
          {t("account.agree_terms")
            .split("{privacy}")
            .map((part, i) =>
              i === 0 ? part : (
                <span key="privacy">
                  <LocalizedClientLink
                    href="/content/privacy-policy"
                    className="underline"
                  >
                    {t("account.privacy_policy")}
                  </LocalizedClientLink>
                  {part}
                </span>
              )
            )
            .flatMap((part) =>
              typeof part === "string"
                ? part.split("{terms}").map((subPart, j) =>
                    j === 0 ? subPart : (
                      <span key="terms">
                        <LocalizedClientLink
                          href="/content/terms-of-use"
                          className="underline"
                        >
                          {t("account.terms_of_use")}
                        </LocalizedClientLink>
                        {subPart}
                      </span>
                    )
                  )
                : [part]
            )}
        </span>
        <SubmitButton className="w-full mt-6" data-testid="register-button">
          {t("account.join")}
        </SubmitButton>
      </form>
      <span className="text-center text-ui-fg-base text-small-regular mt-6">
        {t("account.already_member")}{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.SIGN_IN)}
          className="underline"
        >
          {t("account.sign_in")}
        </button>
        .
      </span>
    </div>
  )
}

export default Register
