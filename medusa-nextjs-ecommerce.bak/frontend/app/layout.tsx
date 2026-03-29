import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Medusa Store - Global Shop",
  description: "Premium products delivered worldwide",
  keywords: ["ecommerce", "shopping", "products"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourstore.com",
    siteName: "Medusa Store",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-white">
          {/* Header will be handled by locale layout */}
          <main className="flex-1">{children}</main>

          {/* Global Footer */}
          <footer className="border-t border-gray-200 bg-gray-50 py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-4 gap-8 md:grid-cols-5">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Company</h3>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li><a href="#" className="hover:text-gray-900">About</a></li>
                    <li><a href="#" className="hover:text-gray-900">Contact</a></li>
                    <li><a href="#" className="hover:text-gray-900">Blog</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Support</h3>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li><a href="#" className="hover:text-gray-900">Help Center</a></li>
                    <li><a href="#" className="hover:text-gray-900">Contact Us</a></li>
                    <li><a href="#" className="hover:text-gray-900">FAQ</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Legal</h3>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li><a href="#" className="hover:text-gray-900">Privacy</a></li>
                    <li><a href="#" className="hover:text-gray-900">Terms</a></li>
                    <li><a href="#" className="hover:text-gray-900">Cookies</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Shop</h3>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li><a href="#" className="hover:text-gray-900">All Products</a></li>
                    <li><a href="#" className="hover:text-gray-900">Collections</a></li>
                    <li><a href="#" className="hover:text-gray-900">Sale</a></li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Follow</h3>
                  <ul className="mt-4 space-y-2 text-sm text-gray-600">
                    <li><a href="#" className="hover:text-gray-900">Twitter</a></li>
                    <li><a href="#" className="hover:text-gray-900">Facebook</a></li>
                    <li><a href="#" className="hover:text-gray-900">Instagram</a></li>
                  </ul>
                </div>
              </div>
              <div className="mt-12 border-t border-gray-200 pt-8">
                <p className="text-sm text-gray-600">
                  &copy; 2024 Medusa Store. All rights reserved.
                </p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
