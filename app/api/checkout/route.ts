import { NextRequest, NextResponse } from 'next/server'
import { stripe, STRIPE_PRICE_ID, isStripeConfigured } from '@/lib/stripe'

export async function POST(request: NextRequest) {
  if (!isStripeConfigured()) {
    return NextResponse.json(
      { error: 'Stripe is not configured. Please add your API keys.' },
      { status: 503 }
    )
  }

  try {
    const { email, successUrl, cancelUrl } = await request.json()

    const origin = request.headers.get('origin') || 'http://localhost:3000'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      customer_email: email || undefined,
      success_url: successUrl || `${origin}/subscribe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${origin}/pricing`,
      subscription_data: {
        metadata: {
          source: 'decoupled-sub',
        },
      },
    })

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error: any) {
    console.error('Checkout session error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
