'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Newspaper, User, Menu, X } from 'lucide-react'

export function Header() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    // Check subscription status
    fetch('/api/subscription')
      .then((res) => res.json())
      .then((data) => setIsSubscribed(data.subscribed))
      .catch(() => setIsSubscribed(false))
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <Newspaper className="h-6 w-6 text-primary-500" />
            <span>The Insider</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Posts
            </Link>
            <Link
              href="/pricing"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            {isSubscribed ? (
              <Link
                href="/account"
                className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
              >
                <User className="h-4 w-4" />
                Account
              </Link>
            ) : (
              <Link
                href="/pricing"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Subscribe
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Posts
              </Link>
              <Link
                href="/pricing"
                className="text-gray-300 hover:text-white transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              {isSubscribed ? (
                <Link
                  href="/account"
                  className="flex items-center gap-2 text-primary-400 hover:text-primary-300 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Account
                </Link>
              ) : (
                <Link
                  href="/pricing"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Subscribe
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
