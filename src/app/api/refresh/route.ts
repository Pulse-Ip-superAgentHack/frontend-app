import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { refresh_token } = await request.json()

  try {
    const response = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token
      })
    })

    const newTokens = await response.json()
    return NextResponse.json(newTokens)
  } catch (error) {
    console.error('Refresh token error:', error)
    return NextResponse.json({ error: 'Failed to refresh token' }, { status: 500 })
  }
} 