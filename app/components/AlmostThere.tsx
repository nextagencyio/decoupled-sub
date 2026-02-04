import { CheckCircle2, Circle, CreditCard, ExternalLink } from 'lucide-react'

interface AlmostThereProps {
  missingStripeVars: string[]
}

export function AlmostThere({ missingStripeVars }: AlmostThereProps) {
  const needsSecretKey = missingStripeVars.includes('STRIPE_SECRET_KEY')
  const needsPublishableKey = missingStripeVars.includes('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
  const needsPriceId = missingStripeVars.includes('STRIPE_PRICE_ID')

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-primary-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">
            Almost There!
          </h1>
          <p className="text-gray-400">
            Drupal is connected. Just add your Stripe keys to enable subscriptions.
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          {/* Status checklist */}
          <div className="p-5 border-b border-gray-700">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-white">Drupal connected</span>
              </div>
              <div className="flex items-center gap-3">
                {!needsSecretKey && !needsPublishableKey ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500" />
                )}
                <span className={!needsSecretKey && !needsPublishableKey ? 'text-white' : 'text-gray-400'}>
                  Stripe API keys
                </span>
              </div>
              <div className="flex items-center gap-3">
                {!needsPriceId ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-500" />
                )}
                <span className={!needsPriceId ? 'text-white' : 'text-gray-400'}>
                  Stripe Price ID
                </span>
              </div>
            </div>
          </div>

          {/* Stripe instructions */}
          <div className="p-5 space-y-5">
            {(needsSecretKey || needsPublishableKey) && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 text-primary-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">
                    Get Stripe API Keys
                  </h4>
                  <p className="text-sm text-gray-400 mb-2">
                    Copy your Publishable key and Secret key from the Stripe Dashboard.
                  </p>
                  <a
                    href="https://dashboard.stripe.com/apikeys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Open Stripe API Keys
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}

            {needsPriceId && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-900/50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 text-primary-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-white mb-1">
                    Create a Stripe Product
                  </h4>
                  <p className="text-sm text-gray-400 mb-2">
                    Create a subscription product and copy the Price ID (starts with price_).
                  </p>
                  <a
                    href="https://dashboard.stripe.com/products/create"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-primary-400 hover:text-primary-300 transition-colors"
                  >
                    Create Stripe Product
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Environment variables hint */}
          <div className="p-5 bg-gray-900/50 border-t border-gray-700">
            <p className="text-sm text-gray-400 mb-3">
              Add these to your <code className="text-primary-400 bg-gray-800 px-1.5 py-0.5 rounded">.env.local</code> file:
            </p>
            <div className="bg-gray-900 rounded-lg p-3 font-mono text-sm overflow-x-auto space-y-1">
              {needsSecretKey && (
                <div className="text-gray-300">
                  <span className="text-primary-400">STRIPE_SECRET_KEY</span>=sk_test_...
                </div>
              )}
              {needsPublishableKey && (
                <div className="text-gray-300">
                  <span className="text-primary-400">NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY</span>=pk_test_...
                </div>
              )}
              {needsPriceId && (
                <div className="text-gray-300">
                  <span className="text-primary-400">STRIPE_PRICE_ID</span>=price_...
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Restart your dev server after adding the keys.
        </p>
      </div>
    </div>
  )
}
