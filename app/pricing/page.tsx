'use client'

import { useState } from 'react'
import { PricingCard } from '../components/PricingCard'
import { Toast } from '../components/Toast'
import { Shield, Zap, Heart } from 'lucide-react'

const isDemoMode = () => process.env.NEXT_PUBLIC_DEMO_MODE === 'true'

export default function PricingPage() {
  const [showToast, setShowToast] = useState(false)

  const handleSubscribe = async () => {
    // In demo mode, show a toast instead of attempting checkout
    if (isDemoMode()) {
      setShowToast(true)
      return
    }

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned')
        alert('Failed to start checkout. Please check your Stripe configuration.')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert('Failed to start checkout. Please try again.')
    }
  }

  return (
    <div className="py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Get unlimited access to all premium content with a single subscription.
            Cancel anytime.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
          <PricingCard
            name="Free"
            price="$0"
            period="forever"
            description="Browse and read excerpts"
            features={[
              'Access to all post previews',
              'Read article excerpts',
              'Browse the full archive',
            ]}
            ctaText="Current Plan"
          />

          <PricingCard
            name="Premium"
            price="$9"
            period="month"
            description="Full access to everything"
            features={[
              'Unlimited full article access',
              'Exclusive premium content',
              'Early access to new posts',
              'Cancel anytime',
            ]}
            highlighted
            onSubscribe={handleSubscribe}
          />
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-500/20 mb-4">
              <Shield className="h-6 w-6 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Secure Payments</h3>
            <p className="text-gray-400 text-sm">
              All transactions are processed securely through Stripe.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-500/20 mb-4">
              <Zap className="h-6 w-6 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Instant Access</h3>
            <p className="text-gray-400 text-sm">
              Start reading premium content immediately after subscribing.
            </p>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-500/20 mb-4">
              <Heart className="h-6 w-6 text-primary-400" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Cancel Anytime</h3>
            <p className="text-gray-400 text-sm">
              No contracts, no commitments. Cancel your subscription at any time.
            </p>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                How do I access premium content?
              </h3>
              <p className="text-gray-400">
                After subscribing, you&apos;ll have immediate access to all premium articles.
                Simply visit any post and you&apos;ll see the full content instead of the paywall.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Can I cancel my subscription?
              </h3>
              <p className="text-gray-400">
                Yes! You can cancel anytime from your account page. You&apos;ll continue to have
                access until the end of your billing period.
              </p>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-400">
                We accept all major credit cards through Stripe, including Visa, Mastercard,
                American Express, and more.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Toast
        message="Checkout is disabled in demo mode. Connect Stripe to enable subscriptions."
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  )
}
