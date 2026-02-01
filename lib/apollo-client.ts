import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'

function getServerBaseUrl(): string {
  const explicitSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
  if (explicitSiteUrl) {
    return explicitSiteUrl.replace(/\/$/, '')
  }

  const vercelUrl = process.env.VERCEL_URL
  if (vercelUrl) {
    return `https://${vercelUrl}`
  }

  const port = process.env.PORT || '3000'
  const host = process.env.HOST || 'localhost'
  return `http://${host}:${port}`
}

function getGraphqlUri(): string {
  if (typeof window !== 'undefined') {
    return '/api/graphql'
  }
  return `${getServerBaseUrl()}/api/graphql`
}

let browserClient: ApolloClient<any> | null = null

export function getServerApolloClient(requestHeaders: Headers): ApolloClient<any> {
  const protocol = requestHeaders.get('x-forwarded-proto') || 'http'
  const forwardedHost = requestHeaders.get('x-forwarded-host')
  const host = forwardedHost || requestHeaders.get('host') || 'localhost:3000'
  const origin = `${protocol}://${host}`

  const httpLink = createHttpLink({
    uri: `${origin}/api/graphql`,
  })

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    }
  })

  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { errorPolicy: 'ignore' },
      query: { errorPolicy: 'all' },
    },
  })
}

const httpLink = createHttpLink({
  uri: getGraphqlUri(),
})

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    }
  }
})

const client = typeof window !== 'undefined'
  ? (browserClient || (browserClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { errorPolicy: 'ignore' },
      query: { errorPolicy: 'all' },
    },
  })))
  : new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: { errorPolicy: 'ignore' },
      query: { errorPolicy: 'all' },
    },
  })

export default client
