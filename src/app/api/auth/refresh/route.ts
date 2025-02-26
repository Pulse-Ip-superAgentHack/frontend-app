import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { refresh_token } = await request.json()
    
    if (!refresh_token) {
      return NextResponse.json({ error: 'Missing refresh token' }, { status: 400 })
    }
    
    // Prepare form data for Fitbit token refresh endpoint
    const formData = new URLSearchParams()
    formData.append('client_id', '23Q44W') // Your client ID
    formData.append('grant_type', 'refresh_token')
    formData.append('refresh_token', refresh_token)
    
    // Exchange refresh token for new tokens
    const tokenResponse = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })
    
    const tokenData = await tokenResponse.json()
    
    if (!tokenResponse.ok) {
      console.error('Fitbit token refresh error:', tokenData)
      return NextResponse.json({ error: tokenData.errors?.[0]?.message || 'Failed to refresh token' }, { status: tokenResponse.status })
    }
    
    // Return new tokens to client
    return NextResponse.json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      scope: tokenData.scope,
      token_type: tokenData.token_type,
      user_id: tokenData.user_id
    })
  } catch (error) {
    console.error('Token refresh error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 