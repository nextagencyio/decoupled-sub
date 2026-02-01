import Link from 'next/link'
import { Newspaper } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <Newspaper className="h-6 w-6 text-primary-500" />
              <span>The Insider</span>
            </Link>
            <p className="text-gray-400 max-w-md">
              Premium insights and analysis delivered to your inbox. Subscribe for exclusive access
              to in-depth articles and expert commentary.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                  All Posts
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/account" className="text-gray-400 hover:text-white transition-colors">
                  Account
                </Link>
              </li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="text-white font-semibold mb-4">Subscribe</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get unlimited access to all premium content.
            </p>
            <Link
              href="/pricing"
              className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              View Plans
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} The Insider. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm">
            Powered by{' '}
            <a
              href="https://decoupled.io"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300"
            >
              Decoupled.io
            </a>
            {' '}+{' '}
            <a
              href="https://stripe.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-400 hover:text-primary-300"
            >
              Stripe
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
