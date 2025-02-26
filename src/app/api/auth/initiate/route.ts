import { NextRequest, NextResponse } from 'next/server';
import { randomBytes, createHash } from 'crypto';

// Create a server-side session store (not reliable in serverless environments)
const SESSION_STORE = new Map();

export async function GET(request: NextRequest) {
  try {
    // Generate PKCE code verifier (random string)
    const codeVerifier = randomBytes(64).toString('hex');
    
    // Generate random state
    const state = randomBytes(32).toString('hex');
    
    // Generate code challenge from verifier
    const hashedVerifier = createHash('sha256').update(codeVerifier).digest();
    const codeChallenge = hashedVerifier.toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    // Store in server-side session (with expiration)
    const sessionId = randomBytes(16).toString('hex');
    SESSION_STORE.set(sessionId, {
      codeVerifier,
      state,
      expires: Date.now() + (10 * 60 * 1000) // 10 minutes
    });
    
    // Define the scopes your app needs
    const scopes = [
      'activity',
      'heartrate',
      'location',
      'nutrition',
      'profile',
      'settings',
      'sleep',
      'social',
      'weight'
    ].join(' ');
    
    // Build the authorization URL
    const authUrl = new URL('https://www.fitbit.com/oauth2/authorize');
    authUrl.searchParams.append('client_id', '23Q44W');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');
    authUrl.searchParams.append('scope', scopes);
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('redirect_uri', 'https://pulseip.shreyanshgajjar.com/callback');
    
    // Set cookie with session ID
    const response = NextResponse.redirect(authUrl);
    
    // 1. Set the session ID cookie (server-side)
    response.cookies.set('fitbit_auth_session', sessionId, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 10, // 10 minutes
      path: '/'
    });
    
    // 2. Also set code verifier in a non-HTTP-only cookie as fallback
    response.cookies.set('fitbit_code_verifier_fallback', codeVerifier, {
      httpOnly: false,
      secure: true,
      maxAge: 60 * 10, // 10 minutes
      path: '/'
    });
    
    // 3. Add script to store code verifier in localStorage
    const script = `
      <html>
        <head>
          <title>Redirecting to Fitbit...</title>
          <script>
            // Store code verifier in localStorage as another fallback
            localStorage.setItem('fitbit_code_verifier', '${codeVerifier}');
            localStorage.setItem('fitbit_auth_state', '${state}');
            // Redirect to Fitbit auth URL
            window.location.href = "${authUrl.toString()}";
          </script>
        </head>
        <body>
          <p>Redirecting to Fitbit authorization page...</p>
        </body>
      </html>
    `;
    
    return new NextResponse(script, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Failed to initiate OAuth:', error);
    return NextResponse.json({ error: 'Failed to initiate OAuth' }, { status: 500 });
  }
} 