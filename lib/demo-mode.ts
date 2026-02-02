/**
 * Demo Mode Module
 *
 * This file contains ALL demo/mock mode functionality.
 * To remove demo mode from a real project:
 * 1. Delete this file (lib/demo-mode.ts)
 * 2. Delete the data/mock/ directory
 * 3. Delete app/components/DemoModeBanner.tsx
 * 4. Remove DemoModeBanner from app/layout.tsx
 * 5. Remove demo mode checks from app/page.tsx and API routes
 */

// Import mock data for serverless compatibility
import postsData from '@/data/mock/posts.json'

import type { Post } from './types'

/**
 * Check if demo mode is enabled via environment variable
 */
export function isDemoMode(): boolean {
  return process.env.NEXT_PUBLIC_DEMO_MODE === 'true'
}

/**
 * Get all mock posts
 */
export function getMockPosts(): Post[] {
  return postsData.posts as Post[]
}

/**
 * Get mock post by slug
 */
export function getMockPostBySlug(slug: string): Post | null {
  const posts = getMockPosts()
  return posts.find(p => p.slug === slug) || null
}

/**
 * Handle a GraphQL query with mock data
 */
export function handleMockQuery(body: string): any {
  try {
    const { query, variables } = JSON.parse(body)

    // Handle route queries for individual posts
    if (variables?.path) {
      const slug = variables.path.replace(/^\/posts\//, '')
      const post = getMockPostBySlug(slug)
      if (post) {
        return {
          data: {
            route: {
              __typename: 'RouteInternal',
              entity: {
                __typename: 'NodeArticle',
                ...post,
                path: `/posts/${post.slug}`,
                created: { timestamp: new Date(post.publishedAt).getTime() / 1000 },
                body: { processed: post.body },
                teaser: { processed: post.excerpt },
                image: post.image ? {
                  url: post.image.url,
                  alt: post.image.alt,
                  width: post.image.width,
                  height: post.image.height
                } : null
              }
            }
          }
        }
      }
    }

    // Handle article listing queries
    if (query.includes('GetAllPosts') || query.includes('nodeArticles')) {
      const posts = getMockPosts()
      return {
        data: {
          nodeArticles: {
            __typename: 'NodeArticleConnection',
            nodes: posts.map(post => ({
              __typename: 'NodeArticle',
              id: post.id,
              title: post.title,
              path: `/posts/${post.slug}`,
              created: { timestamp: new Date(post.publishedAt).getTime() / 1000 },
              teaser: { processed: post.excerpt },
              body: { processed: post.body },
              readingTime: post.readTime,
              featured: post.featured,
              image: post.image ? {
                url: post.image.url,
                alt: post.image.alt,
                width: post.image.width,
                height: post.image.height
              } : null
            }))
          }
        }
      }
    }

    return { data: {} }
  } catch (error) {
    console.error('Mock query error:', error)
    return { data: {}, errors: [{ message: 'Mock data error' }] }
  }
}
