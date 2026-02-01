import { NextRequest, NextResponse } from 'next/server'
import { stripe, isStripeConfigured } from '@/lib/stripe'
import { getSubscriberSession } from '@/lib/subscription'

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 503 }
    )
  }

  try {
    const session = await getSubscriberSession()

    if (!session?.customerId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 401 }
      )
    }

    const origin = request.headers.get('origin') || 'http://localhost:3000'

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: session.customerId,
      return_url: `${origin}/account`,
    })

    return NextResponse.json({ url: portalSession.url })
  } catch (error: any) {
    console.error('Portal session error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
      { status: 500 }
    )
  }
}
