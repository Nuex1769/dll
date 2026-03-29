import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4">
        {product.collection && (
          <LocalizedClientLink
            href={`/collections/${product.collection.handle}`}
            className="text-xs tracking-[0.15em] uppercase text-dll-foreground-secondary hover:text-dll-foreground transition-colors"
          >
            {product.collection.title}
          </LocalizedClientLink>
        )}
        <h1
          className="text-2xl small:text-3xl font-semibold text-dll-foreground leading-tight"
          data-testid="product-title"
        >
          {product.title}
        </h1>

        <p
          className="text-sm text-dll-foreground-secondary leading-relaxed whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </p>
      </div>
    </div>
  )
}

export default ProductInfo
