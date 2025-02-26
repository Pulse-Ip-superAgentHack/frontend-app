import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (!code) {
    return NextResponse.json({ error: 'No code provided' }, { status: 400 })
  }

  try {
    console.log('Exchanging code for token...') // Debug log

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
    console.log('Token response:', tokens) // Debug log

    if (tokens.errors || tokens.error) {
      console.error('Token error:', tokens) // Debug log
      return NextResponse.json({ error: tokens.errors || tokens.error }, { status: 400 })
    }

    // Test fetching user profile data
    const profileResponse = await fetch('https://api.fitbit.com/1/user/-/profile.json', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    })

    const profileData = await profileResponse.json()
    console.log('Profile data:', profileData) // Debug log

    // Fetch activities data
    const activitiesResponse = await fetch('https://api.fitbit.com/1/user/-/activities/date/today.json', {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    })

    const activitiesData = await activitiesResponse.json()
    console.log('Activities data:', activitiesData) // Debug log

    return NextResponse.json({
      tokens,
      profile: profileData,
      activities: activitiesData
    })
  } catch (error) {
    console.error('Error in API route:', error) // Debug log
    return NextResponse.json({ 
      error: 'Failed to fetch data',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
} 