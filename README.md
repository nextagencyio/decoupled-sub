# Decoupled Sub

A subscription-based content platform built with Next.js, Drupal (via Decoupled.io), and Stripe. This starter demonstrates how to implement a Substack-style paywall where subscribers can read full articles.

## Features

- **Subscription Paywall**: Free users see excerpts, subscribers see full content
- **Stripe Integration**: Checkout, customer portal, and webhook handling
- **Decoupled Drupal**: Content management via Decoupled.io
- **Dark Mode UI**: Beautiful, modern interface with Tailwind CSS
- **TypeScript**: Fully typed for better developer experience

## Quick Start

### 1. Run the Setup Script

The interactive setup script will guide you through:
- Creating a Drupal space on Decoupled.io
- Configuring your Stripe API keys
- Importing sample content

```bash
npm install
npm run setup
```

### 2. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your site.

## Stripe Configuration

### Getting Your API Keys

1. **Create a Stripe Account**: Go to [stripe.com](https://stripe.com) and sign up (or log in)

2. **Get API Keys**:
   - Go to [Developers → API keys](https://dashboard.stripe.com/apikeys)
   - Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
   - Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)

3. **Create a Product**:
   - Go to [Products](https://dashboard.stripe.com/products)
   - Click "Add product"
   - Set a name (e.g., "Premium Subscription")
   - Add a recurring price (e.g., $9/month)
   - After creating, copy the **Price ID** (starts with `price_`)

4. **Add to Environment**:
   Add these to your `.env.local` file:
   ```
   STRIPE_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_PRICE_ID=price_...
   ```

### Testing Webhooks Locally

Stripe webhooks notify your app when subscription events occur (new subscription, cancellation, payment failed, etc.).

1. **Install Stripe CLI**:
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. **Login to Stripe**:
   ```bash
   stripe login
   ```

3. **Forward webhooks to localhost**:
   ```bash
   npm run stripe:listen
   ```
   This will output a webhook signing secret - add it to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. **Test a checkout**: Visit `/pricing` and click Subscribe. Use Stripe's test card: `4242 4242 4242 4242`

### Production Webhooks

For production, create a webhook endpoint in your Stripe Dashboard:

1. Go to [Developers → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. URL: `https://your-domain.com/api/webhooks/stripe`
4. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Copy the signing secret to your production environment

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DRUPAL_BASE_URL` | Your Drupal space URL | Yes |
| `DRUPAL_CLIENT_ID` | OAuth client ID | Yes |
| `DRUPAL_CLIENT_SECRET` | OAuth client secret | Yes |
| `STRIPE_SECRET_KEY` | Stripe secret key | Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key | Yes |
| `STRIPE_PRICE_ID` | Price ID for subscription | Yes |
| `STRIPE_WEBHOOK_SECRET` | Webhook signing secret | For webhooks |
| `NEXT_PUBLIC_SITE_URL` | Your site URL | Optional |

## Project Structure

```
decoupled-sub/
├── app/
│   ├── api/
│   │   ├── checkout/          # Create Stripe checkout session
│   │   ├── graphql/           # Drupal GraphQL proxy
│   │   ├── portal/            # Stripe customer portal
│   │   ├── subscription/      # Check/verify subscription
│   │   └── webhooks/stripe/   # Stripe webhook handler
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Paywall.tsx        # Subscription paywall
│   │   ├── PostCard.tsx
│   │   └── PricingCard.tsx
│   ├── posts/[slug]/          # Individual post pages
│   ├── pricing/               # Pricing page
│   ├── account/               # Account management
│   └── subscribe/success/     # Post-checkout success
├── lib/
│   ├── apollo-client.ts       # GraphQL client
│   ├── queries.ts             # GraphQL queries
│   ├── stripe.ts              # Stripe client
│   ├── subscription.ts        # Subscription helpers
│   └── types.ts
├── data/
│   └── subscription-content.json  # Sample content
└── scripts/
    └── setup.ts               # Interactive setup
```

## How the Paywall Works

1. **Cookie-based Session**: After successful checkout, a `subscriber_session` cookie stores the customer ID and subscription status

2. **Server-side Check**: The post page uses `hasActiveSubscription()` to check if the user has access

3. **Conditional Rendering**:
   - Subscribers see the full article body
   - Non-subscribers see the excerpt and a paywall component

4. **Stripe Verification**: The cookie is created after verifying the Stripe checkout session, ensuring valid subscriptions

## Customization

### Changing the Price

Update `STRIPE_PRICE_ID` in your environment. You can create multiple prices in Stripe for different tiers.

### Adding More Content Types

Edit `data/subscription-content.json` to add new content types and fields, then import:
```bash
npm run setup-content
```

### Styling

The project uses Tailwind CSS with a purple/violet primary color theme. Edit `tailwind.config.js` to customize colors.

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run setup` | Interactive setup wizard |
| `npm run setup-content` | Import sample content |
| `npm run stripe:listen` | Forward Stripe webhooks locally |

## Deployment

### Vercel

1. Push to GitHub
2. Import in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Make sure to:
- Use **live** Stripe keys (not test keys)
- Set up production webhook endpoint
- Update `NEXT_PUBLIC_SITE_URL` to your domain

## Support

- [Decoupled.io Documentation](https://decoupled.io/docs)
- [Stripe Documentation](https://stripe.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## License

MIT
