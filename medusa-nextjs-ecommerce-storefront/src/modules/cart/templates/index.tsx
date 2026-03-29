import ItemsTemplate from "./items"
import Summary from "./summary"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import Divider from "@modules/common/components/divider"
import { HttpTypes } from "@medusajs/types"

const CartTemplate = ({
  cart,
  customer,
}: {
  cart: HttpTypes.StoreCart | null
  customer: HttpTypes.StoreCustomer | null
}) => {
  return (
    <div className="py-8 small:py-16">
      <div className="content-container" data-testid="cart-container">
        {/* Page Header */}
        <div className="mb-8 small:mb-12">
          <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
            Review your items
          </span>
          <h1 className="text-2xl small:text-3xl font-semibold text-dll-foreground mt-1">
            Shopping Cart
          </h1>
        </div>

        {cart?.items?.length ? (
          <div className="grid grid-cols-1 small:grid-cols-[1fr_380px] gap-x-12 gap-y-8">
            <div className="flex flex-col bg-white gap-y-6">
              {!customer && (
                <>
                  <SignInPrompt />
                  <Divider />
                </>
              )}
              <ItemsTemplate cart={cart} />
            </div>
            <div className="relative">
              <div className="flex flex-col gap-y-8 sticky top-32">
                {cart && cart.region && (
                  <div className="bg-dll-bg-secondary rounded-xl p-6">
                    <Summary cart={cart as any} />
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
