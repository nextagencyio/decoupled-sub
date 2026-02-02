import { gql } from '@apollo/client'

export const GET_ALL_POSTS = gql`
  query GetAllPosts {
    nodeArticles(first: 50) {
      nodes {
        id
        title
        path
        created {
          time
        }
        body {
          processed
          summary
        }
        readTime
        featured
        image {
          url
          alt
          width
          height
        }
        authorName
        authorAvatar {
          url
          alt
        }
      }
    }
  }
`

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($path: String!) {
    route(path: $path) {
      ... on RouteInternal {
        entity {
          ... on NodeArticle {
            id
            title
            path
            created {
              time
            }
            body {
              processed
              summary
            }
            readTime
            featured
            image {
              url
              alt
              width
              height
            }
            authorName
            authorAvatar {
              url
              alt
            }
          }
        }
      }
    }
  }
`

export const GET_FEATURED_POSTS = gql`
  query GetFeaturedPosts {
    nodeArticles(first: 3) {
      nodes {
        id
        title
        path
        created {
          time
        }
        body {
          summary
        }
        readTime
        featured
        image {
          url
          alt
          width
          height
        }
        authorName
        authorAvatar {
          url
          alt
        }
      }
    }
  }
`

// Transform GraphQL response to our Post type
export function transformPost(node: any): import('./types').Post | null {
  if (!node) return null

  const slug = node.path?.replace(/^\/posts\//, '') || node.id

  // Handle the excerpt - use summary if available, otherwise take first paragraph of body
  let excerpt = node.body?.summary || ''
  if (!excerpt && node.body?.processed) {
    // Extract first paragraph as excerpt
    const match = node.body.processed.match(/<p>[\s\S]*?<\/p>/)
    if (match) {
      excerpt = match[0]
    }
  }

  return {
    id: node.id,
    title: node.title,
    slug,
    excerpt,
    body: node.body?.processed || '',
    publishedAt: node.created?.time || new Date().toISOString(),
    readTime: node.readTime || '5 min read',
    featured: node.featured ?? false,
    image: node.image ? {
      url: node.image.url,
      alt: node.image.alt || node.title,
      width: node.image.width || 1200,
      height: node.image.height || 630,
    } : undefined,
    author: {
      name: node.authorName || 'The Insider Team',
      avatar: node.authorAvatar ? {
        url: node.authorAvatar.url,
        alt: node.authorAvatar.alt || node.authorName,
      } : undefined,
    },
  }
}
