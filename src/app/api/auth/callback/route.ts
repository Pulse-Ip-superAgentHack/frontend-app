import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_FITBIT_CLIENT_ID}:${process.env.FITBIT_CLIENT_SECRET}`).toString('base64')}`
      },
      body: new URLSearchParams({
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI
      })
    })

    const tokens = await tokenResponse.json()
    
    if (tokens.error || tokens.errors) {
      return NextResponse.json({ 
        error: tokens.error || tokens.errors?.[0]?.message 
      }, { status: 400 })
    }

    // Fetch all available data with the token
    const endpoints = [
      'profile.json',
      'activities/date/today.json',
      'activities/heart/date/today/1d.json',
      'sleep/date/today.json',
      'activities/steps/date/today/1d.json',
      'activities/calories/date/today/1d.json',
      'body/log/weight/date/today.json'
    ]

    const results = await Promise.all(
      endpoints.map(endpoint =>
        fetch(`https://api.fitbit.com/1/user/-/${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${tokens.access_token}`
          }
        }).then(res => res.json())
      )
    )

    // Return all data
    return NextResponse.json({
      tokens,
      profile: results[0],
      activities: results[1],
      heart: results[2],
      sleep: results[3],
      steps: results[4],
      calories: results[5],
      weight: results[6]
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 })
  }
} 