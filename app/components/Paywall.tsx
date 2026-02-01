'use client'

import Link from 'next/link'
import { Lock, Sparkles } from 'lucide-react'

interface PaywallProps {
  excerpt?: string
}

export function Paywall({ excerpt }: PaywallProps) {
  return (
    <div className="relative">
      {/* Faded excerpt preview */}
      {excerpt && (
        <div className="relative">
          <div
            className="prose prose-invert max-w-none text-gray-300"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900/50 to-gray-900" />
        </div>
      )}

      {/* Paywall overlay */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 md:p-12 text-center border border-gray-700 shadow-2xl mt-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/20 mb-6">
          <Lock className="h-8 w-8 text-primary-400" />
        </div>

        <h3 className="text-2xl font-bold text-white mb-4">
          This is a premium article
        </h3>

        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          Subscribe to unlock this article and get unlimited access to all premium content,
          exclusive insights, and in-depth analysis.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Sparkles className="h-5 w-5" />
            Subscribe Now
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Browse Free Posts
          </Link>
        </div>

        <p className="text-gray-500 text-sm mt-6">
          Already a subscriber?{' '}
          <Link href="/account" className="text-primary-400 hover:text-primary-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
