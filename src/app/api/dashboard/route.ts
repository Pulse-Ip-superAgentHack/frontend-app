import { NextRequest, NextResponse } from 'next/server'
import { getTokens } from '@/utils/tokenStorage'
import demoData from '@/data/demoDashboardData.json'

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
    
    // In production, connect to your real API endpoint
    if (process.env.NODE_ENV === 'production') {
      try {
        const response = await fetch('https://your-api.com/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const dashboardData = await response.json();
        return NextResponse.json(dashboardData);
      } catch (error) {
        console.error('Failed to fetch from real API:', error);
        return NextResponse.json(demoData); // Fallback to demo data
      }
    } else {
      // Return demo data in development
      return NextResponse.json(demoData)
    }
  } catch (error) {
    console.error('Error fetching dashboard data:', error)
    return NextResponse.json({ error: 'Failed to fetch dashboard data' }, { status: 500 })
  }
} 