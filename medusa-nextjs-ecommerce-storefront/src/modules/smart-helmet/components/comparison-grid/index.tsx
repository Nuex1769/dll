import ComparisonCard from "../comparison-card"
import ComparisonMatrix from "../comparison-matrix"
import { SmartHelmetDisplayItem } from "../../types"

type ComparisonGridProps = {
  items: SmartHelmetDisplayItem[]
}

export default function ComparisonGrid({ items }: ComparisonGridProps) {
  if (!items.length) {
    return null
  }

  return (
    <div className="hidden lg:block">
      <div className="grid grid-cols-4 gap-8 xl:gap-12">
        {items.map((item) => (
          <ComparisonCard key={item.id} item={item} />
        ))}
      </div>
      <ComparisonMatrix items={items} />
    </div>
  )
}
