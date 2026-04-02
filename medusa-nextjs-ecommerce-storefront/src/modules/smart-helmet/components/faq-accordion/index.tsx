"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

type FaqItem = {
  question: string
  answer: string
}

type FaqAccordionProps = {
  items: FaqItem[]
}

export default function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="divide-y divide-gray-200">
      {items.map((item, index) => {
        const isOpen = openIndex === index

        return (
          <div key={item.question} className="border-b border-gray-200">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="flex w-full items-start gap-6 px-2 py-6 text-left transition-colors hover:bg-gray-50"
            >
              <span className="w-8 shrink-0 text-sm font-medium text-gray-400">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 text-lg font-medium text-gray-900">
                {item.question}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isOpen ? (
              <div className="animate-in slide-in-from-top-1 pb-6 pl-14 pr-12">
                <p className="leading-relaxed text-gray-600">{item.answer}</p>
              </div>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
