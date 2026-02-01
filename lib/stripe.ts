import Stripe from 'stripe'

// Only initialize Stripe if API key is provided
const stripeSecretKey = process.env.STRIPE_SECRET_KEY

if (!stripeSecretKey) {
  console.warn('Warning: STRIPE_SECRET_KEY is not set. Stripe features will not work.')
}

// Create a lazy-initialized Stripe instance
let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeSecretKey) {
    throw new Error('Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment.')
  }
  if (!_stripe) {
    _stripe = new Stripe(stripeSecretKey)
  }
  return _stripe
}

// For backwards compatibility - will throw if Stripe is not configured
export const stripe = stripeSecretKey ? new Stripe(stripeSecretKey) : (null as unknown as Stripe)

export const STRIPE_PRICE_ID = process.env.STRIPE_PRICE_ID || ''

export function getStripePublishableKey(): string {
  return process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''
}

// Check if Stripe is properly configured
export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
    process.env.STRIPE_PRICE_ID
  )
}
