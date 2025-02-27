import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get code from URL params
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      return NextResponse.json({ error: 'No authorization code provided' }, { status: 400 });
    }
    
    // Use hardcoded client ID for testing (same as in your initiate route)
    const clientId = '23Q44W';
    const clientSecret = process.env.FITBIT_CLIENT_SECRET;
    
    if (!clientSecret) {
      console.error('FITBIT_CLIENT_SECRET not configured!');
      return NextResponse.json({ error: 'Client secret not configured' }, { status: 500 });
    }
    
    // Basic auth for Fitbit
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    
    // Exchange authorization code for tokens
    const tokenUrl = 'https://api.fitbit.com/oauth2/token';
    const formData = new URLSearchParams();
    formData.append('client_id', clientId);
    formData.append('grant_type', 'authorization_code');
    formData.append('code', code);
    formData.append('redirect_uri', 'https://pulseip.shreyanshgajjar.com/callback');
    
    // Log the request we're about to make
    console.log('Making token request', {
      url: tokenUrl,
      code: code.substring(0, 5) + '...',
      clientId,
      hasSecret: !!clientSecret
    });
    
    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${basicAuth}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formData.toString()
    });
    
    const responseText = await tokenResponse.text();
    console.log('Response status:', tokenResponse.status);
    console.log('Response headers:', Object.fromEntries(tokenResponse.headers.entries()));
    console.log('Response body length:', responseText.length);
    
    let tokenData;
    try {
      tokenData = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse response as JSON:', responseText);
      return NextResponse.json({ 
        error: 'Invalid response from Fitbit API',
        status: tokenResponse.status,
        body: responseText.substring(0, 500) // Show first 500 chars
      }, { status: 500 });
    }
    
    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', tokenData);
      return NextResponse.json({ 
        error: `Token exchange failed: ${tokenData.error || 'Unknown error'}`,
        details: tokenData,
        status: tokenResponse.status
      }, { status: tokenResponse.status });
    }
    
    // If we get here, authentication was successful!
    console.log('Token exchange successful! Setting cookies...');
    
    // Set cookies and return success
    const response = NextResponse.json({ success: true });
    
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
    
    response.cookies.set('fitbit_authenticated', 'true', {
      secure: true,
      maxAge: tokenData.expires_in,
      path: '/'
    });
    
    return response;
  } catch (error) {
    console.error('Auth exchange error:', error);
    return NextResponse.json({ 
      error: String(error),
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
} 