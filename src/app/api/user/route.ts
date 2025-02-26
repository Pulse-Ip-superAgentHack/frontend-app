import { NextRequest, NextResponse } from 'next/server'
import { getTokens } from '@/utils/tokenStorage'
import demoData from '@/data/demoUserData.json'

export async function GET(request: NextRequest) {
  try {
    // Get authentication token
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader) {
      // Return demo data in development
      if (process.env.NODE_ENV === 'development') {
        return NextResponse.json(demoData)
      }
      
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Extract token
    const token = authHeader.split(' ')[1]
    
    // Verify token and fetch user data
    // For demo purposes, we'll just return demo data
    // In production, you would fetch real user data from your database or API
    if (process.env.NODE_ENV === 'production') {
      // Implement real data fetching from your backend
      try {
        const response = await fetch('https://your-api.com/user', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const userData = await response.json();
        return NextResponse.json(userData);
      } catch (error) {
        console.error('Failed to fetch from real API:', error);
        // Optional: You could still return demo data as a last resort fallback
        // return NextResponse.json(demoData);
        
        // Or return an error to show there's an issue
        return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
      }
    } else {
      // Return demo data in development
      return NextResponse.json(demoData)
    }
  } catch (error) {
    console.error('Error fetching user data:', error)
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 500 })
  }
} 