import { NextResponse } from 'next/server'

export async function GET() {
  // Create a response that redirects to home
  const response = NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'https://pulseip.shreyanshgajjar.com'))
  
  // Clear all the authentication cookies
  response.cookies.delete('fitbit_authenticated')
  response.cookies.delete('fitbit_access_token')
  response.cookies.delete('fitbit_refresh_token')
  response.cookies.delete('fitbit_auth_session')
  
  return response
} 