import { NextRequest, NextResponse } from 'next/server';

// Access the same session store
const SESSION_STORE = new Map();

export async function GET(request: NextRequest) {
  try {
    // Get session ID from cookie
    const sessionId = request.cookies.get('fitbit_auth_session')?.value;
    if (!sessionId) {
      return NextResponse.redirect('/auth/error?reason=no_session');
    }
    
    // Get session data
    const session = SESSION_STORE.get(sessionId);
    if (!session) {
      return NextResponse.redirect('/auth/error?reason=session_expired');
    }
    
    // Check if session expired
    if (session.expires < Date.now()) {
      SESSION_STORE.delete(sessionId);
      return NextResponse.redirect('/auth/error?reason=session_expired');
    }
    
    // Get authorization code and state from URL
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    
    // Validate state to prevent CSRF
    if (!state || state !== session.state) {
      return NextResponse.redirect('/auth/error?reason=invalid_state');
    }
    
    if (!code) {
      return NextResponse.redirect('/auth/error?reason=no_code');
    }
    
    // Exchange code for token
    const clientId = process.env.FITBIT_CLIENT_ID || '23Q44W';
    const clientSecret = process.env.FITBIT_CLIENT_SECRET;
    
    if (!clientSecret) {
      console.error('FITBIT_CLIENT_SECRET not configured!');
      return NextResponse.redirect('/auth/error?reason=missing_secret');
    }
    
    // Basic auth for Fitbit
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    // Exchange authorization code for tokens
    const tokenUrl = 'https://api.fitbit.com/oauth2/token';
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('grant_type', 'authorization_code');
    formData.append('code', code);
    formData.append('code_verifier', session.codeVerifier);
    formData.append('redirect_uri', 'https://pulseip.shreyanshgajjar.com/callback');
    
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });
    
    const tokenData = await tokenResponse.json();
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return NextResponse.redirect(`/auth/error?reason=token_error&message=${encodeURIComponent(tokenData.error || 'Unknown error')}`);
    }
    
    // Clear session
    SESSION_STORE.delete(sessionId);
    
    // Redirect to success page with token data in encrypted cookie
    const response = NextResponse.redirect('/auth/success');
    
    // Set tokens in HTTP-only cookies
    response.cookies.set('fitbit_access_token', tokenData.access_token, {
      httpOnly: true,
      secure: true,
      maxAge: tokenData.expires_in,
      path: '/'
    });
    
    response.cookies.set('fitbit_refresh_token', tokenData.refresh_token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/'
    });
    
    // Also set a client-accessible flag that login is complete
    response.cookies.set('fitbit_authenticated', 'true', {
      secure: true,
      maxAge: tokenData.expires_in,
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Auth completion error:', error);
    return NextResponse.redirect('/auth/error?reason=server_error');
  }
} 