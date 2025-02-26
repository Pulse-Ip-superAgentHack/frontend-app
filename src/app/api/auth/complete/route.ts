import { NextRequest, NextResponse } from 'next/server';

// Access the same session store
const SESSION_STORE = new Map();

export async function GET(request: NextRequest) {
  try {
    // Parse URL params
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const clientVerifier = url.searchParams.get('code_verifier'); // From client-side
    
    // Get session ID from cookie
    const sessionId = request.cookies.get('fitbit_auth_session')?.value;
    
    // Get code verifier from cookie (fallback)
    const cookieVerifier = request.cookies.get('fitbit_code_verifier_fallback')?.value;
    
    // Try to get the session
    let session = null;
    let codeVerifier = null;
    
    if (sessionId) {
      session = SESSION_STORE.get(sessionId);
      if (session && session.expires > Date.now()) {
        codeVerifier = session.codeVerifier;
        console.log('Using session-based code verifier');
      } else {
        console.log('Session expired or not found');
      }
    }
    
    // If no session-based verifier, use client-provided one or cookie
    if (!codeVerifier) {
      if (clientVerifier) {
        codeVerifier = clientVerifier;
        console.log('Using client-provided code verifier');
      } else if (cookieVerifier) {
        codeVerifier = cookieVerifier;
        console.log('Using cookie-based code verifier');
      }
    }
    
    // Validate we have a code and verifier
    if (!code) {
      return NextResponse.redirect('/auth/error?reason=no_code');
    }
    
    if (!codeVerifier) {
      return NextResponse.redirect('/auth/error?reason=no_verifier');
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
    formData.append('code_verifier', codeVerifier);
    formData.append('redirect_uri', 'https://pulseip.shreyanshgajjar.com/callback');
    
    console.log('Token request params:', {
      code: code.substring(0, 10) + '...',
      verifier_length: codeVerifier.length,
      client_id: clientId
    });
    
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
    if (sessionId) {
      SESSION_STORE.delete(sessionId);
    }
    
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
    
    // Add script to clear localStorage verification data
    response.cookies.delete('fitbit_code_verifier_fallback');
    
    return response;
  } catch (error) {
    console.error('Auth completion error:', error);
    return NextResponse.redirect('/auth/error?reason=server_error');
  }
} 