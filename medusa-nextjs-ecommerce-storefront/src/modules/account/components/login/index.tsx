import { login } from "@lib/data/customer"
import { LOGIN_VIEW } from "@modules/account/templates/login-template"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { useActionState } from "react"
import { useT } from "@lib/context/translation-context"

type Props = {
  setCurrentView: (view: LOGIN_VIEW) => void
}

const Login = ({ setCurrentView }: Props) => {
  const [message, formAction] = useActionState(login, null)
  const t = useT()

  return (
    <div
      className="max-w-sm w-full flex flex-col items-center"
      data-testid="login-page"
    >
      <h1 className="text-2xl font-semibold text-dll-foreground mb-2">
        {t("account.welcome_back")}
      </h1>
      <p className="text-center text-sm text-dll-foreground-secondary mb-8">
        {t("account.sign_in_desc")}
      </p>
      <form className="w-full" action={formAction}>
        <div className="flex flex-col w-full gap-y-3">
          <Input
            label={t("account.email")}
            name="email"
            type="email"
            title="Enter a valid email address."
            autoComplete="email"
            required
            data-testid="email-input"
          />
          <Input
            label={t("account.password")}
            name="password"
            type="password"
            autoComplete="current-password"
            required
            data-testid="password-input"
          />
        </div>
        <ErrorMessage error={message} data-testid="login-error-message" />
        <SubmitButton data-testid="sign-in-button" className="w-full mt-6 dll-btn-primary">
          {t("account.sign_in")}
        </SubmitButton>
      </form>
      <span className="text-center text-sm text-dll-foreground-secondary mt-6">
        {t("account.no_account")}{" "}
        <button
          onClick={() => setCurrentView(LOGIN_VIEW.REGISTER)}
          className="text-dll-foreground font-medium underline underline-offset-2 hover:opacity-80 transition-opacity"
          data-testid="register-button"
        >
          {t("account.join_us")}
        </button>
        .
      </span>
    </div>
  )
}

export default Login
