import { AlertCircle, ExternalLink, Terminal } from 'lucide-react'

interface SetupGuideProps {
  missingEnvVars: string[]
}

export function SetupGuide({ missingEnvVars }: SetupGuideProps) {
  const hasDrupalIssue = missingEnvVars.some(v =>
    v.startsWith('DRUPAL_')
  )
  const hasStripeIssue = missingEnvVars.some(v =>
    v.includes('STRIPE')
  )

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-amber-500/20 rounded-lg">
              <AlertCircle className="h-6 w-6 text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">Setup Required</h1>
          </div>

          <p className="text-gray-400 mb-6">
            Welcome to Decoupled Sub! To get started, you need to configure the following:
          </p>

          {/* Missing environment variables */}
          <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-medium text-gray-300 mb-2">
              Missing Environment Variables:
            </h3>
            <ul className="space-y-1">
              {missingEnvVars.map((envVar) => (
                <li key={envVar} className="text-amber-400 font-mono text-sm">
                  {envVar}
                </li>
              ))}
            </ul>
          </div>

          {/* Setup steps */}
          <div className="space-y-6">
            {hasDrupalIssue && (
              <div className="border-l-2 border-primary-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  1. Set up Drupal Backend
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Run the setup script to create a Drupal space:
                </p>
                <div className="bg-gray-900 rounded-lg p-3 flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-gray-500" />
                  <code className="text-primary-400 text-sm">npm run setup</code>
                </div>
              </div>
            )}

            {hasStripeIssue && (
              <div className="border-l-2 border-primary-500 pl-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  2. Configure Stripe
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  Get your Stripe API keys and add them to <code className="text-primary-400">.env.local</code>:
                </p>
                <ol className="text-gray-400 text-sm space-y-2 list-decimal list-inside mb-3">
                  <li>
                    Go to{' '}
                    <a
                      href="https://dashboard.stripe.com/apikeys"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:underline inline-flex items-center gap-1"
                    >
                      Stripe Dashboard → API Keys
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                  <li>Copy your Publishable key and Secret key</li>
                  <li>
                    Create a product in{' '}
                    <a
                      href="https://dashboard.stripe.com/products"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-400 hover:underline inline-flex items-center gap-1"
                    >
                      Stripe Products
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    {' '}and copy the Price ID
                  </li>
                </ol>
                <div className="bg-gray-900 rounded-lg p-3 text-sm font-mono text-gray-300">
                  <div>STRIPE_SECRET_KEY=sk_test_...</div>
                  <div>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...</div>
                  <div>STRIPE_PRICE_ID=price_...</div>
                </div>
              </div>
            )}

            <div className="border-l-2 border-gray-600 pl-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                3. Restart the dev server
              </h3>
              <p className="text-gray-400 text-sm">
                After updating your environment variables, restart the development server:
              </p>
              <div className="bg-gray-900 rounded-lg p-3 flex items-center gap-2 mt-3">
                <Terminal className="h-4 w-4 text-gray-500" />
                <code className="text-primary-400 text-sm">npm run dev</code>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-700">
            <p className="text-gray-500 text-sm">
              Need help?{' '}
              <a
                href="https://github.com/your-repo/decoupled-sub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:underline"
              >
                Check the README
              </a>
              {' '}or{' '}
              <a
                href="https://decoupled.io/docs"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-400 hover:underline"
              >
                view the docs
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
