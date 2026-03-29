import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Support",
  description:
    "Get help with your DLL products. Find answers to FAQs, shipping info, warranty details, and contact our support team.",
}

const faqs = [
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5-7 business days. Express shipping is available for 2-3 business day delivery. Free shipping is available on orders over $150.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy on all products. Items must be unused and in original packaging. Contact our support team to initiate a return.",
  },
  {
    question: "How do I connect my helmet via Bluetooth?",
    answer:
      "Press and hold the power button for 3 seconds to enter pairing mode. The LED will flash blue. Then find 'DLL Helmet' in your phone's Bluetooth settings and tap to connect.",
  },
  {
    question: "What is the battery life of the smart helmet?",
    answer:
      "Our smart helmets provide 12+ hours of battery life with normal use. USB-C fast charging gets you from 0 to 80% in just 45 minutes.",
  },
  {
    question: "Is the helmet certified for safety?",
    answer:
      "Yes, all DLL helmets are certified to meet or exceed CPSC, EN 1078, and AS/NZS 2063 safety standards.",
  },
  {
    question: "What does the warranty cover?",
    answer:
      "DLL products come with a 2-year limited warranty covering manufacturing defects. Battery degradation beyond 80% capacity within the first year is also covered.",
  },
]

export default function SupportPage() {
  return (
    <div className="content-container py-16 small:py-24">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs tracking-[0.2em] uppercase text-dll-foreground-secondary">
          Help Center
        </span>
        <h1 className="text-3xl small:text-5xl font-bold text-dll-foreground mt-3">
          How Can We Help?
        </h1>
        <p className="mt-4 text-base text-dll-foreground-secondary">
          Find answers below or reach out to our team directly.
        </p>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto mb-16 small:mb-24">
        <h2 className="text-xl font-semibold text-dll-foreground mb-8">
          Frequently Asked Questions
        </h2>
        <div className="divide-y divide-dll-border">
          {faqs.map((faq) => (
            <div key={faq.question} className="py-6">
              <h3 className="text-sm font-semibold text-dll-foreground mb-2">
                {faq.question}
              </h3>
              <p className="text-sm text-dll-foreground-secondary leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold text-dll-foreground mb-8">
          Contact Us
        </h2>
        <div className="grid grid-cols-1 small:grid-cols-3 gap-8">
          <div className="p-6 rounded-xl border border-dll-border">
            <h3 className="text-sm font-semibold text-dll-foreground mb-2">
              Email
            </h3>
            <p className="text-sm text-dll-foreground-secondary">
              support@dll.com
            </p>
          </div>
          <div className="p-6 rounded-xl border border-dll-border">
            <h3 className="text-sm font-semibold text-dll-foreground mb-2">
              Phone
            </h3>
            <p className="text-sm text-dll-foreground-secondary">
              +1 (800) 123-4567
            </p>
          </div>
          <div className="p-6 rounded-xl border border-dll-border">
            <h3 className="text-sm font-semibold text-dll-foreground mb-2">
              Hours
            </h3>
            <p className="text-sm text-dll-foreground-secondary">
              Mon-Fri, 9am-6pm EST
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
