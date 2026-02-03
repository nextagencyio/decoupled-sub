import { headers } from 'next/headers'
import { getServerApolloClient } from '@/lib/apollo-client'
import { GET_ALL_POSTS, transformPost } from '@/lib/queries'
import { PostCard } from '../components/PostCard'
import { isDemoMode, getMockPosts } from '@/lib/demo-mode'

export default async function PostsPage() {
  let posts: any[] = []
  let error: string | null = null

  // Demo mode: use mock posts
  if (isDemoMode()) {
    posts = getMockPosts()
  } else {
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

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <header className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            All Posts
          </h1>
          <p className="text-gray-400">
            Browse all our premium articles and insights.
          </p>
        </header>

        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400">Failed to load posts: {error}</p>
          </div>
        )}

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
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
