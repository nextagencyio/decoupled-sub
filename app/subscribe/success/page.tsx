'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'

export default function SubscribeSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      setStatus('error')
      return
    }

    // Verify the checkout session and create subscriber cookie
    fetch('/api/subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStatus('success')
          setEmail(data.email)
        } else {
          setStatus('error')
        }
      })
      .catch(() => {
        setStatus('error')
      })
  }, [searchParams])

  if (status === 'loading') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500 mx-auto mb-4" />
          <p className="text-gray-400">Confirming your subscription...</p>
        </div>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 text-center">
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/20 mb-6">
              <XCircle className="h-8 w-8 text-red-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-400 mb-8">
              We couldn&apos;t confirm your subscription. Please try again or contact support.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Again
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="max-w-md mx-auto px-4 sm:px-6 text-center">
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-6">
            <CheckCircle className="h-8 w-8 text-green-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-4">
            Welcome to Premium!
          </h1>
          <p className="text-gray-400 mb-2">
            Your subscription is now active.
          </p>
          {email && (
            <p className="text-gray-500 text-sm mb-8">
              Confirmation sent to {email}
            </p>
          )}
          <div className="space-y-4">
            <Link
              href="/"
              className="block w-full bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Start Reading
            </Link>
            <Link
              href="/account"
              className="block w-full bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Manage Subscription
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
