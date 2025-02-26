import { NextRequest, NextResponse } from 'next/server'
import { getTokens } from '@/utils/tokenStorage'

export async function GET(request: NextRequest) {
  try {
    // Get authentication token
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Extract token
    const token = authHeader.split(' ')[1]
    
    // Initialize results object
    const results: Record<string, any> = {}
    
    // Add tokens to results (just for debugging - token is truncated for security)
    results['tokens'] = { 
      access_token: token.substring(0, 5) + '...',
      user_id: getTokens()?.user_id || 'unknown'
    }
    
    // Define endpoints to fetch
    const endpoints = [
      { key: 'profile', path: 'profile' },
      { key: 'activities-heart', path: 'activities/heart/date/today/1w' },
      { key: 'sleep', path: 'sleep/date/today' },
      { key: 'activities', path: 'activities/date/today' },
      { key: 'devices', path: 'devices' },
      { key: 'activities-steps', path: 'activities/steps/date/today/7d' }
    ]
    
    // Fetch data from each endpoint
    const fetchPromises = endpoints.map(async (endpoint) => {
      try {
        console.log(`Fetching ${endpoint.key} from Fitbit API...`)
        const response = await fetch(`https://api.fitbit.com/1/user/-/${endpoint.path}.json`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          results[endpoint.key] = data
          console.log(`Fetched ${endpoint.key} successfully`)
        } else {
          const errorData = await response.text()
          console.error(`Failed to fetch ${endpoint.key}:`, response.status, errorData)
          results[endpoint.key] = { error: `API Error: ${response.status}` }
        }
      } catch (error) {
        console.error(`Error fetching ${endpoint.key}:`, error)
        results[endpoint.key] = { error: 'Failed to fetch data' }
      }
    })
    
    // Wait for all fetch operations to complete
    await Promise.all(fetchPromises)
    
    // Return the raw data exactly as received from Fitbit
    return NextResponse.json(results)
  } catch (error) {
    console.error('Error fetching raw data:', error)
    return NextResponse.json({ error: 'Failed to fetch raw data' }, { status: 500 })
  }
} 