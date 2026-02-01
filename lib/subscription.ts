import { cookies } from 'next/headers'
import { stripe, isStripeConfigured } from './stripe'

const SUBSCRIBER_COOKIE = 'subscriber_session'

export interface SubscriberSession {
  customerId: string
  email: string
  subscriptionId: string
  status: string
  expiresAt: number
}

// Check subscription status from cookie (for quick client checks)
export async function getSubscriberSession(): Promise<SubscriberSession | null> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SUBSCRIBER_COOKIE)

  if (!sessionCookie?.value) {
    return null
  }

  try {
    const session = JSON.parse(sessionCookie.value) as SubscriberSession

    // Check if session is expired (skip check if expiresAt is not set)
    if (session.expiresAt && session.expiresAt < Date.now()) {
      return null
    }

    return session
  } catch {
    return null
  }
}

// Verify subscription is still active with Stripe
export async function verifySubscription(customerId: string): Promise<boolean> {
  if (!isStripeConfigured() || !stripe) {
    return false
  }

  try {
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    })

    return subscriptions.data.length > 0
  } catch (error) {
    console.error('Error verifying subscription:', error)
    return false
  }
}

// Check if current user has active subscription
export async function hasActiveSubscription(): Promise<boolean> {
  const session = await getSubscriberSession()

  if (!session) {
    return false
  }

  // For demo purposes, trust the cookie if status is active
  // In production, you might want to verify with Stripe periodically
  if (session.status === 'active') {
    return true
  }

  // Verify with Stripe if status is unclear
  return verifySubscription(session.customerId)
}

// Create a subscriber session cookie after successful checkout
export function createSessionCookie(data: SubscriberSession): string {
  return JSON.stringify(data)
}

// Get cookie options for setting the subscriber session
export function getSessionCookieOptions() {
  return {
    name: SUBSCRIBER_COOKIE,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  }
}
