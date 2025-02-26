import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code, code_verifier, redirect_uri } = await request.json()
    
    if (!code || !code_verifier || !redirect_uri) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }
    
    // Get client secret from environment variable
    const clientId = process.env.FITBIT_CLIENT_ID || '23Q44W'
    const clientSecret = process.env.FITBIT_CLIENT_SECRET || '' // Add this to your .env file
    
    // Basic auth for Fitbit token endpoint
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
    
    // Prepare form data for Fitbit token endpoint
    const formData = new URLSearchParams()
    formData.append('client_id', clientId)
    formData.append('grant_type', 'authorization_code')
    formData.append('code', code)
    formData.append('code_verifier', code_verifier)
    formData.append('redirect_uri', redirect_uri)
    
    console.log('Token request data:', {
      clientId,
      hasClientSecret: !!clientSecret,
      code: code.substring(0, 10) + '...',
      codeVerifier: code_verifier.substring(0, 10) + '...',
      redirectUri: redirect_uri
    })
    
    // Exchange authorization code for tokens
    const tokenResponse = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    })
    
    // Log the entire response for debugging
    const responseText = await tokenResponse.text()
    console.log('Token response status:', tokenResponse.status)
    
    let tokenData
    try {
      tokenData = JSON.parse(responseText)
      console.log('Token response:', tokenData.error || 'Success')
    } catch (e) {
      console.error('Failed to parse token response:', responseText)
      return NextResponse.json({ error: 'Invalid response from Fitbit' }, { status: 500 })
    }
    
    if (!tokenResponse.ok) {
      console.error('Fitbit token error:', tokenData)
      return NextResponse.json(
        { error: tokenData.errors?.[0]?.message || tokenData.error || 'Failed to obtain access token' }, 
        { status: tokenResponse.status }
      )
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