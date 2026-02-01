export interface Post {
  id: string
  title: string
  slug: string
  excerpt: string
  body: string
  publishedAt: string
  readTime: string
  featured: boolean
  image?: {
    url: string
    alt: string
    width: number
    height: number
  }
  author: {
    name: string
    bio?: string
    avatar?: {
      url: string
      alt: string
    }
  }
}

export interface Author {
  id: string
  name: string
  bio: string
  avatar?: {
    url: string
    alt: string
  }
}

export interface Subscription {
  id: string
  customerId: string
  email: string
  status: 'active' | 'canceled' | 'past_due' | 'incomplete'
  currentPeriodEnd: string
}

export interface GraphQLResponse<T> {
  data?: T
  errors?: Array<{
    message: string
    locations?: Array<{ line: number; column: number }>
    path?: string[]
  }>
}
