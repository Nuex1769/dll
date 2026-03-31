import { getT } from "@lib/util/i18n"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import DiscountCode from "@modules/checkout/components/discount-code"
import CartTotals from "@modules/common/components/cart-totals"
import Divider from "@modules/common/components/divider"

const CheckoutSummary = async ({ cart }: { cart: any }) => {
  const t = await getT()
  return (
    <div className="sticky top-32 flex flex-col-reverse small:flex-col gap-y-8 py-8 small:py-0">
      <div className="w-full bg-dll-bg-secondary rounded-xl p-6 flex flex-col">
        <Divider className="my-4 small:hidden" />
        <h2 className="text-lg font-semibold text-dll-foreground mb-4">
          {t("checkout.order_summary")}
        </h2>
        <Divider className="mb-4" />
        <CartTotals totals={cart} />
        <ItemsPreviewTemplate cart={cart} />
        <div className="mt-4">
          <DiscountCode cart={cart} />
        </div>
      </div>
    </div>
  )
}

export default CheckoutSummary
