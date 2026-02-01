'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, CreditCard, LogOut, Loader2, ExternalLink } from 'lucide-react'

interface SubscriptionData {
  subscribed: boolean
  email?: string
  expiresAt?: number
}

export default function AccountPage() {
  const router = useRouter()
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isManaging, setIsManaging] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    fetch('/api/subscription')
      .then((res) => res.json())
      .then((data) => {
        setSubscription(data)
        setIsLoading(false)
      })
      .catch(() => {
        setSubscription({ subscribed: false })
        setIsLoading(false)
      })
  }, [])

  const handleManageSubscription = async () => {
    setIsManaging(true)
    try {
      const response = await fetch('/api/portal', {
        method: 'POST',
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to open billing portal')
      }
    } catch (error) {
      console.error('Portal error:', error)
      alert('Failed to open billing portal')
    } finally {
      setIsManaging(false)
    }
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await fetch('/api/subscription', { method: 'DELETE' })
      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
      </div>
    )
  }

  if (!subscription?.subscribed) {
    return (
      <div className="py-16">
        <div className="max-w-md mx-auto px-4 sm:px-6 text-center">
          <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-700 mb-6">
              <User className="h-8 w-8 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">
              No Active Subscription
            </h1>
            <p className="text-gray-400 mb-8">
              Subscribe to access premium content and manage your account.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const expiresDate = subscription.expiresAt
    ? new Date(subscription.expiresAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null

  return (
    <div className="py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-white mb-8">Your Account</h1>

        {/* Subscription status */}
        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white mb-1">
                Premium Subscription
              </h2>
              <p className="text-gray-400 text-sm">
                {subscription.email}
              </p>
            </div>
            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-medium rounded-full">
              Active
            </span>
          </div>

          {expiresDate && (
            <p className="text-gray-400 text-sm mt-4">
              Your subscription renews on {expiresDate}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <button
            onClick={handleManageSubscription}
            disabled={isManaging}
            className="w-full flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-gray-600 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-700 rounded-lg group-hover:bg-gray-600 transition-colors">
                <CreditCard className="h-5 w-5 text-gray-300" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium">Manage Subscription</p>
                <p className="text-gray-400 text-sm">
                  Update payment method, change plan, or cancel
                </p>
              </div>
            </div>
            {isManaging ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            ) : (
              <ExternalLink className="h-5 w-5 text-gray-400" />
            )}
          </button>

          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:border-red-500/50 transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="p-2 bg-gray-700 rounded-lg group-hover:bg-red-500/20 transition-colors">
                <LogOut className="h-5 w-5 text-gray-300 group-hover:text-red-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium group-hover:text-red-400">
                  Sign Out
                </p>
                <p className="text-gray-400 text-sm">
                  Clear your subscription session
                </p>
              </div>
            </div>
            {isLoggingOut && (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            )}
          </button>
        </div>

        {/* Help text */}
        <p className="text-gray-500 text-sm text-center mt-8">
          Need help?{' '}
          <a
            href="mailto:support@example.com"
            className="text-primary-400 hover:underline"
          >
            Contact support
          </a>
        </p>
      </div>
    </div>
  )
}
