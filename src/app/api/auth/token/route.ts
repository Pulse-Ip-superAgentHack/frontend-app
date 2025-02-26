import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code, code_verifier, redirect_uri } = await request.json()
    
    if (!code || !code_verifier || !redirect_uri) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }
    
    // Prepare form data for Fitbit token endpoint
    const formData = new URLSearchParams()
    formData.append('client_id', '23Q44W') // Your client ID
    formData.append('grant_type', 'authorization_code')
    formData.append('code', code)
    formData.append('code_verifier', code_verifier)
    formData.append('redirect_uri', redirect_uri)
    
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })
    
    const tokenData = await tokenResponse.json()
    
    if (!tokenResponse.ok) {
      console.error('Fitbit token error:', tokenData)
      return NextResponse.json({ error: tokenData.errors?.[0]?.message || 'Failed to obtain access token' }, { status: tokenResponse.status })
    }
    
    // Return tokens to client
    return NextResponse.json({
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      expires_in: tokenData.expires_in,
      scope: tokenData.scope,
      token_type: tokenData.token_type,
      user_id: tokenData.user_id
    })
  } catch (error) {
    console.error('Token exchange error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 