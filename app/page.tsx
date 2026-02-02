import { headers } from 'next/headers'
import { getServerApolloClient } from '@/lib/apollo-client'
import { GET_ALL_POSTS, transformPost } from '@/lib/queries'
import { PostCard } from './components/PostCard'
import { SetupGuide } from './components/SetupGuide'
import { Sparkles } from 'lucide-react'
import Link from 'next/link'
import { isDemoMode, getMockPosts } from '@/lib/demo-mode'

// Check which env vars are missing
function getMissingEnvVars(): string[] {
  const missing: string[] = []

  if (!process.env.DRUPAL_BASE_URL) missing.push('DRUPAL_BASE_URL')
  if (!process.env.DRUPAL_CLIENT_ID) missing.push('DRUPAL_CLIENT_ID')
  if (!process.env.DRUPAL_CLIENT_SECRET) missing.push('DRUPAL_CLIENT_SECRET')
  if (!process.env.STRIPE_SECRET_KEY) missing.push('STRIPE_SECRET_KEY')
  if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) missing.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY')
  if (!process.env.STRIPE_PRICE_ID) missing.push('STRIPE_PRICE_ID')

  return missing
}

export default async function HomePage() {
  let posts: any[] = []
  let error: string | null = null
  let missingEnvVars: string[] = []

  // Demo mode: use mock posts
  if (isDemoMode()) {
    posts = getMockPosts()
  } else {
    missingEnvVars = getMissingEnvVars()

    // Show setup guide if Drupal is not configured
    if (missingEnvVars.some(v => v.startsWith('DRUPAL_'))) {
      return <SetupGuide missingEnvVars={missingEnvVars} />
    }

    const requestHeaders = await headers()
    const client = getServerApolloClient(requestHeaders)

    try {
      const { data } = await client.query({
        query: GET_ALL_POSTS,
      })

      posts = (data?.nodeArticles?.nodes || [])
        .map(transformPost)
        .filter(Boolean)
    } catch (e: any) {
      console.error('Failed to fetch posts:', e)
      error = e.message
    }
  }

  const featuredPost = posts.find(p => p.featured) || posts[0]
  const otherPosts = posts.filter(p => p !== featuredPost)

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Premium Insights,{' '}
            <span className="gradient-text">Delivered</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Subscribe for exclusive access to in-depth analysis, expert commentary,
            and insights you won&apos;t find anywhere else.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Sparkles className="h-5 w-5" />
            Start Your Subscription
          </Link>
        </div>

        {/* Stripe config warning */}
        {missingEnvVars.length > 0 && (
          <div className="mb-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <p className="text-amber-400 text-sm">
              <strong>Note:</strong> Stripe is not fully configured. Subscriptions won&apos;t work until you add:
              {' '}{missingEnvVars.join(', ')}
            </p>
          </div>
        )}

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400">Failed to load posts: {error}</p>
          </div>
        )}

        {/* Featured post */}
        {featuredPost && (
          <div className="mb-12">
            <h2 className="text-lg font-semibold text-gray-400 mb-4">Featured</h2>
            <PostCard post={featuredPost} featured />
          </div>
        )}

        {/* Recent posts grid */}
        {otherPosts.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-400 mb-4">Recent Posts</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        )}

        {posts.length === 0 && !error && (
          <div className="text-center py-12">
            <p className="text-gray-400">
              No posts yet. Import sample content with:
            </p>
            <code className="text-primary-400 text-sm mt-2 block">
              npm run setup-content
            </code>
          </div>
        )}
      </div>
    </div>
  )
}
