import { headers } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Clock, Calendar } from 'lucide-react'
import { getServerApolloClient } from '@/lib/apollo-client'
import { GET_POST_BY_SLUG, transformPost } from '@/lib/queries'
import { hasActiveSubscription } from '@/lib/subscription'
import { Paywall } from '@/app/components/Paywall'
import { notFound } from 'next/navigation'
import { isDemoMode, getMockPostBySlug } from '@/lib/demo-mode'

// Disable caching to ensure subscription status is checked on each request
export const dynamic = 'force-dynamic'

interface PostPageProps {
  params: Promise<{ slug: string }>
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params

  let post = null

  // Demo mode: use mock post data
  if (isDemoMode()) {
    post = getMockPostBySlug(slug)
  } else {
    const requestHeaders = await headers()
    const client = getServerApolloClient(requestHeaders)

    try {
      const { data } = await client.query({
        query: GET_POST_BY_SLUG,
        variables: { path: `/posts/${slug}` },
      })

      post = transformPost(data?.route?.entity)
    } catch (e) {
      console.error('Failed to fetch post:', e)
    }
  }

  if (!post) {
    notFound()
  }

  const isSubscribed = await hasActiveSubscription()

  const date = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <article className="py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all posts
        </Link>

        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          {post.author && (
            <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar.url}
                  alt={post.author.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="text-white font-medium">{post.author.name}</p>
                {post.author.bio && (
                  <p className="text-gray-400 text-sm line-clamp-1">
                    {post.author.bio.replace(/<[^>]*>/g, '')}
                  </p>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Featured image */}
        {post.image && (
          <div className="relative aspect-video rounded-xl overflow-hidden mb-8">
            <Image
              src={post.image.url}
              alt={post.image.alt}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Content */}
        {isSubscribed ? (
          <div
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.body }}
          />
        ) : (
          <Paywall excerpt={post.excerpt} />
        )}

        {/* Subscription CTA for subscribers */}
        {isSubscribed && (
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-center">
              Thanks for being a subscriber! ✨
            </p>
          </div>
        )}
      </div>
    </article>
  )
}
