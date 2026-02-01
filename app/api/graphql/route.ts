import { NextRequest, NextResponse } from 'next/server'

const DRUPAL_BASE_URL = process.env.DRUPAL_BASE_URL || ''
const DRUPAL_CLIENT_ID = process.env.DRUPAL_CLIENT_ID || ''
const DRUPAL_CLIENT_SECRET = process.env.DRUPAL_CLIENT_SECRET || ''

interface TokenResponse {
  access_token: string
  expires_in: number
  token_type: string
}

let cachedToken: { token: string; expiresAt: number } | null = null

async function getAccessToken(): Promise<string> {
  // Return cached token if still valid
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60000) {
    return cachedToken.token
  }

  const tokenUrl = `${DRUPAL_BASE_URL}/oauth/token`

  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: DRUPAL_CLIENT_ID,
      client_secret: DRUPAL_CLIENT_SECRET,
    }),
  })

  if (!response.ok) {
    throw new Error(`Failed to get access token: ${response.status}`)
  }

  const data: TokenResponse = await response.json()

  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }

  return cachedToken.token
}

export async function POST(request: NextRequest) {
  try {
    if (!DRUPAL_BASE_URL || !DRUPAL_CLIENT_ID || !DRUPAL_CLIENT_SECRET) {
      return NextResponse.json(
        { errors: [{ message: 'Drupal connection not configured' }] },
        { status: 503 }
      )
    }

    const token = await getAccessToken()
    const body = await request.json()

    const graphqlUrl = `${DRUPAL_BASE_URL}/graphql`

    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    return NextResponse.json(data)
  } catch (error) {
    console.error('GraphQL proxy error:', error)
    return NextResponse.json(
      { errors: [{ message: 'Failed to fetch from Drupal' }] },
      { status: 500 }
    )
  }
}
