import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { stripe, isStripeConfigured } from '@/lib/stripe'
import { createSessionCookie, getSessionCookieOptions } from '@/lib/subscription'

// GET: Check current subscription status
export async function GET() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('subscriber_session')

  if (!sessionCookie?.value) {
    return NextResponse.json({ subscribed: false })
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    return NextResponse.json({
      subscribed: session.status === 'active',
      email: session.email,
      expiresAt: session.expiresAt,
    })
  } catch {
    return NextResponse.json({ subscribed: false })
  }
}

// POST: Verify checkout session and create subscriber cookie
export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 503 }
    )
  }

  try {
    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID required' },
        { status: 400 }
      )
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer'],
    })

    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }

    const subscription = session.subscription as import('stripe').Stripe.Subscription & { current_period_end?: number }
    const customer = session.customer as import('stripe').Stripe.Customer

    // Get expiration time - fallback to 30 days from now if not available
    const expiresAt = subscription.current_period_end
      ? subscription.current_period_end * 1000
      : Date.now() + 30 * 24 * 60 * 60 * 1000

    // Create the subscriber session data
    const subscriberSession = {
      customerId: customer.id,
      email: customer.email || session.customer_email || '',
      subscriptionId: subscription.id,
      status: subscription.status,
      expiresAt,
    }

    // Set the cookie
    const cookieStore = await cookies()
    const cookieOptions = getSessionCookieOptions()
    cookieStore.set(
      cookieOptions.name,
      createSessionCookie(subscriberSession),
      cookieOptions
    )

    return NextResponse.json({
      success: true,
      subscribed: true,
      email: subscriberSession.email,
    })
  } catch (error: any) {
    console.error('Subscription verification error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to verify subscription' },
      { status: 500 }
    )
  }
}

// DELETE: Clear subscription cookie (logout)
export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete('subscriber_session')
  return NextResponse.json({ success: true })
}
